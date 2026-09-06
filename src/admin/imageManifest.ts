// ---------------------------------------------------------------------------
// Lista över alla bilder som kan bytas i admin-gränssnittet (/admin).
//
// Vill du lägga till en bild som ska gå att byta? Lägg till en rad här.
//   path  = filens plats i public/-mappen (ändra ALDRIG detta för en befintlig
//           bild – det är så hemsidan hittar bilden)
//   label = namnet som visas i admin
//   where = kort beskrivning av var bilden syns på hemsidan
//   hint  = tips om format/storlek
// ---------------------------------------------------------------------------

export interface SwappableImage {
  path: string
  label: string
  where: string
  hint: string
}

export interface ImageGroup {
  title: string
  images: SwappableImage[]
}

export const imageGroups: ImageGroup[] = [
  {
    title: 'Startsidan',
    images: [
      {
        path: 'hero.jpg',
        label: 'Toppbild (hero)',
        where: 'Stora bakgrundsbilden högst upp på startsidan.',
        hint: 'Liggande format, gärna minst 1920 px bred. JPG.',
      },
      {
        path: 'logo.png',
        label: 'Logotyp',
        where: 'Visas i sidhuvudet och över toppbilden.',
        hint: 'PNG med genomskinlig bakgrund.',
      },
      {
        path: 'dividers/6x2a2260.jpg',
        label: 'Avdelarbild 1',
        where: 'Bred bild som delar av sektionerna på startsidan.',
        hint: 'Liggande, bred panoramabild. JPG.',
      },
      {
        path: 'dividers/6x2a2269.jpg',
        label: 'Avdelarbild 2',
        where: 'Bred bild som delar av sektionerna på startsidan.',
        hint: 'Liggande, bred panoramabild. JPG.',
      },
    ],
  },
  {
    title: 'Om oss',
    images: [
      {
        path: 'letta.jpg',
        label: 'Porträtt – Letta',
        where: '"Om oss"-avsnittet.',
        hint: 'Stående eller liggande foto. JPG.',
      },
      {
        path: 'kroppsterapeuterna.png',
        label: 'Kroppsterapeuterna – kvalitetsmärke',
        where: '"Om oss"-avsnittet, till vänster av de två märkena.',
        hint: 'Logotyp/bild i PNG.',
      },
      {
        path: 'kroppsterapeuterna-devis.png',
        label: 'Kroppsterapeuterna – logotyp med devis',
        where: '"Om oss"-avsnittet, till höger om kvalitetsmärket.',
        hint: 'Logotyp i PNG. Visas 64 px hög – gärna minst 400 px bred.',
      },
    ],
  },
  {
    title: 'Behandlingar',
    images: [
      {
        path: 'services/klassisk.jpg',
        label: 'Klassisk massage',
        where: 'Behandlingskortet på startsidan och behandlingens egen sida.',
        hint: 'Liggande, 16:9-format. JPG.',
      },
      {
        path: 'services/massageterapi.jpg',
        label: 'Massageterapi',
        where: 'Behandlingskortet på startsidan och behandlingens egen sida.',
        hint: 'Liggande, 16:9-format. JPG.',
      },
      {
        path: 'services/prenatal.jpg',
        label: 'Gravidmassage',
        where: 'Behandlingskortet på startsidan och behandlingens egen sida.',
        hint: 'Liggande, 16:9-format. JPG.',
      },
      {
        path: 'services/relax.jpg',
        label: 'Avkopplande massage',
        where: 'Behandlingskortet på startsidan och behandlingens egen sida.',
        hint: 'Liggande, 16:9-format. JPG.',
      },
    ],
  },
  {
    title: 'Friskvård',
    images: [
      {
        path: 'partners/benifex.png',
        label: 'Benifex-logotyp',
        where: 'Friskvårdsrutan på startsidan och friskvårdssidan.',
        hint: 'Liggande PNG med genomskinlig bakgrund.',
      },
      {
        path: 'partners/epassi.png',
        label: 'Epassi-logotyp',
        where: 'Friskvårdsrutan på startsidan och friskvårdssidan.',
        hint: 'Liggande PNG med genomskinlig bakgrund.',
      },
    ],
  },
  {
    title: 'Presentkort',
    images: [
      {
        path: 'presentkort-fysiskt.jpg',
        label: 'Foto – fysiskt presentkort',
        where: 'Högst upp på presentkortssidan.',
        hint: 'Liggande foto i 4:3-format. JPG.',
      },
    ],
  },
  {
    title: 'Delning på sociala medier',
    images: [
      {
        path: 'og-image.jpg',
        label: 'Delningsbild',
        where: 'Bilden som visas när hemsidan delas på Facebook, LinkedIn m.m.',
        hint: 'Exakt 1200 × 630 px ger bäst resultat. JPG.',
      },
    ],
  },
]
