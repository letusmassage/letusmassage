import type { Article } from './types'

export const article: Article = {
  slug: 'deep-tissue-vs-svensk-massage',
  title: 'Deep tissue eller svensk massage? Skillnaderna förklarade',
  description:
    'Svensk massage och deep tissue är de två mest använda massageteknikerna. Här förklaras skillnader i tryck, syfte, känsla och vem de passar — så du kan välja rätt i Lund.',
  date: '2026-05-08',
  readMin: 5,
  keywords: [
    'deep tissue Lund',
    'svensk massage',
    'skillnad svensk deep tissue',
    'massagetekniker',
    'massage tryck',
  ],
  relatedServices: ['relax', 'klassisk', 'massageterapi'],
  relatedTechniques: ['svensk-massage', 'deep-tissue'],
  intro:
    'Två av de mest kända massageteknikerna är svensk massage och deep tissue. De ser ofta lika ut för någon som tittar på utifrån — men i kroppen känns de helt olika. Här är en tydlig genomgång av skillnaderna och vem som har mest nytta av vilken.',
  blocks: [
    { type: 'h2', text: 'Svensk massage — fundamentet' },
    {
      type: 'p',
      text: '[Svensk massage](/metoder/svensk-massage) är basen i nästan all västerländsk massage. Den utvecklades på 1800-talet och bygger på fem grundgrepp: effleurage (långa strykningar), petrissage (knådning), friktion, tapotement (lätt klappning) och vibration.',
    },
    {
      type: 'p',
      text: 'Trycknivån är mjuk till medeltung. Tempot är flytande och rytmiskt. Syftet är att förbättra blodcirkulationen, mjuka upp ytligare muskelspänningar och skapa en känsla av djup avslappning. Det är en ideal teknik för stress, sömnsvårigheter, allmän muskelkänsla och som introduktion till massage.',
    },
    { type: 'h2', text: 'Deep tissue — när det ytliga inte räcker' },
    {
      type: 'p',
      text: '[Deep tissue](/metoder/deep-tissue) arbetar djupare ner — genom de ytliga muskellagren och in i de underliggande, ofta strama eller fastlåsta strukturerna. Tempot är långsammare, trycket fastare, och rörelserna ofta mer riktade mot specifika spänningsområden.',
    },
    {
      type: 'p',
      text: 'Deep tissue är inte "hårdare för hårdhetens skull". Tekniken kräver att muskeln först värms upp och slappnar av — annars spänner den emot. Därför börjar nästan all deep tissue med några minuter av svensk-liknande arbete för att förbereda vävnaden.',
    },
    { type: 'h2', text: 'Tryck, känsla och tempo' },
    {
      type: 'p',
      text: 'Här är de tydligaste skillnaderna i hur de känns under behandlingen:',
    },
    {
      type: 'ul',
      items: [
        '**Svensk massage**: mjuk till medel, flytande tempo, ofta ögon-stängda-avslappnande',
        '**Deep tissue**: medel till djup, långsammare tempo, ibland intensivt eller "godsmärtsamt" på spända områden',
        '**Svensk** ger känslan av att kroppen mjuknar upp som helhet',
        '**Deep tissue** ger känslan av att specifika punkter eller "knutar" släpper',
      ],
    },
    { type: 'h2', text: 'Vem passar svensk massage?' },
    {
      type: 'ul',
      items: [
        'Du provar massage för första gången',
        'Du vill ha en lugn och avstressande paus',
        'Du har generell muskelkänsla utan akuta besvär',
        'Du föredrar mjukare tryck',
        'Du är gravid eller annars i ett tillstånd där djup massage inte rekommenderas',
      ],
    },
    {
      type: 'p',
      text: 'Hos oss använder vi svensk massage som grund i [Relaxmassage](/behandlingar/relax) och [Gravidmassage](/behandlingar/prenatal).',
    },
    { type: 'h2', text: 'Vem passar deep tissue?' },
    {
      type: 'ul',
      items: [
        'Du har återkommande spänningar i nacke, axlar eller rygg',
        'Du tränar mycket eller har fysiskt arbete',
        'Du har stillasittande jobb och känner stelhet',
        'Du har provat svensk massage men känner att det inte räcker längre',
        'Du har specifika problem som tech neck, lumbago eller ischias',
      ],
    },
    {
      type: 'p',
      text: 'Deep tissue är en av huvudkomponenterna i både [Klassisk massage](/behandlingar/klassisk) och [Massageterapi](/behandlingar/massageterapi).',
    },
    { type: 'h2', text: 'Hur Let Us Massage kombinerar dem' },
    {
      type: 'p',
      text: 'I de flesta av våra behandlingar används båda teknikerna i kombination. En typisk klassisk session inleds med svenska grepp för att värma upp muskulaturen, går sedan in i mer riktat deep tissue-arbete på de specifika spänningsområden du har, och avslutas igen med svenska grepp för att lugna kroppen.',
    },
    {
      type: 'callout',
      text: 'Du behöver alltså sällan välja en eller den andra. Vad du behöver välja är vilken **behandling** du bokar (Relax, Klassisk eller Massageterapi) — och därinom anpassar terapeuten teknikerna efter just din kropp.',
    },
    { type: 'h2', text: 'Vanliga frågor' },
    {
      type: 'faq',
      items: [
        {
          q: 'Måste deep tissue göra ont?',
          a: 'Nej. En vanlig myt är att "bra massage måste göra ont". Modern deep tissue arbetar djupt men inte över komfortgränsen — det ska kännas intensivt på de spända punkterna men aldrig så att du spänner emot.',
        },
        {
          q: 'Kan jag vara öm efter en deep tissue?',
          a: 'Ja, lätt ömhet i 1–2 dagar är vanligt efter djupare arbete. Drick mycket vatten och undvik tung träning resten av dagen för bästa resultat.',
        },
        {
          q: 'Är svensk massage "för enkel" för någon med kroniska besvär?',
          a: 'Inte alltid. Svensk massage är effektiv för generell stresshantering och kan kombineras med andra tekniker. Men för riktade besvär behöver du oftast deep tissue eller massageterapi.',
        },
      ],
    },
    { type: 'h2', text: 'Boka tid hos oss i Lund' },
    {
      type: 'p',
      text: 'Vi väljer rätt blandning av tekniker tillsammans med dig vid varje besök. Är du osäker på vilken behandling som passar — ring eller skriv till oss innan, så hjälper vi dig att välja rätt.',
    },
  ],
}
