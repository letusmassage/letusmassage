# Plan — September 2026 changes (Letta's notes of 2026-09-01)

Status: **plan only, nothing implemented yet.** Written 2026-09-06 from the Google Drive
folder `~/Downloads/drive-download-20260906T160400Z-1-001` (also on Letta's Drive):

| File | Used for |
| --- | --- |
| `Changes i want to make.docx` | The four change requests (bottom of the file, dated 2026-09-01) |
| `GIFT CARD.odt` | New copy for `/presentkort` in EN / SV / EL |
| `FRISKVÅRDSBIDRAG.odt` | Teaser + new Friskvård page copy in SV / EN / EL |
| `Fysiskt presentkort.jpg` | Photo of the physical gift card (3434×2575, 1.9 MB) |
| `Benifex_Logo_OnLight_RGB.png` | Benifex logo (2042×982, transparent) |
| `Epassi logo.png` | Epassi logo (640×360, transparent) |
| `Kroppsterapeuterna_Centrerad_devis.jpg` | Second Kroppsterapeuterna logo (300×224) |

Everything below was checked against the live site and Bokadirekt on 2026-09-06.

## 0. Overview

| # | Letta's item | What changes | Files |
| --- | --- | --- | --- |
| 1 | Gift card page: new text, photo, two Bokadirekt buttons | Rewrite `/presentkort` layout + copy in 3 languages, add photo, both CTAs deep-link to Bokadirekt | `src/pages/Gifts.tsx`, 3× `locales/*.json`, `scripts/prerender.mjs`, `public/presentkort-fysiskt.jpg` |
| 2a | Friskvård teaser under the hero | New `FriskvardTeaser` card straddling the hero's bottom edge, with Benifex + Epassi logos | `src/components/FriskvardTeaser.tsx`, `src/pages/Home.tsx`, locales, `public/partners/*` |
| 2b | Friskvård page between Techniques and Gift Cards | New route `/friskvard`, nav + footer links, full page with logos, steps, treatments, FAQ, CTA | `src/pages/Friskvard.tsx`, `src/App.tsx`, `Navbar.tsx`, `Footer.tsx`, locales, `prerender.mjs`, `sitemap.xml` |
| 3 | Second Kroppsterapeuterna logo | Add it next to the existing badge, same height | `src/components/About.tsx`, `public/kroppsterapeuterna-devis.png`, `src/admin/imageManifest.ts` |
| 4 | Parking: space no. 6 | Add "nr 6" to the parking text in 3 languages | 3× `locales/*.json` |
| — | Consistency fixes the new flow makes necessary (recommended) | Home FAQ answer, friskvård article, schema `paymentAccepted`, Benify→Benifex | see §7 |

Ground rules for whoever implements this:

- Repo conventions: Swedish comments and Swedish conventional-commit messages, Tailwind v4 utilities, all copy via `react-i18next` (`sv.json` is the fallback and the source for `prerender.mjs`), per-page SEO = Helmet in the page **and** a route entry in `scripts/prerender.mjs` **and** a `<url>` in `public/sitemap.xml`.
- All copy in this document is **verbatim from Letta's files** (typographic quotes kept). Do not rewrite or "improve" it. The only strings I added are marked *(added — not in Letta's text)*.
- Every new string must exist in all three locale files; `el.json` is the largest and is easy to forget.
- Paul's request on top of Letta's notes: **the Benifex and Epassi logos must appear on the Friskvård page itself**, not only in the teaser (§4.2).

## 1. Assets (do this first)

Output files and processing. `sharp` is already a devDependency; `scripts/optimize-images.mjs` is a one-time script that must **not** be re-run (it recompresses everything), so use a separate one-off script.

| Source (Downloads folder) | Output | Processing |
| --- | --- | --- |
| `Benifex_Logo_OnLight_RGB.png` | `public/partners/benifex.png` | `.trim()` the transparent padding, width 640 |
| `Epassi logo.png` | `public/partners/epassi.png` | `.trim()`, width 640 (no enlargement) |
| `Fysiskt presentkort.jpg` | `public/presentkort-fysiskt.jpg` | `.rotate()` (EXIF), width 1400, JPEG q78 mozjpeg → expect ≈150–200 KB |
| `Kroppsterapeuterna_Centrerad_devis.jpg` | `public/kroppsterapeuterna-devis.png` | convert to PNG; its white background is fine on the white About section |

No `.webp` siblings for these four: the `/admin` image-swap replaces the main file only, and a stale webp sibling would otherwise win in `<picture>`. (The logos are tiny as PNG anyway.)

```js
// scripts/prepare-assets-2026-09.mjs — engångskörning från repo-roten:
//   node scripts/prepare-assets-2026-09.mjs
// Kan tas bort efteråt (eller behållas som dokumentation, som optimize-images.mjs).
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC = '/Users/paul/Downloads/drive-download-20260906T160400Z-1-001'
mkdirSync('public/partners', { recursive: true })

const logo = (file) => sharp(`${SRC}/${file}`).trim().resize({ width: 640, withoutEnlargement: true })
await logo('Benifex_Logo_OnLight_RGB.png').png({ compressionLevel: 9 }).toFile('public/partners/benifex.png')
await logo('Epassi logo.png').png({ compressionLevel: 9 }).toFile('public/partners/epassi.png')

await sharp(`${SRC}/Fysiskt presentkort.jpg`)
  .rotate()
  .resize({ width: 1400, withoutEnlargement: true })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile('public/presentkort-fysiskt.jpg')

await sharp(`${SRC}/Kroppsterapeuterna_Centrerad_devis.jpg`).png().toFile('public/kroppsterapeuterna-devis.png')
```

After running: read the real pixel sizes (`sips -g pixelWidth -g pixelHeight public/partners/*.png public/presentkort-fysiskt.jpg`) and put them as `width`/`height` on every `<img>` so nothing shifts (CLS). Then register the four files in `src/admin/imageManifest.ts` so Letta can swap them herself:

- group "Friskvård": `partners/benifex.png` ("Benifex-logotyp"), `partners/epassi.png` ("Epassi-logotyp") — hint: PNG med genomskinlig bakgrund, liggande.
- group "Presentkort": `presentkort-fysiskt.jpg` ("Foto – fysiskt presentkort") — hint: liggande 4:3, JPG.
- group "Om oss": `kroppsterapeuterna-devis.png` ("Kroppsterapeuterna – logotyp med devis").

Optional but recommended: put the three Bokadirekt URLs in one place, `src/lib/bokadirekt.ts`, and use it from the new/changed files (the place URL is currently hard-coded in 8 files; no need to refactor the old ones now):

```ts
export const BOKADIREKT_PLACE = 'https://www.bokadirekt.se/places/let-us-massage-lund-135622'
export const BOKADIREKT_GIFTCARD = `${BOKADIREKT_PLACE}/giftcard/checkout`
// Gratis 15-minuterstjänst "Fysiskt presentkort – köp & hämta på plats" (tjänst-id 3503229)
export const BOKADIREKT_PHYSICAL_GIFTCARD =
  'https://www.bokadirekt.se/boka-tjanst/let-us-massage-lund-135622/fysiskt-presentkort-kop-hamta-pa-plats-3503229'
```

