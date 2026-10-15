/** Parse a single invocation as text, without executing, expanding or fetching anything. */
export function parseCommand(label: string) {
  const source = label.trim().replace(/^\$\s+/, "");
  if (!source || source.length > 1024 || /[\n\r`]|\$[({]/.test(source)) return;
  const words: string[] = [];
  let word = "";
  let quote = "";
  let escaped = false;
  for (const char of source) {
    if (escaped) {
      word += char;
      escaped = false;
    } else if (char === "\\" && quote !== "'") escaped = true;
    else if (quote) {
      if (char === quote) quote = "";
      else word += char;
    } else if (char === '"' || char === "'") quote = char;
    else if (/[;&|<>]/.test(char)) return;
    else if (/\s/.test(char)) {
      if (word) words.push(word);
      word = "";
    } else word += char;
  }
  if (quote || escaped) return;
  if (word) words.push(word);
  const wrapped = words[0] === "corepack" && ["pnpm", "npm", "yarn"].includes(words[1]);
  if (wrapped) words.shift();
  if (words.length < 2 && !wrapped) return;
  const tool = words.shift()!;
  let workspace: string | undefined;
  const args = words.filter((value, index) => {
    if (["--filter", "-F", "--workspace"].includes(value) && words[index + 1]) {
      workspace = words[index + 1];
      return false;
    }
    if (index && ["--filter", "-F", "--workspace"].includes(words[index - 1])) return false;
    const match = value.match(/^--(?:filter|workspace)=(.+)$/);
    if (match) workspace = match[1];
    return !match;
  });
  const operation = args.find((value) => !value.startsWith("-"));
  return { tool, operation, args, workspace, wrapped };
}
