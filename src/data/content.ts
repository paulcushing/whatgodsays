import bundled from "./content.bundled.json";
import type { ContentPayload, Struggle, Truth } from "./verseUtils";

export const bundledContent = bundled as ContentPayload;

export function getTruthById(
  id: string,
  content: ContentPayload = bundledContent,
): Truth | undefined {
  return content.truths.find((truth) => truth.id === id);
}

export function getStruggleById(
  id: string,
  content: ContentPayload = bundledContent,
): Struggle | undefined {
  return content.struggles.find((struggle) => struggle.id === id);
}

export function truthFromStruggle(struggle: Struggle): Truth {
  const firstVerse = struggle.verses[0];
  return {
    id: `lie-${struggle.id}`,
    category: struggle.category,
    statement: struggle.truth,
    reference: firstVerse?.reference ?? "Scripture",
    verse: firstVerse?.verse ?? "",
    reflectionQuestion: struggle.reflection,
    journalPrompt: struggle.reflection,
  };
}

export function getShareableTruthById(
  id: string,
  content: ContentPayload = bundledContent,
): Truth | undefined {
  if (id.startsWith("lie-")) {
    const struggle = getStruggleById(id.slice(4), content);
    return struggle ? truthFromStruggle(struggle) : undefined;
  }
  return getTruthById(id, content);
}
