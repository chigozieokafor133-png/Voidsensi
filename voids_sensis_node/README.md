# VOID'S SENSI'S — Node.js Edition

Express-powered version of the VOID'S SENSI'S gaming tools website.

## Structure

```text
voids-sensis/
├── data/
│   └── phones.js              # Phone brands and popular models
├── public/
│   ├── index.html             # Main website
│   ├── aim-training.html
│   ├── challenge-zone.html
│   ├── dark-gaming-design.html
│   ├── dpi-guide.html
│   ├── hud-layouts.html
│   ├── phone-performance.html
│   ├── sensi-test-lab.html
│   ├── setup-finder.html
│   ├── theme-switcher.html
│   ├── weapon-guide.html
│   └── assets/
│       ├── voids.css
│       ├── voids.js
│       └── api.js
├── package.json
├── server.js
└── README.md
```

## Run locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## API routes

- `GET /api/health` — server health
- `GET /api/brands` — all supported brands
- `GET /api/phones?brand=Samsung&q=S24` — phone search
- `GET /api/sensitivity-profiles?brand=Samsung&model=Galaxy%20S24%20Ultra&ram=12&style=Balanced` — generated starting sensitivity profile

The API is intentionally a starting point: it does not claim to discover a game's private settings or provide cheats/exploits. The sensitivity values are configurable starting suggestions.