Both deep links were fetched on 2026-09-06 and return 200: the checkout page shows "Välj belopp och antal", the service page is titled "Boka Fysiskt presentkort – köp & hämta på plats" (15 min, 0 kr, "Betalning sker på plats med kort eller Swish").

## 2. Gift card page `/presentkort` (item 1)

### 2.1 Layout (top to bottom)

1. **Header** — same gradient header as today, but two columns on `md+` (text left, photo right; photo below the text on mobile). Left: eyebrow, `h1` title, lede (italic), the quote line (serif, italic), then the four intro lines as separate `<p>`. Right: `presentkort-fysiskt.jpg` in a `rounded-3xl shadow-xl aspect-[4/3] object-cover` frame. This is the "add the picture somewhere" — it gets prominence without making the two option cards asymmetric.
2. **"Ge bort något som verkligen uppskattas"** — short centered block, `max-w-3xl`, h2 + two lines.
3. **"Välj hur du vill ge bort din present"** — h2, then the existing two-card grid. Card 1 *Digitalt presentkort* (✶ icon as today), card 2 *Fysiskt presentkort* (❀ icon). Both buttons solid `bg-sky-500` (they are equal options; today the second one is an outline "Kontakta oss"). Under the physical button: the small italic note about appointment + card/Swish.
4. **"En present för alla tillfällen"** — `bg-stone-50` section: h2, the occasions as a row of small pills (or a centered list with "·" separators), then the two closing lines and finally "Let Us Massage" in serif + the tagline.
5. **FAQ** — keep the existing five Q&As and the FAQPage JSON-LD exactly as now (not in Letta's new text, but still correct and useful; see question 2 in §10).

Removed: the old `intro1/intro2`, the bullet lists under each card, and the `/#location` link on the physical card.

### 2.2 Links

| Button | Target |
| --- | --- |
| Digital → "Köp presentkort online" | `BOKADIREKT_GIFTCARD` (checkout, choose amount) |
| Physical → "Köp & hämta presentkort på plats" | `BOKADIREKT_PHYSICAL_GIFTCARD` (book the free 15-min slot) |

Both `target="_blank" rel="noopener noreferrer"`, both with the `→` suffix like the rest of the site.

### 2.3 i18n — replace the whole `gifts` object (keep the existing `gifts.faq` untouched)

Key layout (same in all three files): `eyebrow, title, lede, quote, intro[4], enjoy{title,p1,p2}, choose{title}, digital{title,p1,p2,cta}, physical{title,p1,p2,p3,p4,cta,note}, occasions{title,items[],p1,p2}, closing{tagline}, imageAlt, faq (unchanged), seo`.

**sv.json**

```json
"gifts": {
  "eyebrow": "Presentkort",
  "title": "Presentkort",
  "lede": "Ge bort avkoppling",
  "quote": "En present som säger: ”Ta lite tid för dig själv.”",
  "intro": [
    "Vissa presenter öppnas och glöms snabbt bort.",
    "Andra ger något som verkligen kan njutas av, en stund av lugn, omtanke och välbefinnande.",
    "Med ett presentkort från Let Us Massage ger du bort tid för någon att ta hand om sig själv, en skön massageupplevelse som anpassas efter personens behov.",
    "En omtänksam present till någon du tycker om, en vän, kollega eller helt enkelt någon som behöver en liten paus från vardagen."
  ],
  "enjoy": {
    "title": "Ge bort något som verkligen uppskattas",
    "p1": "Du behöver inte veta vilken massage som passar bäst.",
    "p2": "Mottagaren kan själv välja den behandling som passar och njuta av en personlig massageupplevelse i en lugn och trivsam miljö mitt i Lund."
  },
  "choose": { "title": "Välj hur du vill ge bort din present" },
  "digital": {
    "title": "Digitalt presentkort",
    "p1": "Vill du ha ett enkelt och snabbt alternativ?",
    "p2": "Köp presentkortet online via Bokadirekt. Det passar perfekt när du vill ge bort en fin och uppskattad present – även när du är ute i sista minuten.",
    "cta": "Köp presentkort online"
  },
  "physical": {
    "title": "Fysiskt presentkort",
    "p1": "Vill du att presenten ska kännas lite mer personlig?",
    "p2": "Du kan köpa ett fysiskt presentkort direkt hos Let Us Massage.",
    "p3": "Vi förbereder ett fint, tryckt presentkort i ett kuvert, färdigt att ge bort till någon speciell.",
    "p4": "Du väljer själv beloppet och får med dig en riktig present som mottagaren kan se fram emot.",
    "cta": "Köp & hämta presentkort på plats",
    "note": "Det fysiska presentkortet köps efter tidsbokning hos Let Us Massage. Betalning sker med kort eller Swish."
  },
  "occasions": {
    "title": "En present för alla tillfällen",
    "items": ["Födelsedag", "Jul", "Årsdag", "Ett tack", "En speciell dag", "Eller helt enkelt för att någon behöver det"],
    "p1": "Ibland är den bästa presenten inte något man behöver spara.",
    "p2": "Det är lite tid för sig själv."
  },
  "closing": { "tagline": "Professionell massage, personlig omtanke och en stund som bara är din." },
  "imageAlt": "Fysiskt presentkort från Let Us Massage i Lund – tryckt kort med personlig hälsning",
  "faq": { "...": "behåll befintligt objekt oförändrat" },
  "seo": {
    "title": "Presentkort på massage i Lund | Let Us Massage",
    "description": "Ge bort avkoppling – presentkort från Let Us Massage i Lund. Köp digitalt presentkort online via Bokadirekt eller boka en tid och hämta ett fysiskt presentkort på plats."
  }
}
```

**en.json**

```json
"gifts": {
  "eyebrow": "Gift Cards",
  "title": "Gift Card",
  "lede": "Give the gift of relaxation",
  "quote": "A gift that says, “Take some time for yourself.”",
  "intro": [
    "Some gifts are opened and quickly forgotten.",
    "Others give you something to truly enjoy, a moment of calm, care and wellbeing.",
    "With a Let Us Massage gift card, you are giving someone the gift of time for themselves, a relaxing massage experience tailored to their needs.",
    "It’s a thoughtful gift for someone you love, a friend, a colleague, or simply someone who deserves a little break from everyday life."
  ],
  "enjoy": {
    "title": "Give a gift they will truly enjoy",
    "p1": "You don’t need to know which massage is right for them.",
    "p2": "The recipient can choose the treatment that suits them best and enjoy a personal massage experience in a calm and welcoming environment in the heart of Lund."
  },
  "choose": { "title": "Choose how you want to give your gift" },
  "digital": {
    "title": "Digital Gift Card",
    "p1": "Looking for something quick and easy?",
    "p2": "Purchase a gift card online through Bokadirekt. It’s the perfect choice when you want to give someone a thoughtful gift, even at the last minute.",
    "cta": "Buy a Gift Card Online"
  },
  "physical": {
    "title": "Physical Gift Card",
    "p1": "Would you like your gift to feel a little more personal?",
    "p2": "You can purchase a physical gift card directly from Let Us Massage.",
    "p3": "We’ll prepare a beautiful printed gift card in an envelope, ready for you to give to someone special.",
    "p4": "Choose the amount you would like to give and take home a real gift they can look forward to.",
    "cta": "Buy & Collect Your Gift Card",
    "note": "Physical gift cards are purchased by appointment at Let Us Massage. Payment is available by card or Swish."
  },
  "occasions": {
    "title": "A gift for every occasion",
    "items": ["Birthdays", "Christmas", "Anniversaries", "A thank you", "A special occasion", "Or simply because someone deserves it"],
    "p1": "Sometimes the best gift isn’t something they need to keep.",
    "p2": "It’s a little time for themselves."
  },
  "closing": { "tagline": "Professional massage, personal care and a moment that is all about you." },
  "imageAlt": "Physical gift card from Let Us Massage in Lund – printed card with a personal greeting",
  "faq": { "...": "keep existing object unchanged" },
  "seo": {
    "title": "Massage Gift Cards Lund | Let Us Massage",
    "description": "Give the gift of relaxation – gift cards from Let Us Massage in Lund. Buy a digital gift card online via Bokadirekt, or book a time and collect a physical gift card in person."
  }
}
```

**el.json**

```json
"gifts": {
  "eyebrow": "Δωροκάρτες",
  "title": "Δωροκάρτα",
  "lede": "Δώσε το δώρο της χαλάρωσης",
  "quote": "Ένα δώρο που λέει «φρόντισε λίγο τον εαυτό σου».",
  "intro": [
    "Υπάρχουν δώρα που ανοίγουν και ξεχνιούνται.",
    "Και υπάρχουν δώρα που χαρίζουν μια στιγμή ηρεμίας, φροντίδας και ευεξίας.",
    "Με μια δωροκάρτα από το Let Us Massage χαρίζεις στον άνθρωπό σου χρόνο για τον εαυτό του, μια όμορφη εμπειρία massage, προσαρμοσμένη στις ανάγκες του.",
    "Είναι ένα υπέροχο δώρο για κάποιον που αγαπάς, για έναν φίλο, έναν συνάδελφο ή για όποιον χρειάζεται απλώς μια μικρή παύση από την καθημερινότητα."
  ],
  "enjoy": {
    "title": "Κάνε ένα δώρο που πραγματικά θα απολαύσει",
    "p1": "Δεν χρειάζεται να γνωρίζεις ποιο massage του ταιριάζει.",
    "p2": "Ο παραλήπτης μπορεί να επιλέξει την κατάλληλη θεραπεία και να απολαύσει μια προσωπική εμπειρία στο Let Us Massage, σε ένα ήρεμο και επαγγελματικό περιβάλλον στο κέντρο του Lund."
  },
  "choose": { "title": "Διάλεξε τον τρόπο που θέλεις να χαρίσεις το δώρο" },
  "digital": {
    "title": "Ψηφιακή δωροκάρτα",
    "p1": "Θέλεις κάτι εύκολο και άμεσο;",
    "p2": "Αγόρασε τη δωροκάρτα online μέσω Bokadirekt. Είναι η ιδανική επιλογή όταν θέλεις να κάνεις ένα όμορφο δώρο γρήγορα και εύκολα.",
    "cta": "Αγόρασε online μέσω Bokadirekt"
  },
  "physical": {
    "title": "Φυσική δωροκάρτα",
    "p1": "Θέλεις το δώρο να έχει κάτι πιο προσωπικό;",
    "p2": "Μπορείς να αγοράσεις τη φυσική δωροκάρτα απευθείας από το Let Us Massage.",
    "p3": "Θα σου ετοιμάσουμε μια όμορφη, τυπωμένη δωροκάρτα σε φάκελο — έτοιμη να την προσφέρεις.",
    "p4": "Εσύ επιλέγεις το ποσό και παίρνεις μαζί σου ένα πραγματικό δώρο που μπορείς να προσφέρεις σε κάποιον ξεχωριστό.",
    "cta": "Αγόρασε & παρέλαβε τη δωροκάρτα στον χώρο",
    "note": "Η φυσική δωροκάρτα αγοράζεται με ραντεβού στον χώρο. Η πληρωμή γίνεται με κάρτα ή Swish."
  },
  "occasions": {
    "title": "Ένα δώρο για κάθε περίσταση",
    "items": ["Γενέθλια", "Χριστούγεννα", "Γιορτή", "Επέτειος", "Ένα «ευχαριστώ»", "Ή απλώς επειδή κάποιος το χρειάζεται"],
    "p1": "Μερικές φορές το καλύτερο δώρο δεν είναι κάτι που χρειάζεται να κρατήσεις.",
    "p2": "Είναι λίγος χρόνος για τον εαυτό σου."
  },
  "closing": { "tagline": "Επαγγελματικό massage, προσωπική φροντίδα και μια στιγμή που είναι μόνο για σένα." },
  "imageAlt": "Φυσική δωροκάρτα από το Let Us Massage στο Lund – τυπωμένη κάρτα με προσωπική αφιέρωση",
  "faq": { "...": "keep existing object unchanged" },
  "seo": {
    "title": "Δωροκάρτες Massage Lund | Let Us Massage",
    "description": "Δώσε το δώρο της χαλάρωσης – δωροκάρτες από το Let Us Massage στο Lund. Αγόρασε ψηφιακή δωροκάρτα online μέσω Bokadirekt ή κλείσε ραντεβού και παρέλαβε φυσική δωροκάρτα στον χώρο."
  }
}
```

The `seo` strings and `imageAlt` are *added — not in Letta's text* (needed for `<title>`, meta description and the photo's alt text).

