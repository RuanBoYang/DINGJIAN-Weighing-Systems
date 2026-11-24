import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const workerPath = resolve(projectRoot, "dist/server/index.js");
const manifestPath = resolve(projectRoot, "dist/.openai/hosting.json");

const [source, manifest] = await Promise.all([
  readFile(workerPath, "utf8"),
  readFile(manifestPath, "utf8"),
]);
JSON.parse(manifest);

// A data URL forces ESM parsing even though the generated output has no package.json.
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const workerModule = await import(moduleUrl);
assert.equal(
  typeof workerModule.default?.fetch,
  "function",
  `${pathToFileURL(workerPath)} must export default.fetch`,
);

console.log("Artifact is valid ESM and exports default.fetch");

const hostname = "https://dingjian-weighing-systems.charminghost4.chatgpt.site";
const get = url => workerModule.default.fetch(new Request(new URL(url, hostname)), {});
const sitemap = await (await get("/sitemap.xml")).text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const landingPages = locations.filter(url => /\/(zh|en)\//.test(url));
assert.equal(new Set(landingPages).size, 30);
const checkedPaths = new Set();
for (const url of landingPages) {
  const response = await get(url);
  assert.equal(response.status, 200, url);
  const html = await response.text();
  assert.ok(html.includes('rel="canonical" href="' + url + '"'), url);
  assert.ok(html.includes('hreflang="zh-CN"') && html.includes('hreflang="en"'), url);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const target = new URL(match[1].replaceAll("&amp;", "&"), hostname).pathname;
    if (!checkedPaths.has(target)) {
      assert.equal((await get(target)).status, 200, target);
      checkedPaths.add(target);
    }
  }
}
console.log("Validated 30 bilingual landing pages, their canonical URLs and internal links.");
