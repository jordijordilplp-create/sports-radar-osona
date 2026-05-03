# SPORTS RADAR — Prototip Web React

Prototip funcional d'una app web per descobrir esdeveniments esportius propers amb mapa interactiu, filtres i formulari d'alta.

## Requisits
- Node.js 18+

## Executar
```bash
npm install
npm start
```

Obre: `http://localhost:3000`

## Funcionalitats incloses
- Landing principal amb branding **SPORTS RADAR** i eslògan.
- Mapa interactiu (Leaflet) amb marcadors mock.
- Filtres per esport, distància, data, tipus de preu.
- Barra de cerca per nom/ubicació.
- Llista de targetes d'esdeveniments amb CTA.
- Modal de detall amb descripció, organitzador, participants i nivell.
- Formulari per afegir esdeveniments (mock local state, sense backend).
- Estat buit quan no hi ha resultats.
- Disseny responsive amb estètica startup esportiva.

## Estructura
- `server.js`: servidor Express per servir el prototip.
- `public/index.html`: shell + càrrega React/Leaflet via CDN.
- `public/app.js`: lògica i components React.
- `public/styles.css`: estil visual i responsive.