### 2.4 SEO plumbing

- `scripts/prerender.mjs` route `/presentkort`: replace the hard-coded title/description with `svLocale.gifts.seo.title` / `.description` (same pattern as `/recensioner`).
- `public/sitemap.xml`: bump `lastmod` for `/presentkort`.
- `Gifts.tsx` Helmet/breadcrumb stay as they are (they already read `gifts.seo.*` and `gifts.title`).

## 3. Friskvård teaser on the home page (item 2a)

### 3.1 Where it goes — measured on the live site

On a 375×812 phone the hero is 812 px tall and the background image is `auto 80%` centered, so the picture ends **81 px above the hero's bottom edge**; the white wave takes the last 21 px of that. This dark band is the "small empty space" Letta means. It exists **only below `md`** (from 768 px up the image is `cover` and there is no band). At 768 / 1024 / 1280 px the hero is a full-bleed photo.

So the teaser cannot live purely inside the band. Proposal: a **floating white card that straddles the hero's bottom edge** — on mobile its top sits inside the dark band (just under the picture) and it overlaps the wave and the top of the next section; on desktop it sits centered over the bottom of the photo. Same component, no breakpoint-specific markup.

Fallback if Letta prefers no overlap: the same card as a slim full-width strip directly under the hero (drop the negative margin). Decide with her after she sees it (§10, question 1).

### 3.2 Component

`src/components/FriskvardTeaser.tsx`, rendered in `Home.tsx` between `<Hero />` and `<AboutCompany />`. The whole card is one `<Link to="/friskvard">` so it is a single tap target on mobile.

