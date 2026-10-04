import { renderToString } from "preact-render-to-string";
import { PathDisplay } from "./PathDisplay";

/** Markdown-backed guides use the same component and escaping as JSX path references. */
export const renderPathMarkup = (path: string) => renderToString(<PathDisplay path={path} />);
