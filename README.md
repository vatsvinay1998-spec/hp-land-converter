# HP Land Converter

A small, offline-capable PWA for converting the land units used in Himachal Pradesh revenue records.

- **System A** — Bigha · Biswa · Biswansi (20 biswansi = 1 biswa, 20 biswa = 1 bigha, 1 bigha = 809.371 m² = 8,712 ft²)
- **System B** — Kanal · Marla · Sarsahi (9 sarsahi = 1 marla, 20 marla = 1 kanal, 1 kanal = 505.857 m² = 5,445 ft²)
- Metric and imperial: m², ft², yd², acre, hectare

## Features

- **Convert** any unit to every other unit at once, with the positional reading in both systems (e.g. `2 – 13 – 10` bigha).
- **Rakba** — enter a Jamabandi figure as bigha–biswa–biswansi, kanal–marla–sarsahi or hectare–are–centiare.
- **Karam switch** — standard 66-inch karam or the older 57.5-inch Punjab karam for kanal-based land.
- **Reference** tables, including why "a bigha is not a bigha" across states.
- Installable, works offline, light and dark themes. Tap any result to copy it.

## Run locally

It is plain HTML, CSS and JavaScript with no build step. Serve the folder with any static server, for example:

```bash
npx serve .
```

## Deploy

Deployed on Vercel as a static site (`vercel.json` sets cache headers for the service worker).

## Disclaimer

Figures are for reference. Always verify against the certified Jamabandi (Himbhoomi, Revenue Department, Himachal Pradesh).
