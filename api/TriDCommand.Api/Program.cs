using Microsoft.Data.Sqlite;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

var dataDir = Path.Combine(app.Environment.ContentRootPath, "Data");
Directory.CreateDirectory(dataDir);
var connectionString = $"Data Source={Path.Combine(dataDir, "trid-command.db")}";

await using (var connection = new SqliteConnection(connectionString))
{
    await connection.OpenAsync();
    var command = connection.CreateCommand();
    command.CommandText = """
      CREATE TABLE IF NOT EXISTS sessions(
        id TEXT PRIMARY KEY,
        cadet TEXT NOT NULL,
        mode TEXT NOT NULL,
        opening_id TEXT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT NULL
      );
      CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(session_id) REFERENCES sessions(id)
      );
    """;
    await command.ExecuteNonQueryAsync();
}

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "online",
    service = "TriDCommand.Api",
    storage = "sqlite"
}));

app.MapPost("/api/sessions", async (StartSession request) =>
{
    var id = Guid.NewGuid().ToString("N");
    await using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();
    var command = connection.CreateCommand();
    command.CommandText = """
      INSERT INTO sessions(id,cadet,mode,opening_id,started_at)
      VALUES($id,$cadet,$mode,$opening,$started)
    """;
    command.Parameters.AddWithValue("$id", id);
    command.Parameters.AddWithValue("$cadet", string.IsNullOrWhiteSpace(request.Cadet) ? "anonymous" : request.Cadet.Trim());
    command.Parameters.AddWithValue("$mode", string.IsNullOrWhiteSpace(request.Mode) ? "academy" : request.Mode.Trim());
    command.Parameters.AddWithValue("$opening", (object?)request.OpeningId ?? DBNull.Value);
    command.Parameters.AddWithValue("$started", DateTimeOffset.UtcNow.ToString("O"));
    await command.ExecuteNonQueryAsync();
    return Results.Created($"/api/sessions/{id}", new { id });
});

app.MapPost("/api/sessions/{id}/events", async (string id, SessionEvent request) =>
{
    await using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();

    var exists = connection.CreateCommand();
    exists.CommandText = "SELECT COUNT(*) FROM sessions WHERE id=$id";
    exists.Parameters.AddWithValue("$id", id);
    if (Convert.ToInt32(await exists.ExecuteScalarAsync()) == 0)
        return Results.NotFound(new { error = "session_not_found" });

    var command = connection.CreateCommand();
    command.CommandText = """
      INSERT INTO events(session_id,event_type,payload_json,created_at)
      VALUES($session,$type,$payload,$created)
    """;
    command.Parameters.AddWithValue("$session", id);
    command.Parameters.AddWithValue("$type", request.EventType);
    command.Parameters.AddWithValue("$payload", JsonSerializer.Serialize(request.Payload ?? new Dictionary<string, object?>()));
    command.Parameters.AddWithValue("$created", DateTimeOffset.UtcNow.ToString("O"));
    await command.ExecuteNonQueryAsync();
    return Results.Ok(new { saved = true });
});

app.MapPost("/api/sessions/{id}/complete", async (string id) =>
{
    await using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();
    var command = connection.CreateCommand();
    command.CommandText = "UPDATE sessions SET completed_at=$completed WHERE id=$id";
    command.Parameters.AddWithValue("$completed", DateTimeOffset.UtcNow.ToString("O"));
    command.Parameters.AddWithValue("$id", id);
    var changed = await command.ExecuteNonQueryAsync();
    return changed == 0 ? Results.NotFound() : Results.Ok(new { completed = true });
});

app.MapGet("/api/progress/{cadet}", async (string cadet) =>
{
    await using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();
    var command = connection.CreateCommand();
    command.CommandText = """
      SELECT s.mode, s.opening_id, COUNT(DISTINCT s.id) AS sessions, COUNT(e.id) AS events
      FROM sessions s
      LEFT JOIN events e ON e.session_id=s.id
      WHERE s.cadet=$cadet
      GROUP BY s.mode, s.opening_id
      ORDER BY sessions DESC
    """;
    command.Parameters.AddWithValue("$cadet", cadet);

    var rows = new List<object>();
    await using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        rows.Add(new
        {
            mode = reader.GetString(0),
            openingId = reader.IsDBNull(1) ? null : reader.GetString(1),
            sessions = reader.GetInt32(2),
            events = reader.GetInt32(3)
        });
    }
    return Results.Ok(rows);
});

app.Run();

record StartSession(string Cadet, string Mode, string? OpeningId);
record SessionEvent(string EventType, Dictionary<string, object?>? Payload);
