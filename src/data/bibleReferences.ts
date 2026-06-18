const YOUVERSION_BIBLE_ID = "3034";
const YOUVERSION_VERSION = "BSB";
const YOUVERSION_BASE_URL = "https://www.bible.com/bible";

const BOOK_IDENTIFIERS: Record<string, string> = {
  genesis: "GEN",
  gen: "GEN",
  exodus: "EXO",
  exo: "EXO",
  exod: "EXO",
  leviticus: "LEV",
  lev: "LEV",
  numbers: "NUM",
  num: "NUM",
  deuteronomy: "DEU",
  deut: "DEU",
  deu: "DEU",
  joshua: "JOS",
  josh: "JOS",
  judges: "JDG",
  judg: "JDG",
  ruth: "RUT",
  "1 samuel": "1SA",
  "1 sam": "1SA",
  "2 samuel": "2SA",
  "2 sam": "2SA",
  "1 kings": "1KI",
  "1 kgs": "1KI",
  "2 kings": "2KI",
  "2 kgs": "2KI",
  "1 chronicles": "1CH",
  "1 chron": "1CH",
  "1 chr": "1CH",
  "2 chronicles": "2CH",
  "2 chron": "2CH",
  "2 chr": "2CH",
  ezra: "EZR",
  ezr: "EZR",
  nehemiah: "NEH",
  neh: "NEH",
  esther: "EST",
  est: "EST",
  job: "JOB",
  psalm: "PSA",
  psalms: "PSA",
  ps: "PSA",
  psa: "PSA",
  proverbs: "PRO",
  proverb: "PRO",
  prov: "PRO",
  pro: "PRO",
  ecclesiastes: "ECC",
  eccl: "ECC",
  ecc: "ECC",
  "song of songs": "SNG",
  "song of solomon": "SNG",
  song: "SNG",
  sng: "SNG",
  isaiah: "ISA",
  isa: "ISA",
  jeremiah: "JER",
  jer: "JER",
  lamentations: "LAM",
  lam: "LAM",
  ezekiel: "EZK",
  ezek: "EZK",
  ezk: "EZK",
  daniel: "DAN",
  dan: "DAN",
  hosea: "HOS",
  hos: "HOS",
  joel: "JOL",
  jol: "JOL",
  amos: "AMO",
  amo: "AMO",
  obadiah: "OBA",
  obad: "OBA",
  oba: "OBA",
  jonah: "JON",
  jon: "JON",
  micah: "MIC",
  mic: "MIC",
  nahum: "NAM",
  nah: "NAM",
  nam: "NAM",
  habakkuk: "HAB",
  hab: "HAB",
  zephaniah: "ZEP",
  zeph: "ZEP",
  zep: "ZEP",
  haggai: "HAG",
  hag: "HAG",
  zechariah: "ZEC",
  zech: "ZEC",
  zec: "ZEC",
  malachi: "MAL",
  mal: "MAL",
  matthew: "MAT",
  matt: "MAT",
  mat: "MAT",
  mark: "MRK",
  mrk: "MRK",
  luke: "LUK",
  luk: "LUK",
  john: "JHN",
  jhn: "JHN",
  acts: "ACT",
  act: "ACT",
  romans: "ROM",
  rom: "ROM",
  "1 corinthians": "1CO",
  "1 cor": "1CO",
  "2 corinthians": "2CO",
  "2 cor": "2CO",
  galatians: "GAL",
  gal: "GAL",
  ephesians: "EPH",
  eph: "EPH",
  philippians: "PHP",
  phil: "PHP",
  php: "PHP",
  colossians: "COL",
  col: "COL",
  "1 thessalonians": "1TH",
  "1 thess": "1TH",
  "1 th": "1TH",
  "2 thessalonians": "2TH",
  "2 thess": "2TH",
  "2 th": "2TH",
  "1 timothy": "1TI",
  "1 tim": "1TI",
  "2 timothy": "2TI",
  "2 tim": "2TI",
  titus: "TIT",
  tit: "TIT",
  philemon: "PHM",
  phlm: "PHM",
  phm: "PHM",
  hebrews: "HEB",
  heb: "HEB",
  james: "JAS",
  jas: "JAS",
  "1 peter": "1PE",
  "1 pet": "1PE",
  "1 pe": "1PE",
  "2 peter": "2PE",
  "2 pet": "2PE",
  "2 pe": "2PE",
  "1 john": "1JN",
  "1 jn": "1JN",
  "2 john": "2JN",
  "2 jn": "2JN",
  "3 john": "3JN",
  "3 jn": "3JN",
  jude: "JUD",
  jud: "JUD",
  revelation: "REV",
  rev: "REV",
};

const BOOK_PATTERN = Object.keys(BOOK_IDENTIFIERS)
  .sort((a, b) => b.length - a.length)
  .map((book) => book.replaceAll(" ", "\\s+"))
  .join("|");

const FULL_REFERENCE_PATTERN = new RegExp(
  `^(${BOOK_PATTERN})\\s+(\\d+):(\\d+(?:-\\d+)?)$`,
  "i",
);
const CONTINUATION_PATTERN = /^(\d+(?:-\d+)?)$/;

export type BibleReferencePart = {
  text: string;
  href?: string;
};

type ParsedReference = {
  bookId: string;
  chapter: string;
  verse: string;
};

function normalizeBookName(book: string) {
  return book.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildYouVersionUrl({ bookId, chapter, verse }: ParsedReference) {
  return `${YOUVERSION_BASE_URL}/${YOUVERSION_BIBLE_ID}/${bookId}.${chapter}.${verse}.${YOUVERSION_VERSION}`;
}

function parseSingleReference(reference: string): ParsedReference | null {
  const match = reference.trim().match(FULL_REFERENCE_PATTERN);
  if (!match) return null;

  const [, book, chapter, verse] = match;
  const bookId = BOOK_IDENTIFIERS[normalizeBookName(book)];
  if (!bookId) return null;

  return { bookId, chapter, verse };
}

export function bibleReferenceToYouVersionUrl(reference: string) {
  const parsed = parseSingleReference(reference);
  return parsed ? buildYouVersionUrl(parsed) : null;
}

export function parseBibleReferenceLinks(reference: string): BibleReferencePart[] {
  const parts: BibleReferencePart[] = [];
  const tokens = reference.split(/(,\s*|\s*&\s*)/);
  let context: Pick<ParsedReference, "bookId" | "chapter"> | null = null;

  for (const token of tokens) {
    if (!token) continue;

    if (/^(,\s*|\s*&\s*)$/.test(token)) {
      parts.push({ text: token });
      continue;
    }

    const parsed = parseSingleReference(token);
    if (parsed) {
      context = { bookId: parsed.bookId, chapter: parsed.chapter };
      parts.push({ text: token, href: buildYouVersionUrl(parsed) });
      continue;
    }

    const continuation = token.trim().match(CONTINUATION_PATTERN);
    if (continuation && context) {
      parts.push({
        text: token,
        href: buildYouVersionUrl({ ...context, verse: continuation[1] }),
      });
      continue;
    }

    parts.push({ text: token });
  }

  return parts;
}