```tsx
<section aria-label={t('friskvardTeaser.title')} className="relative z-10 px-4 -mt-16 md:-mt-14">
  <Link
    to="/friskvard"
    className="group mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-stone-100 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm md:flex-row md:justify-between md:gap-6 md:px-8"
  >
    <div className="text-center md:text-left">
      <p className="text-[11px] uppercase tracking-[0.3em] text-sky-600">{t('friskvardTeaser.title')}</p>
      <p className="mt-0.5 text-sm text-slate-600">{t('friskvardTeaser.line')}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1.5">
        <img src="/partners/benifex.png" alt="Benifex" width={…} height={…} className="h-6 w-auto md:h-7" />
        <span className="text-[11px] text-slate-400">{t('friskvardTeaser.benifexNote')}</span>
      </span>
      <span aria-hidden="true" className="h-6 w-px bg-stone-200" />
      <img src="/partners/epassi.png" alt="Epassi" width={…} height={…} className="h-6 w-auto md:h-7" />
    </div>
    <span className="text-sm font-medium text-sky-600 group-hover:text-sky-800">{t('friskvardTeaser.cta')} →</span>
  </Link>
</section>
```

Notes: `-mt-16` (64 px) puts the card's top ≈17 px below the picture on a 375×812 screen — tune by eye at 375×667 and 390×844 too. The card is above the fold, so **no `loading="lazy"`** on the two logos, but `decoding="async"` and explicit `width`/`height`. The hero's wave SVG is `z-0` inside the hero, so the `relative z-10` section paints on top without touching `Hero.tsx`.

### 3.3 i18n — add `friskvardTeaser` to all three files

```json
"friskvardTeaser": { "title": "Friskvård hos Let Us Massage", "line": "Använd ditt friskvårdsbidrag via:", "benifexNote": "(tidigare Benify)", "cta": "Läs mer" }
```
```json
"friskvardTeaser": { "title": "Friskvård at Let Us Massage", "line": "Use your wellness allowance through:", "benifexNote": "(formerly Benify)", "cta": "Read more" }
```
```json
"friskvardTeaser": { "title": "Friskvård στο Let Us Massage", "line": "Χρησιμοποίησε το friskvårdsbidrag σου μέσω:", "benifexNote": "(πρώην Benify)", "cta": "Διάβασε περισσότερα" }
```

## 4. Friskvård page `/friskvard` (item 2b)

### 4.1 Routing and navigation

- `src/App.tsx`: `<Route path="/friskvard" element={<Friskvard />} />`. Optional alias `/friskvardsbidrag` (same element; canonical stays `/friskvard`, like `/gift-cards` → `/presentkort`).
- `src/components/Navbar.tsx`: insert `{ key: 'nav.friskvard', href: '/friskvard' }` **after `nav.techniques` and before `nav.gifts`** (Letta: "between Techniques and Gift Cards").
- Nav density fix — required, because at 1024 px the eight current links already wrap onto two lines ("Om oss", "Varför oss", "Hitta oss" and the "Boka tid" button all break) and a ninth makes it worse:
  - brand text `<span>`: `hidden sm:inline` → `hidden xl:inline`
  - desktop link row: `hidden md:flex items-center gap-7` → `hidden lg:flex items-center gap-5 xl:gap-7 whitespace-nowrap`
  - hamburger button and the mobile menu wrapper: `md:hidden` → `lg:hidden` (tablets get the hamburger, which already works well)
  - verify at 1024 and 1280 px that everything stays on one line.
- `src/components/Footer.tsx`: add `<a href="/friskvard">{t('nav.friskvard')}</a>` before the Presentkort link in the bottom row.
- `nav.friskvard` = `"Friskvård"` in **all three** locales (Letta uses the Swedish word as the section name in EN and EL too).

### 4.2 Page structure (`src/pages/Friskvard.tsx`, same skeleton as `Reviews.tsx` / `Gifts.tsx`)

1. **Header** (gradient, `pt-32 pb-16`, centered `max-w-4xl`): eyebrow, `h1` = `title`, `lede` (italic), `question` (serif, slightly larger), `intro1`, `intro2`. Then the **partner logo row** — this is where Paul wants the logos: label `partnersLabel` in small caps, then `benifex.png` at `h-10 md:h-12` with `benifexNote` beside it, a thin divider, `epassi.png` at `h-10 md:h-12`. Logos are plain `<img>` with alt "Benifex" / "Epassi" — no outbound links (§10, question 3).
2. **"Så fungerar det"** (`bg-white py-20`): h2 + `how.intro`, then the four steps as cards in a `md:grid-cols-2` grid with the numbered circle from `WhyChooseUs` (01–04). Step 1 additionally shows both logos small (`h-6`). Step 3 renders `listIntro` + an `<ol>` of `list`, then `important` as a callout box (`bg-amber-50 border-amber-100`), then a button using the existing key `detail.bookNow` ("Boka via Bokadirekt") → `BOKADIREKT_PLACE`, `target="_blank"`.
3. **"Vilka behandlingar…"** (`bg-stone-50 py-20`): h2 + `treatments.intro`, three cards (`relax`, `klassisk`, `prenatal`) reusing `/services/{id}.jpg` + `.webp` via `<picture>` exactly as `Services.tsx`, name, text, the existing `services.friskvard_badge` pill, and a `Link` to `/behandlingar/{id}` labelled `detail.readMore`. Below: `treatments.all` → `Link to="/#services"` with `→`.
4. **"Friskvård och massage – en stund för dig"** (`bg-white py-20`, `max-w-3xl` centered): h2 + three paragraphs.
5. **FAQ** (`bg-stone-50 py-20`): the same accordion as `Gifts.tsx`. Recommended small refactor: extract it into `src/components/FaqAccordion.tsx` and use it from `FAQ.tsx`, `Gifts.tsx` and the new page instead of a third copy.
6. **CTA** (`bg-sky-50 py-20`, centered): `cta.title` (serif h2), `cta.body`, solid button `cta.button` → `BOKADIREKT_PLACE`, `target="_blank"`.

Helmet in the page: `title`, `description`, canonical `https://let-us-massage.se/friskvard`, og:*, `<html lang>`, and a **BreadcrumbList** only (FAQPage JSON-LD is prerendered, §4.4).

### 4.3 i18n — add `friskvardPage` to all three files

Key layout: `eyebrow, title, lede, question, intro1, intro2, partnersLabel, benifexNote, how{title,intro,steps[4]{title,p1,p2,listIntro?,list?,important?}}, treatments{title,intro,items[3]{id,name,text},all}, why{title,p1,p2,p3}, faq{title,items[7]{q,a}}, cta{title,body,button}, seo{title,description}`.

`eyebrow`, `partnersLabel` and `seo` are *added — not in Letta's text*; everything else is verbatim.

**sv.json**

