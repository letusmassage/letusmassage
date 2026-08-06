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

## Lägga till nya omdömen

1. Öppna Bokadirekt-profilen och gå till avsnittet **Omdömen** (`#reviews`).
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

- **`ratingCount`** = alla betyg, även de utan text (Bokadirekt: "13 betyg").
- **`reviewCount`** i schemat räknas automatiskt från antalet objekt i `items`
  och ska alltså inte fyllas i för hand.
- **`date`** härleds från Bokadirekts relativa tidsangivelse ("för 12 dagar sedan")
  och är därför ±1 dag. Det är gott nog — `datePublished` är inget rankingfält.
- **`lang`** styr `inLanguage` i schemat och `lang`-attributet på citatet.

## Regler som inte får brytas

- **Hitta aldrig på ett omdöme, ett betyg eller ett namn.** Falsk review-markup är
  en av få saker som ger manuell åtgärd i Google Search Console.
- **`aggregateRating` måste matcha det som syns på sidan.** Ändras siffran i JSON
  ändras både texten och schemat samtidigt — låt det förbli så.
- **Ta inte bort negativa omdömen selektivt.** Publiceras omdömen ska urvalet vara
  representativt; annars är det vilseledande. (Alla 13 är i skrivande stund 5 av 5.)

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

### TODO

`GOOGLE_REVIEW_URL` i [`src/pages/Reviews.tsx`](../src/pages/Reviews.tsx) pekar just nu
på kartlänken. Byt till den korta "skriv omdöme"-länken (`https://g.page/r/.../review`)
som finns i GBP-adminen — den öppnar formuläret direkt istället för att kräva ett par
klick till.
