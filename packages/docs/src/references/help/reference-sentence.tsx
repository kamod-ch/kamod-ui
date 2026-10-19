import { basePrefix, withBasePath } from "../../base-path";

/** Small safe prose vocabulary: source text stays text, including unsupported HTML/URLs. */
export function ReferenceSentence({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g).map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={index}>{part.slice(1, -1)}</code>;
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s]+|\/(?!\/)[^\s]*)\)$/);
        return link ? (
          <a
            key={index}
            href={
              link[2].startsWith("/") && !link[2].startsWith(`${basePrefix()}/`)
                ? withBasePath(link[2])
                : link[2]
            }
            target="_top"
          >
            {link[1]}
          </a>
        ) : (
          part
        );
      })}
    </>
  );
}