```json
"friskvardPage": {
  "eyebrow": "Friskvård",
  "title": "Friskvårdsmassage i Lund – använd ditt friskvårdsbidrag",
  "lede": "Använd ditt friskvårdsbidrag till massage hos Let Us Massage",
  "question": "Har du friskvårdsbidrag via jobbet?",
  "intro1": "Hos Let Us Massage i Lund kan du använda ditt friskvårdsbidrag till våra godkända massagebehandlingar. Vi är anslutna till Benifex (tidigare Benify) och Epassi, så att du enkelt kan använda ditt friskvårdsbidrag hos oss.",
  "intro2": "Välj den massagebehandling som passar dig och ge kroppen en stund för avkoppling, återhämtning och välmående.",
  "partnersLabel": "Anslutna till",
  "benifexNote": "(tidigare Benify)",
  "how": {
    "title": "Så fungerar det",
    "intro": "Det är enkelt att använda ditt friskvårdsbidrag till massage hos Let Us Massage.",
    "steps": [
      {
        "title": "Köp din behandling via Benifex eller Epassi",
        "p1": "Logga in på den friskvårdsplattform du använder och sök efter Let Us Massage Lund.",
        "p2": "Välj den behandling du vill använda ditt friskvårdsbidrag till och genomför köpet direkt via Benifex eller Epassi."
      },
      {
        "title": "Du får en unik bokningskod",
        "p1": "Efter att köpet är genomfört får du en unik bokningskod.",
        "p2": "Spara koden – du behöver den när du bokar din tid och när du kommer till ditt besök."
      },
      {
        "title": "Boka din massage via Bokadirekt",
        "p1": "Gå till Let Us Massage Lund på Bokadirekt och välj den dag och tid som passar dig.",
        "listIntro": "När du bokar:",
        "list": [
          "Ange din unika bokningskod i meddelandefältet.",
          "Välj ”Betala på plats” som betalningsalternativ."
        ],
        "important": "Detta är viktigt: din behandling är redan betald via Benifex eller Epassi, så du betalar inget extra hos Let Us Massage."
      },
      {
        "title": "Kom till ditt bokade besök",
        "p1": "Ta med din bokningskod och visa den när du kommer.",
        "p2": "Din behandling är redan betald via Benifex eller Epassi. Du behöver bara komma till din bokade tid, koppla av och njuta av din massage."
      }
    ]
  },
  "treatments": {
    "title": "Vilka behandlingar kan du använda ditt friskvårdsbidrag till?",
    "intro": "Hos Let Us Massage kan du använda ditt friskvårdsbidrag till följande massagebehandlingar:",
    "items": [
      { "id": "relax", "name": "Relaxmassage", "text": "En lugn och avslappnande massage för dig som vill varva ner, minska spänningar och ge kroppen en stund för återhämtning." },
      { "id": "klassisk", "name": "Klassisk Massage", "text": "En mer djupgående och dynamisk massage som passar dig som upplever muskelspänningar eller har en stillasittande eller fysiskt krävande vardag." },
      { "id": "prenatal", "name": "Gravidmassage", "text": "En varsamt anpassad massage för dig som är gravid och vill ge kroppen extra omtanke, avkoppling och återhämtning under graviditeten." }
    ],
    "all": "Se alla behandlingar"
  },
  "why": {
    "title": "Friskvård och massage – en stund för dig",
    "p1": "Friskvårdsbidraget är en personalförmån som kan användas till olika friskvårdsaktiviteter och vissa behandlingar som bidrar till avkoppling och välmående.",
    "p2": "Massage kan vara en del av friskvården och ett enkelt sätt att ge kroppen tid för återhämtning.",
    "p3": "Ditt friskvårdsbidrag ger dig möjlighet att ta hand om dig själv lite oftare – och samtidigt använda en förmån du redan har genom ditt arbete."
  },
  "faq": {
    "title": "Vanliga frågor om friskvårdsbidrag och massage",
    "items": [
      { "q": "Behöver jag betala något hos Let Us Massage?", "a": "Nej. När du har köpt din behandling via Benifex eller Epassi är den redan betald. När du bokar via Bokadirekt väljer du ”Betala på plats”, men du behöver inte betala något på plats hos Let Us Massage." },
      { "q": "Varför ska jag välja ”Betala på plats” på Bokadirekt?", "a": "Bokadirekt kräver att du väljer ett betalningsalternativ för att kunna slutföra bokningen. Eftersom din behandling redan är betald via Benifex eller Epassi väljer du ”Betala på plats”. Det innebär inte att du ska betala något extra hos oss." },
      { "q": "Måste jag ange min bokningskod när jag bokar?", "a": "Ja. Ange din unika bokningskod i meddelandefältet när du bokar din tid på Bokadirekt. Ta även med koden till ditt besök och visa den när du kommer." },
      { "q": "När ska jag köpa min behandling?", "a": "Du köper först den behandling du vill använda ditt friskvårdsbidrag till via Benifex eller Epassi. Efter köpet får du din unika bokningskod. Därefter bokar du din tid via Bokadirekt." },
      { "q": "Kan jag använda hela mitt friskvårdsbidrag till massage?", "a": "Det beror på hur stort friskvårdsbidrag du har och vilka villkor som gäller för dig. Kontrollera ditt aktuella saldo och villkoren hos Benifex eller Epassi innan du genomför köpet." },
      { "q": "Vad händer om jag behöver avboka eller boka om min tid?", "a": "Avbokning eller ombokning ska göras minst 24 timmar före den bokade tiden. Vid sen avbokning eller uteblivet besök gäller Let Us Massages avbokningsvillkor." },
      { "q": "Var ligger Let Us Massage?", "a": "Let Us Massage ligger centralt i Lund och är enkelt att ta sig till för dig som bor eller arbetar i Lund med omnejd." }
    ]
  },
  "cta": {
    "title": "Har du friskvårdsbidrag?",
    "body": "Använd det till något som ger dig en stund för avkoppling, återhämtning och tid för dig själv.",
    "button": "Boka din friskvårdsbehandling"
  },
  "seo": {
    "title": "Friskvårdsmassage i Lund – använd ditt friskvårdsbidrag | Let Us Massage",
    "description": "Använd ditt friskvårdsbidrag till massage hos Let Us Massage i Lund. Anslutna till Benifex (tidigare Benify) och Epassi. Relaxmassage, klassisk massage och gravidmassage – så fungerar det steg för steg."
  }
}
```

**en.json**

