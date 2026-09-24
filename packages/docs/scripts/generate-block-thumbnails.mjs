/** Capture the published preview routes, not separately maintained demo markup. */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import { preview } from "vite";

const { values } = parseArgs({
  options: { base: { type: "string", default: "/" }, block: { type: "string" } },
});
const base = `/${values.base.split("/").filter(Boolean).join("/")}/`.replace(/^\/\//, "/");
const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "public/block-previews");
const manifestPath = resolve(root, "src/blocks/generated/block-thumbnails.json");
const viewport = { width: 1280, height: 800 };
const widths = [480, 960];

/** Chromium already ships with Playwright; use its WebP encoder without another dependency. */
async function encode(page, png, width) {
  return page.evaluate(
    async ({ png, width }) => {
      const bytes = Uint8Array.from(atob(png), (character) => character.charCodeAt(0));
      const bitmap = await createImageBitmap(new Blob([bytes], { type: "image/png" }));
      const canvas = new OffscreenCanvas(width, Math.round((width * bitmap.height) / bitmap.width));
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.84 });
      if (blob.type !== "image/webp") throw new Error("WebP encoding is unavailable.");
      return Array.from(new Uint8Array(await blob.arrayBuffer()));
    },
    { png: png.toString("base64"), width },
  );
}

async function ready(page, url, waitForImages = true) {
  // Vite's extensionless fallback can serve the homepage instead of a directory's index.html.
  const directoryUrl = new URL(url);
  if (!directoryUrl.pathname.endsWith("/")) directoryUrl.pathname += "/";
  const response = await page.goto(directoryUrl.href, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`Preview route failed: ${url}`);
  await page.locator("#pp-preloader").waitFor({ state: "hidden" });
  await page.evaluate(() => document.fonts.ready);
  // Overview discovery must not wait for offscreen lazy thumbnails.
  if (waitForImages)
    await page.waitForFunction(() =>
      [...document.images].every((img) => img.complete && img.naturalWidth > 0),
    );
  if (
    await page
      .getByText(/^(Loading block…|Could not load this block page\.|Block not found\.)$/)
      .count()
  ) {
    throw new Error(`Preview did not hydrate: ${url}`);
  }
}

/** Discover current visible registry entries through the same links visitors use. */
async function discoverBlocks(browser, origin) {
  const page = await browser.newPage({ viewport });
  try {
    await ready(page, `${origin}${base}blocks/sidebar/`, false);
    const categories = await page
      .locator('aside.docs-sidebar nav[aria-label="Docs blocks"] a')
      .evaluateAll((links) => links.map((link) => link.href));
    if (!categories.length)
      throw new Error("No visible block categories found in the production build.");
    const blocks = [];
    for (const category of categories) {
      await ready(page, category, false);
      const entries = await page.locator("a.blocks-overview-card").evaluateAll((links) =>
        links.map((link) => {
          const url = new URL(link.href);
          const segments = url.pathname.split("/").filter(Boolean);
          return {
            key: segments.slice(-2).join("/"),
            url: `${url.origin}${url.pathname.replace(/\/$/, "")}/preview/`,
          };
        }),
      );
      if (!entries.length) throw new Error(`No overview cards found: ${category}`);
      blocks.push(...entries);
    }
    return blocks;
  } finally {
    await page.close();
  }
}

/** Fresh state for each scheme makes results independent of capture order and local preferences. */
async function capture(browser, block, scheme, assets) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: "reduce",
    locale: "en-US",
    timezoneId: "UTC",
  });
  try {
    await context.addInitScript((scheme) => {
      localStorage.setItem("theme", scheme);
      localStorage.setItem("theme-preset", "kamod");
    }, scheme);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const requiredAssets = new Set(["script", "stylesheet", "font"]);
    page.on("response", (response) => {
      if (response.status() >= 400 && requiredAssets.has(response.request().resourceType())) {
        errors.push(`Asset failed (${response.status()}): ${response.url()}`);
      }
    });
    page.on("requestfailed", (request) => {
      if (requiredAssets.has(request.resourceType())) errors.push(`Asset failed: ${request.url()}`);
    });
    await page.clock.setFixedTime(new Date("2026-01-15T12:00:00Z"));
    await ready(page, block.url);
    // This variant demonstrates a dialog; capture it open so its sidebar is visible.
    if (block.key === "sidebar/sidebar-13") {
      await page.getByRole("button", { name: "Open settings" }).click();
      await page.getByRole("dialog").waitFor();
    }
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
    });
    if (
      (await page.locator("html").evaluate((html) => html.classList.contains("dark"))) !==
      (scheme === "dark")
    )
      throw new Error(`Incorrect theme: ${block.key}`);
    const png = await page.screenshot({ animations: "disabled" });
    if (errors.length) throw new Error(`${block.key}: ${errors.join("; ")}`);
    const images = [];
    for (const width of widths) {
      const bytes = Buffer.from(await encode(page, png, width));
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
      const filename = `${block.key.replace("/", "--")}-${scheme}-${width}-${hash}.webp`;
      assets.set(filename, bytes);
      images.push({
        src: `/block-previews/${filename}`,
        width,
        height: (width * viewport.height) / viewport.width,
      });
    }
    return images;
  } finally {
    await context.close();
  }
}

/** Publish after all captures succeed, then remove only this generator's obsolete assets. */
async function publish(manifest, assets) {
  await mkdir(output, { recursive: true });
  for (const [filename, bytes] of assets) await writeFile(resolve(output, filename), bytes);
  await writeFile(
    manifestPath,
    `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)}\n`,
  );
  const retained = new Set(
    Object.values(manifest).flatMap((themes) =>
      Object.values(themes).flatMap((images) => images.map((image) => image.src.split("/").at(-1))),
    ),
  );
  for (const filename of await readdir(output)) {
    if (
      /^[a-z0-9-]+--[a-z0-9-]+-(light|dark)-(480|960)-[a-f0-9]{10}\.webp$/.test(filename) &&
      !retained.has(filename)
    )
      await rm(resolve(output, filename));
  }
  console.log(
    `Generated ${assets.size} WebP assets (${Math.round([...assets.values()].reduce((sum, bytes) => sum + bytes.length, 0) / 1024)} KiB). Rebuild docs to publish the updated images.`,
  );
}

async function generate() {
  await readFile(resolve(root, "dist/blocks/sidebar/index.html"));
  const server = await preview({
    configFile: false,
    root,
    base,
    preview: { host: "127.0.0.1", port: 0, open: false },
  });
  let browser;
  try {
    const address = server.httpServer.address();
    browser = await chromium.launch();
    const blocks = await discoverBlocks(browser, `http://127.0.0.1:${address.port}`);
    const selected = values.block ? blocks.filter((block) => block.key === values.block) : blocks;
    if (!selected.length) throw new Error(`No matching blocks: ${values.block ?? "all"}`);
    const manifest = values.block ? JSON.parse(await readFile(manifestPath, "utf8")) : {};
    const assets = new Map();
    for (const block of selected) {
      manifest[block.key] = {};
      for (const scheme of ["light", "dark"])
        manifest[block.key][scheme] = await capture(browser, block, scheme, assets);
      console.log(`Captured ${block.key}`);
    }
    await publish(manifest, assets);
  } finally {
    await browser?.close();
    await new Promise((resolve, reject) =>
      server.httpServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

generate().catch((error) => {
  console.error(`Block thumbnails: ${error.message}`);
  process.exitCode = 1;
});
