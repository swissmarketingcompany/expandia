const fs = require('fs');
const cities = JSON.parse(fs.readFileSync('data/cities-top250.json', 'utf8'));
const existing = fs.readdirSync('assets/local').filter(f => f.includes('-hero.jpg'));
const existingSlugs = new Set(existing.map(f => f.replace('b2b-lead-generation-', '').replace('-hero.jpg', '')));

const missing = cities.filter(c => !existingSlugs.has(c.slug.replace('b2b-lead-generation-', '')));
console.log('Missing hero images (' + missing.length + ' out of 250):');
console.log('');
missing.forEach(c => console.log(c.slug.replace('b2b-lead-generation-', '') + '-hero.jpg'));
