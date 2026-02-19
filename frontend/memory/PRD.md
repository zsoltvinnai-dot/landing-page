# ANITA | Art of Beauty - PRD

## Projekt Áttekintés
Szépészeti szalon geo-optimalizált landing weboldal Mosonmagyaróváron.

## Eredeti Probléma
Készíts egy "ANITA | Art of Beauty" szépészeti szalon landing weboldalát amely geo optimalizált. Brattengeier Anita kozmetikus, szempillás, sminkes szalonja.

## Felhasználói Választások
- **Színvilág:** Arany/bézs/krém (luxus, elegáns)
- **Árlista verzió:** A verzió (lézer nélkül)
- **Időpontfoglalás:** Kapcsolatfelvételi űrlap (nem booking rendszer)
- **Nyelv:** Magyar

## Célközönség
- Nők 20-55 éves korosztály
- Mosonmagyaróvár és környéke
- Prémium szépészeti szolgáltatásokat keresők

## Implementált Funkciók (2026.02.10)

### Frontend
- [x] Hero szekció parallax háttérrel
- [x] Navigáció smooth scroll-al
- [x] Mobil hamburger menü
- [x] Szolgáltatások tab rendszerrel (6 kategória)
- [x] Teljes árlista megjelenítés
- [x] Rólam szekció
- [x] Hűségprogram szekció (4 szint + referral)
- [x] Kapcsolatfelvételi űrlap validációval
- [x] Google Maps integráció
- [x] Social media linkek (Instagram, Facebook)
- [x] Footer elérhetőségekkel
- [x] Geo SEO meta tagek (OG, geo.position, stb.)

### Backend
- [x] FastAPI /api/contact endpoint
- [x] MongoDB integráció
- [x] Email validáció
- [x] Magyar nyelvű válaszüzenetek

### Design
- [x] Playfair Display + Mulish betűtípusok
- [x] Arany (#D4AF37) / Krém (#F9F7F2) színpaletta
- [x] Editorial/magazin stílusú elrendezés
- [x] Hover animációk

## Backlog / Következő Lépések
- P1: Saját képanyag feltöltése (felhasználó munkái)
- P1: Google Analytics integráció
- P2: Online időpontfoglaló rendszer
- P2: Galéria szekció vendégmunkákkal
- P3: Blog szekció szépségápolási tippekkel
- P3: Hírlevél feliratkozás

## Technikai Stack
- Frontend: React + Tailwind CSS + Shadcn UI
- Backend: FastAPI + MongoDB
- Hosting: Emergent Platform
