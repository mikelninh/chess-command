import { readFileSync, writeFileSync } from 'node:fs';
const banner = `/* Tri-D Command bundle — generated from src/engine.js + src/openings.js + src/app.js */\n`;
const parts = ['src/engine.js','src/openings.js','src/app.js'].map(p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
writeFileSync(new URL('../bundle.js', import.meta.url), banner + parts.join('\n\n'));
console.log('bundle.js built');