```json
"friskvardPage": {
  "eyebrow": "Friskvård",
  "title": "Massage in Lund – Use Your Wellness Allowance",
  "lede": "Use your wellness allowance for massage at Let Us Massage",
  "question": "Do you have a wellness allowance through your employer?",
  "intro1": "At Let Us Massage in Lund, you can use your wellness allowance for our eligible massage treatments. We are available through Benifex (formerly Benify) and Epassi, making it easy to use your wellness allowance with us.",
  "intro2": "Choose the massage treatment that suits you and give your body some time to relax, recover and recharge.",
  "partnersLabel": "Available through",
  "benifexNote": "(formerly Benify)",
  "how": {
    "title": "How it works",
    "intro": "Using your wellness allowance for a massage at Let Us Massage is simple.",
    "steps": [
      {
        "title": "Purchase your treatment through Benifex or Epassi",
        "p1": "Log in to the wellness platform you use and search for Let Us Massage Lund.",
        "p2": "Choose the treatment you would like to use your wellness allowance for and complete your purchase directly through Benifex or Epassi."
      },
      {
        "title": "You will receive a unique booking code",
        "p1": "Once your purchase is complete, you will receive a unique booking code.",
        "p2": "Keep your code safe – you will need it when making your appointment and when you arrive for your visit."
      },
      {
        "title": "Book your massage through Bokadirekt",
        "p1": "Go to Let Us Massage Lund on Bokadirekt and choose the day and time that suits you.",
        "listIntro": "When making your booking:",
        "list": [
          "Enter your unique booking code in the message field.",
          "Select “Betala på plats” as your payment option."
        ],
        "important": "This is important: your treatment has already been paid for through Benifex or Epassi, so you will not pay anything extra at Let Us Massage."
      },
      {
        "title": "Come to your appointment",
        "p1": "Bring your booking code with you and show it when you arrive.",
        "p2": "Your treatment has already been paid for through Benifex or Epassi. All you need to do is arrive for your appointment, relax and enjoy your massage."
      }
    ]
  },
  "treatments": {
    "title": "Which treatments can you use your wellness allowance for?",
    "intro": "At Let Us Massage, you can use your wellness allowance for the following massage treatments:",
    "items": [
      { "id": "relax", "name": "Relaxmassage", "text": "A calm and relaxing massage for those who want to unwind, release tension and give their body some time to recover." },
      { "id": "klassisk", "name": "Classic Massage", "text": "A deeper and more dynamic massage, suitable for those experiencing muscle tension or who have a sedentary or physically demanding everyday life." },
      { "id": "prenatal", "name": "Pregnancy Massage", "text": "A gentle, specially adapted massage for pregnant women who want to give their body some extra care, relaxation and recovery during pregnancy." }
    ],
    "all": "See all treatments"
  },
  "why": {
    "title": "Wellness and massage – a moment for yourself",
    "p1": "A wellness allowance is an employee benefit that can be used for various wellness activities and certain treatments that promote relaxation and well-being.",
    "p2": "Massage can be part of your wellness routine and is a simple way to give your body some time to recover.",
    "p3": "Your wellness allowance gives you an opportunity to take care of yourself a little more often – while making use of a benefit you already have through your work."
  },
  "faq": {
    "title": "Frequently asked questions about wellness allowance and massage",
    "items": [
      { "q": "Do I need to pay anything at Let Us Massage?", "a": "No. When you have purchased your treatment through Benifex or Epassi, it has already been paid for. When booking through Bokadirekt, select “Betala på plats”, but you do not need to make any payment at Let Us Massage." },
      { "q": "Why do I need to select “Betala på plats” on Bokadirekt?", "a": "Bokadirekt requires you to select a payment option in order to complete your booking. Since your treatment has already been paid for through Benifex or Epassi, select “Betala på plats”. This does not mean that you need to pay anything extra at Let Us Massage." },
      { "q": "Do I need to enter my booking code when making the appointment?", "a": "Yes. Enter your unique booking code in the message field when booking your appointment through Bokadirekt. Please also bring the code with you and show it when you arrive for your appointment." },
      { "q": "When should I purchase my treatment?", "a": "First, purchase the treatment you would like to use your wellness allowance for through Benifex or Epassi. After your purchase, you will receive your unique booking code. You can then book your appointment through Bokadirekt." },
      { "q": "Can I use my entire wellness allowance for a massage?", "a": "This depends on the amount of wellness allowance you have and the terms that apply to you. Check your current balance and the applicable terms with Benifex or Epassi before making your purchase." },
      { "q": "What if I need to cancel or reschedule my appointment?", "a": "Cancellations or rescheduling must be made at least 24 hours before your scheduled appointment. For late cancellations or no-shows, Let Us Massage’s cancellation policy applies." },
      { "q": "Where is Let Us Massage located?", "a": "Let Us Massage is located centrally in Lund, making it easy to reach if you live or work in Lund or the surrounding areas." }
    ]
  },
  "cta": {
    "title": "Do you have a wellness allowance?",
    "body": "Use it for something that gives you a moment to relax, recharge and take some time for yourself.",
    "button": "Book your wellness treatment"
  },
  "seo": {
    "title": "Massage in Lund – Use Your Wellness Allowance | Let Us Massage",
    "description": "Use your wellness allowance (friskvårdsbidrag) for massage at Let Us Massage in Lund. Available through Benifex (formerly Benify) and Epassi. How it works, step by step."
  }
}
```

**el.json**

