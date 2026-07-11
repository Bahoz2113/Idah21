// Build sonrasi Prisma engine'ini serverless function'in aradigi yerlere kopyalar
const fs = require("fs");
const path = require("path");

const src = path.join("packages", "database", "src", "generated", "client");
const dests = [
  path.join("apps", "web", ".next", "server", "app", ".prisma", "client"),
  path.join("apps", "web", ".next", "server", "app", "api", "trpc"),
  path.join("apps", "web", ".next", "server", "app", "api"),
  path.join("apps", "web", ".next", "server", "chunks"),
  path.join("apps", "web", ".next", "server"),
];

let files = [];
try {
  files = fs.readdirSync(src);
} catch (e) {
  console.log("[copy-engine] KAYNAK YOK:", src);
  process.exit(0);
}

const engines = files.filter((f) => f.endsWith(".so.node"));
console.log("[copy-engine] Bulunan engine dosyalari:", engines);

if (engines.length === 0) {
  console.log("[copy-engine] UYARI: .so.node engine bulunamadi!");
}

for (const d of dests) {
  try {
    fs.mkdirSync(d, { recursive: true });
  } catch (e) {}
  for (const f of engines) {
    try {
      fs.copyFileSync(path.join(src, f), path.join(d, f));
      console.log("[copy-engine] kopyalandi ->", path.join(d, f));
    } catch (e) {
      console.log("[copy-engine] HATA", d, f, e.message);
    }
  }
  try {
    fs.copyFileSync(path.join(src, "schema.prisma"), path.join(d, "schema.prisma"));
  } catch (e) {}
}
console.log("[copy-engine] Tamamlandi.");
