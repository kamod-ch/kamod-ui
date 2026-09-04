import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../src/components");
const CN_IMPORT = 'import { cn } from "../../lib/utils";';

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.tsx?$/.test(entry)) files.push(full);
  }
  return files;
}

function ensureCnImport(content) {
  if (content.includes('"../../lib/utils"')) return content;
  if (!content.includes("cn(")) return content;
  const lastImport = content.lastIndexOf("\nimport ");
  if (lastImport === -1) return `${CN_IMPORT}\n${content}`;
  const end = content.indexOf("\n", lastImport + 1);
  return `${content.slice(0, end + 1)}${CN_IMPORT}\n${content.slice(end + 1)}`;
}

function migrate(content) {
  let next = content;

  next = next.replace(
    /class=\{(\w+)\(\{ class: className as string \| undefined \}\)\}/g,
    "class={cn($1(), className)}",
  );

  next = next.replace(
    /class=\{`(\$\{positionBySide\[side\]\}) (\$\{alignClass\}) \$\{(\w+)\(\{ side, class: className as string \| undefined \}\)\}`\}/g,
    "class={cn($3({ side }), $1, $2, className)}",
  );

  next = next.replace(
    /class=\{`\$\{button\(\{ variant, size, class: className as string \| undefined \}\)\} \$\{inputGroupButton\(\{ size \}\)\}`\}/g,
    "class={cn(button({ variant, size }), inputGroupButton({ size }), className)}",
  );

  next = next.replace(
    /class=\{button\(\{ variant, class: cn\("w-full sm:w-auto", className as string \| undefined\) \}\)\}/g,
    'class={cn(button({ variant }), "w-full sm:w-auto", className)}',
  );

  next = next.replace(
    /asChild \? className : button\(\{ variant: "outline", class: className as string \| undefined \}\)/g,
    'asChild ? className : cn(button({ variant: "outline" }), className)',
  );

  next = next.replace(
    /cn\(\s*toggleGroupItem\(\{ variant: resolvedVariant, size: resolvedSize, class: className \}\),\s*\)/g,
    "cn(toggleGroupItem({ variant: resolvedVariant, size: resolvedSize }), className)",
  );

  next = next.replace(
    /const resolvedClassName = item\(\{\s*variant: resolvedVariant,\s*size: resolvedSize,\s*class: className as string \| undefined,\s*\}\);/g,
    "const variantClasses = item({ variant: resolvedVariant, size: resolvedSize });\n  const resolvedClassName = cn(variantClasses, className);",
  );

  next = next.replace(
    /class: cn\(childProps\.class, childProps\.className, resolvedClassName\)/g,
    "class: cn(variantClasses, childProps.class, childProps.className, className)",
  );

  next = next.replace(
    /const classes = sidebarMenuButton\(\{\s*variant,\s*size,\s*class: className as string \| undefined,\s*\}\);/g,
    "const classes = cn(sidebarMenuButton({ variant, size }), className);",
  );

  next = next.replace(
    /const resolvedClass = dropdownItem\(\{\s*inset,\s*variant,\s*class: className as string \| undefined,\s*\}\);/g,
    "const resolvedClass = cn(dropdownItem({ inset, variant }), className);",
  );

  return next;
}

let changed = 0;
for (const file of walk(root)) {
  const original = readFileSync(file, "utf8");
  let next = migrate(original);
  next = ensureCnImport(next);
  if (next !== original) {
    writeFileSync(file, next);
    changed += 1;
    console.log(path.relative(root, file));
  }
}

console.log(`\nUpdated ${changed} files.`);