```json
"friskvardPage": {
  "eyebrow": "Friskvård",
  "title": "Massage στο Lund με χρήση του friskvårdsbidrag",
  "lede": "Χρησιμοποίησε το friskvårdsbidrag σου για massage στο Let Us Massage",
  "question": "Έχεις friskvårdsbidrag μέσω της δουλειάς σου;",
  "intro1": "Στο Let Us Massage στο Lund μπορείς να χρησιμοποιήσεις το friskvårdsbidrag σου για τις εγκεκριμένες θεραπείες massage. Είμαστε διαθέσιμοι μέσω Benifex (πρώην Benify) και Epassi, ώστε να μπορείς εύκολα να χρησιμοποιήσεις το friskvårdsbidrag σου σε εμάς.",
  "intro2": "Επίλεξε τη massage που σου ταιριάζει και χάρισε στο σώμα σου μια στιγμή χαλάρωσης, αποφόρτισης και φροντίδας.",
  "partnersLabel": "Διαθέσιμοι μέσω",
  "benifexNote": "(πρώην Benify)",
  "how": {
    "title": "Πώς λειτουργεί",
    "intro": "Η χρήση του friskvårdsbidrag σου για massage στο Let Us Massage είναι απλή.",
    "steps": [
      {
        "title": "Αγόρασε τη θεραπεία σου μέσω Benifex ή Epassi",
        "p1": "Συνδέσου στην πλατφόρμα friskvård που χρησιμοποιείς και αναζήτησε το Let Us Massage Lund.",
        "p2": "Επίλεξε τη θεραπεία που θέλεις και ολοκλήρωσε την αγορά χρησιμοποιώντας το friskvårdsbidrag σου."
      },
      {
        "title": "Θα λάβεις έναν μοναδικό κωδικό κράτησης",
        "p1": "Μετά την ολοκλήρωση της αγοράς θα λάβεις έναν μοναδικό κωδικό κράτησης.",
        "p2": "Κράτησε τον κωδικό σου. Θα τον χρειαστείς όταν κάνεις την κράτηση και όταν έρθεις στο ραντεβού σου."
      },
      {
        "title": "Κλείσε το massage σου μέσω Bokadirekt",
        "p1": "Μπες στη σελίδα του Let Us Massage Lund στο Bokadirekt και επίλεξε την ημέρα και την ώρα που σε εξυπηρετούν.",
        "listIntro": "Κατά την κράτηση:",
        "list": [
          "Γράψε τον μοναδικό κωδικό σου στο πεδίο των σημειώσεων.",
          "Στο βήμα της πληρωμής επίλεξε «Betala på plats»."
        ],
        "important": "Αυτό είναι σημαντικό: η θεραπεία σου έχει ήδη πληρωθεί μέσω Benifex ή Epassi, επομένως δεν θα πληρώσεις τίποτα επιπλέον στο Let Us Massage."
      },
      {
        "title": "Έλα στο ραντεβού σου",
        "p1": "Έχε μαζί σου τον μοναδικό κωδικό κράτησης και δείξ' τον όταν έρθεις.",
        "p2": "Η θεραπεία σου έχει ήδη πληρωθεί μέσω Benifex ή Epassi. Εσύ απλώς έρχεσαι, χαλαρώνεις και απολαμβάνεις τη θεραπεία σου."
      }
    ]
  },
  "treatments": {
    "title": "Ποιες θεραπείες μπορείς να χρησιμοποιήσεις με το friskvårdsbidrag;",
    "intro": "Στο Let Us Massage Lund μπορείς να χρησιμοποιήσεις το friskvårdsbidrag σου για τις παρακάτω massagebehandlingar:",
    "items": [
      { "id": "relax", "name": "Relaxmassage", "text": "Ένα ήρεμο και χαλαρωτικό massage για όσους θέλουν να αποφορτιστούν, να μειώσουν τις εντάσεις και να προσφέρουν στο σώμα τους μια στιγμή ξεκούρασης και αποκατάστασης." },
      { "id": "klassisk", "name": "Klassisk Massage", "text": "Ένα πιο βαθύ και δυναμικό massage που ταιριάζει σε όσους αντιμετωπίζουν μυϊκές εντάσεις ή έχουν μια καθημερινότητα με πολύωρη καθιστική εργασία ή σωματική καταπόνηση." },
      { "id": "prenatal", "name": "Gravidmassage", "text": "Ένα ειδικά προσαρμοσμένο και ήπιο massage για εγκύους που θέλουν να προσφέρουν στο σώμα τους περισσότερη φροντίδα, χαλάρωση και ανακούφιση κατά τη διάρκεια της εγκυμοσύνης." }
    ],
    "all": "Δες όλες τις θεραπείες"
  },
  "why": {
    "title": "Friskvård και massage – ένας απλός τρόπος να φροντίσεις τον εαυτό σου",
    "p1": "Το friskvårdsbidrag είναι μια παροχή που προσφέρει ο εργοδότης και μπορεί να χρησιμοποιηθεί για διάφορες δραστηριότητες ευεξίας και για ορισμένες θεραπείες που βοηθούν στη χαλάρωση ή στην αντιμετώπιση μυϊκής έντασης και δυσκαμψίας.",
    "p2": "Το massage μπορεί να αποτελεί μέρος του friskvård, σύμφωνα με τους ισχύοντες κανόνες.",
    "p3": "Το friskvårdsbidrag σου είναι ένας όμορφος τρόπος να προσφέρεις τακτικά στον εαυτό σου χρόνο για ξεκούραση και αποκατάσταση — χρησιμοποιώντας μια παροχή που ήδη έχεις μέσω της εργασίας σου."
  },
  "faq": {
    "title": "Συχνές ερωτήσεις για friskvårdsbidrag και massage",
    "items": [
      { "q": "Χρειάζεται να πληρώσω κάτι στο Let Us Massage;", "a": "Όχι. Εφόσον έχεις αγοράσει τη θεραπεία σου μέσω Benifex ή Epassi, η θεραπεία είναι ήδη πληρωμένη. Κατά την κράτηση στο Bokadirekt επιλέγεις «Betala på plats», αλλά δεν χρειάζεται να πληρώσεις τίποτα στον χώρο." },
      { "q": "Γιατί πρέπει να επιλέξω «Betala på plats» στο Bokadirekt;", "a": "Το Bokadirekt χρειάζεται να έχει επιλεγμένο έναν τρόπο πληρωμής για να ολοκληρωθεί η κράτηση. Εφόσον η θεραπεία σου έχει ήδη πληρωθεί μέσω Benifex ή Epassi, επιλέγεις «Betala på plats». Δεν πραγματοποιείται κάποια επιπλέον πληρωμή στο Let Us Massage." },
      { "q": "Πρέπει να γράψω τον κωδικό μου όταν κάνω την κράτηση;", "a": "Ναι. Γράψε τον μοναδικό κωδικό κράτησης στο πεδίο των σημειώσεων κατά την κράτηση στο Bokadirekt. Θα πρέπει επίσης να έχεις τον κωδικό μαζί σου όταν έρθεις στο ραντεβού." },
      { "q": "Πότε πρέπει να αγοράσω τη θεραπεία;", "a": "Πρώτα αγοράζεις τη θεραπεία μέσω Benifex ή Epassi. Μετά την αγορά λαμβάνεις τον μοναδικό κωδικό κράτησης και στη συνέχεια κλείνεις το ραντεβού σου μέσω Bokadirekt." },
      { "q": "Μπορώ να χρησιμοποιήσω όλο το friskvårdsbidrag μου για massage;", "a": "Αυτό εξαρτάται από το διαθέσιμο ποσό του friskvårdsbidrag σου και τους όρους που ισχύουν από τον εργοδότη σου και την πλατφόρμα που χρησιμοποιείς. Έλεγξε το διαθέσιμο υπόλοιπο και τους όρους μέσω Benifex ή Epassi πριν ολοκληρώσεις την αγορά." },
      { "q": "Τι γίνεται αν χρειαστεί να ακυρώσω ή να αλλάξω το ραντεβού μου;", "a": "Η ακύρωση ή αλλαγή του ραντεβού πρέπει να γίνεται τουλάχιστον 24 ώρες πριν από την προγραμματισμένη ώρα. Σε περίπτωση καθυστερημένης ακύρωσης ή μη εμφάνισης, ισχύουν οι όροι ακύρωσης του Let Us Massage." },
      { "q": "Πού βρίσκεται το Let Us Massage;", "a": "Το Let Us Massage βρίσκεται σε κεντρική τοποθεσία στο Lund και είναι εύκολα προσβάσιμο για όσους ζουν ή εργάζονται στο Lund και τις γύρω περιοχές." }
    ]
  },
  "cta": {
    "title": "Έχεις friskvårdsbidrag;",
    "body": "Αξιοποίησέ το για κάτι που σου προσφέρει μια στιγμή χαλάρωσης και χρόνο μόνο για εσένα.",
    "button": "Κλείσε τη friskvårdsbehandling σου"
  },
  "seo": {
    "title": "Massage στο Lund με friskvårdsbidrag | Let Us Massage",
    "description": "Χρησιμοποίησε το friskvårdsbidrag σου για massage στο Let Us Massage στο Lund, μέσω Benifex (πρώην Benify) και Epassi. Δες πώς λειτουργεί βήμα-βήμα."
  }
}
```

### 4.4 SEO, schema, prerender, sitemap

