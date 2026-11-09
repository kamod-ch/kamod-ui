import { render } from "preact";
import "@kamod-ch/themes/theme.css";
import "./app.css";
import { App } from "./App";

render(<App />, document.getElementById("app")!);
