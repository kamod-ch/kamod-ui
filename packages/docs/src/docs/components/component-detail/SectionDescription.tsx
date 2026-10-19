import { withBasePath } from "../../../base-path";
import { BrandText } from "../brand/BrandText";
import { InlineCode } from "../PathDisplay";

/** Render the small prose vocabulary used by authored section descriptions; never interpret HTML. */
function DescriptionInline({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\((?:\/(?!\/)|#)[^\s)]+\)|\b[\w-]+="[^"]+")/g)
        .map((part, index) => {
          if (index % 2 === 0) return <BrandText key={index}>{part}</BrandText>;
          if (part.startsWith("`")) {
            return <InlineCode key={index}>{part.slice(1, -1)}</InlineCode>;
          }
          if (part.startsWith("**")) {
            return (
              <strong key={index}>
                <BrandText>{part.slice(2, -2)}</BrandText>
              </strong>
            );
          }
          const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (link) {
            return (
              <BrandText key={index}>
                <a href={link[2].startsWith("/") ? withBasePath(link[2]) : link[2]}>{link[1]}</a>
              </BrandText>
            );
          }
          return /^[\w-]+="/.test(part) ? <InlineCode key={index}>{part}</InlineCode> : part;
        })}
    </>
  );
}

/** Keep longer example guidance scannable with paragraphs, emphasis, inline code and local links. */
export function SectionDescription({
  text,
  paragraphClassName = "docs-copy",
}: {
  text: string;
  /** Let established guide wrappers own typography while sharing inline formatting. */
  paragraphClassName?: string;
}) {
  return (
    <>
      {text.split(/\n\s*\n/).map((paragraph, index) => (
        <p class={paragraphClassName} key={index}>
          <DescriptionInline text={paragraph} />
        </p>
      ))}
    </>
  );
}
