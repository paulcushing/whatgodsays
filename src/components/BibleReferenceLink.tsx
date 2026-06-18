import { parseBibleReferenceLinks } from "@/data/bibleReferences";

export function BibleReferenceLink({
  reference,
  className,
}: {
  reference: string;
  className?: string;
}) {
  const parts = parseBibleReferenceLinks(reference);

  return (
    <>
      {parts.map((part, index) =>
        part.href ? (
          <a
            key={`${part.text}-${index}`}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {part.text}
          </a>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}
