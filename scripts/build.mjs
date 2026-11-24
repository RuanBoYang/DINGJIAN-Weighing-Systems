import { mkdir, readFile, writeFile, readdir, copyFile } from "node:fs/promises";
import path from "node:path";
import "./guides.mjs";
const types = {xml:"application/xml",txt:"text/plain",html:"text/html; charset=utf-8", css:"text/css", js:"text/javascript", webp:"image/webp", jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", svg:"image/svg+xml"};
const assets = {};
async function collect(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if(entry.isDirectory()) await collect(file);
    else assets["/"+path.relative("public",file).split(path.sep).join("/")] = [types[entry.name.split(".").pop()], (await readFile(file)).toString("base64")];
  }
}
await collect("public");
await mkdir("dist/server",{recursive:true});
await mkdir("dist/.openai",{recursive:true});
await copyFile(".openai/hosting.json","dist/.openai/hosting.json");
await writeFile("dist/server/index.js", "const assets="+JSON.stringify(assets)+";\n"+await readFile("worker/index.js","utf8"));