- `scripts/prerender.mjs`:
  - add to `routes` (static block, after `/presentkort`):
    ```js
    {
      path: '/friskvard',
      title: svLocale.friskvardPage.seo.title,
      description: svLocale.friskvardPage.seo.description,
      keywords: 'friskvårdsbidrag massage Lund, friskvårdsmassage Lund, Epassi massage Lund, Benifex massage Lund, Benify massage Lund, friskvård Lund',
    },
    ```
  - add a `friskvardFaqGraph` built from `svLocale.friskvardPage.faq.items` (copy the existing `faqGraph` builder) and inject it in `injectHead` for `route.path === '/friskvard'`, the same way `faqGraph` is injected for `/`. The page's own Helmet must then **not** repeat the FAQPage schema (only BreadcrumbList), matching the "single source" rule stated at the top of `prerender.mjs`.
  - the prerender log line should go from 21 to 22 pages.
- `public/sitemap.xml`: add
  ```xml
  <url>
    <loc>https://let-us-massage.se/friskvard</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ```
  and bump `lastmod` on `/` (teaser, About, parking) and `/presentkort`.

### 4.5 Cross-links so the site tells one story

- `src/content/articles/friskvardsbidrag.ts` (`/artiklar/friskvardsbidrag-massage-lund`): its "Hur du betalar med friskvårdsbidrag hos oss" section still says you pay *in the app at booking* and mentions "Benify". Rewrite that section to the new flow (buy in Benifex/Epassi → unique booking code → book on Bokadirekt with "Betala på plats") and link to `/friskvard`. Rename Benify → "Benifex (tidigare Benify)" in text and `keywords`; also in the `articles[]` keywords string in `prerender.mjs`.
- Home FAQ item "Tar ni emot friskvårdsbidrag?" (sv/en/el): it lists only Klassisk + Relax, but Gravidmassage is eligible (badge on the card, `information.payments.p4`). Add Gravidmassage and a mention of Benifex (tidigare Benify) / Epassi and the Friskvård page. FAQ answers are plain text (no links), so name the page rather than linking.
- Optional: make the green "Godkänd för friskvårdsbidrag" pill in `Services.tsx` / `ServiceDetail.tsx` a `Link` to `/friskvard`.

## 5. Second Kroppsterapeuterna logo (item 3)

`src/components/About.tsx`, the credentials row at the bottom of the non-story view:

```tsx
<div className="mt-8 flex items-center gap-4 flex-wrap">
  <img src="/kroppsterapeuterna.png" alt="Kroppsterapeuternas Yrkesförbund – kvalitetssäkrad" className="h-16 w-auto" … />
  <img src="/kroppsterapeuterna-devis.png" alt="Kroppsterapeuterna – branschorganisationen för ett friskare Sverige" className="h-16 w-auto" … />
  <p className="text-sm text-slate-500 max-w-xs">{t('about.credentials')}</p>
</div>
```

Same `h-16` as the existing badge ("in the same size"). Add `width`/`height`. The source is only 300×224 px; at 64 px CSS height it is sharp on 2× screens (needs 128 px). If Letta has a higher-resolution file, swap it later via `/admin` (registered in §1).

## 6. Parking space no. 6 (item 4)

The parking text already exists in all three locales; only "nr 6" is new. Change `information.parking.p1`:

| Locale | New `p1` |
| --- | --- |
| sv | `En gratis parkeringsplats (plats nr 6) finns tillgänglig med infart från Gyllenkroks Allé.` |
| en | `One free parking space (no. 6) is available with entrance from Gyllenkroks Allé.` |
| el | `Υπάρχει μία δωρεάν θέση στάθμευσης (αρ. 6) με είσοδο από το Gyllenkroks Allé.` |

`p2` ("first come, first served") is already correct in all three and stays.

## 7. Recommended consistency fixes (not in Letta's notes, small)

1. `scripts/prerender.mjs` LocalBusiness `paymentAccepted: 'Cash, Credit Card, Epassi, Benify, ActiWay'` — the site says cash is **not** accepted, and Benify is now Benifex. Suggest `'Credit Card, Swish, Epassi, Benifex'`. Whether ActiWay stays is a question for Letta (§10, question 4).
2. The two cross-link items in §4.5 (article + home FAQ).
3. `FaqAccordion` extraction (§4.2 step 5) — avoids a third copy of the same accordion.

## 8. Suggested commit sequence (Swedish, conventional commits, as in the log)

1. `chore(bilder): Benifex-, Epassi- och Kroppsterapeuterna-logotyper samt foto på fysiskt presentkort` (assets + imageManifest + `src/lib/bokadirekt.ts`)
2. `feat(presentkort): ny text på tre språk, foto på fysiskt presentkort, båda knappar till Bokadirekt`
3. `feat(friskvard): ny sida /friskvard med Benifex/Epassi-logotyper + teaser under hero på startsidan` (page, teaser, nav/footer, prerender, sitemap)
4. `feat(om): andra Kroppsterapeuterna-logotypen bredvid den befintliga`
5. `fix(information): parkeringsplats nr 6 på tre språk`
6. `fix(friskvard): FAQ, artikel och schema i linje med det nya Benifex/Epassi-flödet` (§7, if approved)

Push to `main` deploys via Netlify.

## 9. Verification checklist

- `npm run lint` and `npm run build` pass; the build log ends with `[prerender] ✓ Skrev 22 prerenderade sidor` (21 today).
- `dist/friskvard/index.html` has the Swedish title/description/canonical and a FAQPage `<script type="application/ld+json">`; `dist/presentkort/index.html` has the new description.
- `npx vite preview` (or the Browser pane on `dist`) at 375×812, 375×667, 768, 1024 and 1280:
  - `/`: teaser card sits in the dark band under the hero photo on phones and floats over the photo's bottom edge on desktop; nothing overlaps the hero text; no layout shift when the logos load.
  - navbar: nine links on one line at 1024 and 1280; hamburger at 768.
  - `/friskvard`: both logos visible in the header row and in step 1; three treatment cards link to `/behandlingar/{relax,klassisk,prenatal}`; "Se alla behandlingar" scrolls to `/#services`; CTA opens Bokadirekt in a new tab.
  - `/presentkort`: photo renders; "Köp presentkort online" opens the Bokadirekt checkout ("Välj belopp och antal"); "Köp & hämta presentkort på plats" opens the 15-minute "Fysiskt presentkort" booking; the note under the button is visible.
  - `/#about`: two logos side by side, same height, on the same row as the credentials text.
  - `/#information`: parking card shows "plats nr 6".
- Switch SV → EN → EL on `/`, `/friskvard`, `/presentkort`: no raw keys such as `friskvardPage.title` appear anywhere (a missing key in `el.json` shows up like that).
- `public/sitemap.xml` is valid XML and lists `/friskvard`.

## 10. Questions for Letta (none block the implementation)

1. **Teaser placement**: a floating card straddling the bottom edge of the hero photo (proposal) — or a plain strip directly under the hero? Show her the result and let her choose.
2. **Gift card FAQ**: the five existing Q&As are not in the new text. The plan keeps them (they are correct: 12 months validity matches the printed card's "giltig till"). OK?
3. **Logo links**: should the Benifex and Epassi logos link to their websites? The plan shows them as plain images.
4. **Structured data**: we currently tell Google the business accepts "Cash" and "ActiWay". Cash contradicts the site; is ActiWay still accepted?
5. **Photo**: the physical-card photo shows a handwritten sample ("till: Elise, från: Paul", valid to 2027-08-26). Fine to publish as-is, or does she want a blank card photographed?
