# Mapping the Nakba

A web-based interactive map documenting the ongoing Nakba through a cartographic archive of dispossession, occupation, and erasure from 1947 to present.

## Features

- **Historical map tiles** — 6 layers from Palestine Open Maps spanning 1875–1951, including British Survey of Palestine sheets, RAF aerial photography, and early Israeli surveys
- **Interactive timeline** — 11 key historical events from the Nakba (1948) through the ongoing war on Gaza (2023–26), each highlighting affected regions on the map
- **Geographic boundaries** — Mandatory Palestine, Gaza Strip, and West Bank polygons rendered from sourced coordinates
- **Region highlighting** — Selecting an event highlights the relevant geographic area (Gaza Strip, West Bank, Jerusalem, etc.)
- **Satellite overlay** — Esri World Imagery layer for present-day reference
- **Bilingual interface** — Full English and Arabic support
- **Layer controls** — Toggle visibility and adjust opacity per map layer

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Map engine | MapLibre GL |
| State | Pinia |
| Build | Vite |
| Styling | Tailwind CSS |
| Search | Fuse.js |

## Data Sources

Historical map tiles from [Palestine Open Maps](https://palopenmaps.org).  
Event data and casualty figures sourced from UN OCHA OPT, B'Tselem, Human Rights Watch, Amnesty International, Gaza Health Ministry, ICJ, ICC, UNRWA, and the UN Goldstone Report.

## Run Locally

```bash
cd vue
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build

```bash
cd vue
npm run build
npm run preview
```

Output goes to `vue/dist/`.

## Deploy

Deployed on [Vercel](https://mapping-the-nakba.vercel.app). Configuration in `vue/vercel.json`.

## License

MIT
