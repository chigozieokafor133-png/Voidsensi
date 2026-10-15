const express = require('express');
const path = require('path');
const phones = require('./data/phones');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(express.static(publicDir, { extensions: ['html'] }));

const profiles = {
  'Drag Headshot': { General: 184, 'Red Dot': 176, '2x Scope': 162, '4x Scope': 146, Sniper: 88, 'Free Look': 180 },
  'One Tap': { General: 178, 'Red Dot': 168, '2x Scope': 153, '4x Scope': 137, Sniper: 82, 'Free Look': 172 },
  Balanced: { General: 170, 'Red Dot': 158, '2x Scope': 148, '4x Scope': 132, Sniper: 78, 'Free Look': 165 }
};

function listPhones(brand, query) {
  const q = String(query || '').trim().toLowerCase();
  const entries = brand && phones[brand]
    ? phones[brand].map(model => ({ brand, model }))
    : Object.entries(phones).flatMap(([b, list]) => list.map(model => ({ brand: b, model })));
  return q ? entries.filter(x => `${x.brand} ${x.model}`.toLowerCase().includes(q)) : entries;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: "VOID'S SENSI'S API", version: '2.0.0', time: new Date().toISOString() });
});

app.get('/api/brands', (_req, res) => {
  res.json({ brands: Object.keys(phones).sort() });
});

app.get('/api/phones', (req, res) => {
  const brand = String(req.query.brand || '').trim();
  const query = String(req.query.q || '').trim();
  const models = listPhones(brand, query);
  res.json({ brand: brand || null, query: query || null, count: models.length, models });
});

app.get('/api/phones/:brand', (req, res) => {
  const brand = decodeURIComponent(req.params.brand);
  if (!phones[brand]) return res.status(404).json({ error: 'Brand not found.' });
  res.json({ brand, count: phones[brand].length, models: phones[brand].map(model => ({ brand, model })) });
});

app.get('/api/sensitivity-profiles', (req, res) => {
  const brand = String(req.query.brand || '');
  const model = String(req.query.model || 'Default model');
  const ram = Number(req.query.ram || 4);
  const style = String(req.query.style || 'Balanced');
  if (!Number.isFinite(ram) || ram < 1 || ram > 64) return res.status(400).json({ error: 'RAM must be between 1 and 64 GB.' });
  const base = profiles[style] || profiles.Balanced;
  const seed = [...`${brand}${model}${ram}${style}`].reduce((n, c) => n + c.charCodeAt(0), 0);
  const nudge = (seed % 7) - 3;
  const profile = Object.fromEntries(Object.entries(base).map(([key, value], i) => {
    const offset = i === 4 ? Math.round(nudge / 2) : nudge;
    return [key, Math.max(key === 'Sniper' ? 40 : 80, Math.min(200, value + offset))];
  }));
  res.json({ brand, model, ram, style, profile, note: 'Starting values only. Test and adjust to your comfort and device response.' });
});

app.get('/api/tools', (_req, res) => {
  res.json({
    tools: [
      { name: 'HUD Layouts', path: '/hud-layouts.html', type: 'guide' },
      { name: 'DPI Guide', path: '/dpi-guide.html', type: 'guide' },
      { name: 'Aim Training Lab', path: '/aim-training.html', type: 'training' },
      { name: 'Weapon Playstyle Guide', path: '/weapon-guide.html', type: 'guide' },
      { name: 'Phone Performance', path: '/phone-performance.html', type: 'device' },
      { name: 'Sensi Test Lab', path: '/sensi-test-lab.html', type: 'tool' },
      { name: 'Challenge Zone', path: '/challenge-zone.html', type: 'training' },
      { name: 'Setup Finder', path: '/setup-finder.html', type: 'tool' },
      { name: 'Theme Switcher', path: '/theme-switcher.html', type: 'customization' }
    ]
  });
});

app.get('/api/themes', (_req, res) => {
  res.json({ themes: ['purple', 'cyan', 'red', 'green'] });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found.' });
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => console.log(`VOID'S SENSI'S running at http://localhost:${PORT}`));
