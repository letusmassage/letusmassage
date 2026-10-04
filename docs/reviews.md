# Kundomdömen — så uppdateras de

Alla omdömen på sajten kommer från **en enda fil**: [`src/content/reviews.json`](../src/content/reviews.json).

Den läses av två håll, vilket är hela poängen:

| Läsare | Hur | Vad den gör |
| --- | --- | --- |
| `src/content/reviews.ts` | Vite-import | Renderar korten på startsidan och `/recensioner` |
| `scripts/prerender.mjs` | `readFileSync` vid bygge | Bakar in `aggregateRating` + `review` i den statiska HTML:en |

Eftersom båda läser samma fil kan det synliga innehållet aldrig glida isär från
strukturerad data — vilket är ett uttryckligt krav i Googles riktlinjer för
review-markup.

## Hämtning (körs för hand)

`scripts/fetch-reviews.mjs` hämtar allt från Bokadirekts egen platssida — vanlig `fetch`,
ingen headless browser:

| Vad | Källa | Varför |
| --- | --- | --- |
| Omdömena | JSON-API:t som sidan själv anropar: `/api/places/getReviews/135622` | Hela listan, ordagranna texter, exakta tidsstämplar (sidans JSON-LD visar bara de 4 senaste) |
| Totalbetyget | `window.__PRELOADED_STATE__` → `place.reviews.stats` i sidans HTML | Exakt snitt (t.ex. 4.97) och antal betyg inkl. de utan text (JSON-LD:n avrundar till 5) |

Det finns ingen schemalagd rutin — kör skriptet när det passar och committa resultatet.

```bash
node scripts/fetch-reviews.mjs --dry-run
```

```bash
node scripts/fetch-reviews.mjs
```

| Exitkod | Betydelse |
| --- | --- |
| `0` | Nya omdömen eller nytt totalbetyg skrevs till `reviews.json` |
| `2` | Inget nytt — filen orörd |
| `1` | Fel (nätverk, ändrat API/sidstruktur, orimligt aggregat) — **inget skrivs** |

Skriptet lägger bara till, aldrig tar bort, och avbryter hellre än gissar: det vägrar
skriva om Bokadirekt rapporterar färre betyg än vi sparat, om aggregatet är orimligt,
om API:t ger färre omdömen än det själv anger, eller om `reviews.stats` saknas. Omdömen
som försvunnit från Bokadirekt (borttagna eller redigerade) ligger kvar och loggas som
`VARNING` — kontrollera dem för hand.

Språket (`lang`) gissas grovt (sv/en/nb) och styr bara `inLanguage` och `lang`-attributet.
Titta på utskriften och rätta i JSON-filen om gissningen blev fel.

## Lägga till omdömen för hand

Behövs bara för omdömen från andra källor än Bokadirekt (vilket i så fall kräver ett källfält per omdöme — allt attribueras i dag till Bokadirekt).

1. Öppna Bokadirekt-profilen och gå till avsnittet **Omdömen** (`#reviews`).
   Listan är JS-renderad — expandera varje "Läs mer" och bläddra igenom sidorna.
2. Kopiera texten **ordagrant**. Skriv inte om, korta inte ner, rätta inte stavfel.
   Namnen är redan förkortade av Bokadirekt (förnamn + initial) — behåll dem som de är.
3. Lägg till ett objekt i `items`:

   ```json
   {
     "author": "Förnamn E.",
     "rating": 5,
     "date": "2026-08-20",
     "lang": "sv",
     "text": "Omdömet ordagrant."
   }
   ```

4. Uppdatera `aggregate.ratingValue` och `aggregate.ratingCount` så att de matchar
   det Bokadirekt visar överst i omdömesavsnittet, samt `source.lastFetched`.
5. `npm run build` — sorteringen (nyast först) och `reviewCount` räknas ut automatiskt.

### Fält att hålla koll på

- **`ratingValue`** = Bokadirekts exakta snitt avrundat till två decimaler (4.97). Sidan
  visar det med en decimal ("5,0"), schemat med två. `aggregateRating` bakas bara in på
  `/` och `/recensioner/`, där betyget syns.
- **`ratingCount`** = alla betyg, även de utan text (Bokadirekt 2026-10-04: 60 betyg,
  varav 33 med text).
- **`reviewCount`** i schemat räknas automatiskt från antalet objekt i `items`
  och ska alltså inte fyllas i för hand.
- **`date`** = Bokadirekts tidsstämpel (`createdAt`, UTC) omräknad till svenskt datum.
- **`lang`** styr `inLanguage` i schemat och `lang`-attributet på citatet.

## Regler som inte får brytas

- **Hitta aldrig på ett omdöme, ett betyg eller ett namn.** Falsk review-markup är
  en av få saker som ger manuell åtgärd i Google Search Console.
- **`aggregateRating` måste matcha det som syns på sidan.** Ändras siffran i JSON
  ändras både texten och schemat samtidigt — låt det förbli så.
- **Ta inte bort negativa omdömen selektivt.** Publiceras omdömen ska urvalet vara
  representativt; annars är det vilseledande. (Alla 33 skrivna omdömen är i skrivande
  stund 5 av 5; de två 4-betygen saknar text.)

## Om stjärnorna i Google

Sajten visar `aggregateRating` för `LocalBusiness`, men **det ger inte stjärnor i
Googles sökresultat**. Google räknar omdömen som en verksamhet publicerar om sig
själv som "self-serving" och gör sidan icke-berättigad till review rich results —
senast omformulerat i december 2025, och det gäller även omdömen som hämtas in via
tredjepartswidgetar.

Markupen är ändå värd att ha: den beskriver entiteten för Googles
kunskapsgraf, den läses av AI-svarsmotorer (AI Overviews, ChatGPT, Perplexity) när
de sammanfattar "bästa massage i Lund", och den håller sidan konsekvent.

**Stjärnorna i kartpaketet kommer från Google Business Profile** — inte härifrån.
Det är där omdömen ska samlas i första hand. `/recensioner` har därför en
CTA som pekar dit.

### Recensionslänken

`GOOGLE_REVIEW_URL` i [`src/lib/site.ts`](../src/lib/site.ts) är den korta "skriv omdöme"-länken
från profilens admin (`https://g.page/r/CT6P9bm9J0tfEBM/review`). Den öppnar formuläret direkt
och används på `/recensioner/`, i omdömesdelen på startsidan och i sidfoten. Samma länk (eller
QR-koden i samma ruta i admin) kan användas på mottagningen och i uppföljningsmeddelanden.
Be alla kunder — inte bara nöjda — och ge aldrig något i utbyte; båda bryter mot Googles regler.
