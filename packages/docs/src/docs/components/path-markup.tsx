import { renderStaticMarkup } from "../../lib/render-static-markup";
import { PathDisplay } from "./PathDisplay";

/** Markdown-backed guides use the same component and escaping as JSX path references. */
export const renderPathMarkup = (path: string) => renderStaticMarkup(<PathDisplay path={path} />);
