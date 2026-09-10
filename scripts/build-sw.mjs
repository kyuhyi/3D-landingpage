// 정적 빌드 결과(out/)를 훑어 서비스워커 프리캐시 목록과 버전을 채운다.
// `next build` 뒤에 실행된다 (package.json "build").
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const outDir = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
};
walk(outDir);

const skip = /(^|\/)(sw\.js|.*\.txt|.*\.map|grok-reference\.jpg|.*\.nft\.json)$/;
const urls = files
  .map((file) => "/" + relative(outDir, file).split(sep).join("/"))
  .filter((url) => !skip.test(url))
  .map((url) => (url.endsWith("/index.html") ? url.slice(0, -"index.html".length) : url))
  .sort();

const hash = createHash("sha256");
for (const file of files) if (!/sw\.js$/.test(file)) hash.update(readFileSync(file));
const version = hash.digest("hex").slice(0, 12);

const template = readFileSync(join(outDir, "sw.js"), "utf8");
const output = template
  .replace('"__VERSION__"', JSON.stringify(version))
  .replace('"__PRECACHE__"', JSON.stringify(urls, null, 2));
writeFileSync(join(outDir, "sw.js"), output);
console.log(`sw.js: ${urls.length} files precached, version ${version}`);
