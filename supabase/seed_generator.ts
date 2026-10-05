import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJSON = (file: string) => {
  const filePath = path.join(__dirname, '../src/data', file);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const escapeSQLString = (str: string) => {
  if (!str) return "''";
  return `'${str.replace(/'/g, "''")}'`;
};

const projects = readJSON('projects.json');
const competitions = readJSON('competition.json');
const trainings = readJSON('training.json');
const articles = readJSON('articles.json');

let sql = `-- SQL Seed Data\n\n`;

// Projects
sql += `-- Projects\n`;
projects.forEach((p: any) => {
  const tags = p.tags ? `ARRAY[${p.tags.map((t: string) => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : `'{}'::text[]`;
  const gallery = p.gallery ? `ARRAY[${p.gallery.map((g: string) => `'${g.replace(/'/g, "''")}'`).join(', ')}]` : `'{}'::text[]`;
  sql += `INSERT INTO projects (id, title, category, year, tags, cover, description, detail, gallery) VALUES (${escapeSQLString(p.id)}, ${escapeSQLString(p.title)}, ${escapeSQLString(p.category)}, ${p.year}, ${tags}, ${escapeSQLString(p.cover)}, ${escapeSQLString(p.description)}, ${escapeSQLString(p.detail)}, ${gallery}) ON CONFLICT (id) DO NOTHING;\n`;
});

// Competitions
sql += `\n-- Competitions\n`;
competitions.forEach((c: any) => {
  sql += `INSERT INTO competitions (id, img, title, issuer, year, category) VALUES (${escapeSQLString(c.id)}, ${escapeSQLString(c.img)}, ${escapeSQLString(c.title)}, ${escapeSQLString(c.issuer)}, ${c.year}, ${escapeSQLString(c.category)}) ON CONFLICT (id) DO NOTHING;\n`;
});

// Trainings
sql += `\n-- Trainings\n`;
trainings.forEach((t: any) => {
  sql += `INSERT INTO trainings (id, img, title, issuer, year, category) VALUES (${escapeSQLString(t.id)}, ${escapeSQLString(t.img)}, ${escapeSQLString(t.title)}, ${escapeSQLString(t.issuer)}, ${t.year}, ${escapeSQLString(t.category)}) ON CONFLICT (id) DO NOTHING;\n`;
});

// Articles
sql += `\n-- Articles\n`;
articles.forEach((a: any) => {
  const tags = a.tags ? `ARRAY[${a.tags.map((t: string) => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : `'{}'::text[]`;
  sql += `INSERT INTO articles (id, title, description, date, category, tags, cover, content) VALUES (${escapeSQLString(a.id)}, ${escapeSQLString(a.title)}, ${escapeSQLString(a.description)}, ${escapeSQLString(a.date)}, ${escapeSQLString(a.category)}, ${tags}, ${escapeSQLString(a.cover)}, ${escapeSQLString(a.content)}) ON CONFLICT (id) DO NOTHING;\n`;
});

fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql);
console.log('Seed SQL file successfully generated!');
