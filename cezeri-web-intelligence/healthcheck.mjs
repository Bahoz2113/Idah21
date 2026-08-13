#!/usr/bin/env node
/**
 * CEZERI Web Intelligence — saglik kontrolu
 *
 * Kontrol edilenler:
 *   1. Node / npx
 *   2. Claude Code erisilebilir mi
 *   3. Skill'ler kurulu ve discover edilebilir formatta mi
 *   4. Global policy blogu yerinde mi
 *   5. MCP browser kayitli mi
 *   6. Browser gercekten baslatilabiliyor mu
 *   7. Ag erisimi var mi
 *
 * Cikis kodu: 0 = tum kritik kontroller gecti, 1 = kritik hata var.
 *
 * Kullanim:
 *   node healthcheck.mjs
 *   node healthcheck.mjs --json      makine okunur cikti
 *   node healthcheck.mjs --no-net    ag testini atla
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  SKILLS_DIR, GLOBAL_MEMORY, MCP_NAME, SKILL_NAMES,
  bold, dim, green, yellow, red, cyan,
  readIfExists, run, hasCommand, readManifest, packageVersion,
  validateSkillFrontmatter,
} from "./lib/common.mjs";

const JSON_OUT = process.argv.includes("--json");
const NO_NET = process.argv.includes("--no-net");

const checks = [];
/** @param {"PASS"|"FAIL"|"WARN"|"BLOCKED"} status */
function record(name, status, detail, critical = true) {
  checks.push({ name, status, detail, critical });
}

// ─────────────────────────────────────────────────── 1. Node / npx
record("node", Number(process.versions.node.split(".")[0]) >= 18 ? "PASS" : "FAIL",
  `Node ${process.versions.node} (>=18 gerekli)`);
record("npx", hasCommand("npx") ? "PASS" : "FAIL", hasCommand("npx") ? "mevcut" : "bulunamadi");

// ─────────────────────────────────────────────────── 2. Claude Code
if (hasCommand("claude")) {
  const v = run("claude", ["--version"], { timeout: 30_000 });
  record("claude-cli", "PASS", (v.stdout || "").trim() || "surum okunamadi");
} else {
  record("claude-cli", "FAIL", "claude bulunamadi (npm install -g @anthropic-ai/claude-code)");
}

// ─────────────────────────────────────────────────── 3. Skill'ler
const missing = [];
const malformed = [];
for (const name of SKILL_NAMES) {
  const raw = readIfExists(path.join(SKILLS_DIR, name, "SKILL.md"));
  if (raw === null) { missing.push(name); continue; }
  const { valid, errors } = validateSkillFrontmatter(raw);
  if (!valid) malformed.push(`${name} (${errors[0]})`);
}
if (missing.length === 0 && malformed.length === 0) {
  record("skills", "PASS", `${SKILL_NAMES.length}/${SKILL_NAMES.length} skill kurulu ve gecerli`);
} else {
  record("skills", "FAIL",
    [missing.length ? `eksik: ${missing.join(", ")}` : null,
     malformed.length ? `bozuk frontmatter: ${malformed.join(", ")}` : null]
      .filter(Boolean).join(" | "));
}

// ─────────────────────────────────────────────────── 4. Policy
const mem = readIfExists(GLOBAL_MEMORY);
if (mem && mem.includes("CEZERI WEB INTELLIGENCE POLICY")) {
  record("policy", "PASS", "~/.claude/CLAUDE.md icinde blok mevcut");
} else {
  record("policy", "FAIL", "global policy blogu bulunamadi (node install.mjs)");
}

// ─────────────────────────────────────────────────── 5. MCP kaydı
if (hasCommand("claude")) {
  const r = run("claude", ["mcp", "list"], { timeout: 90_000 });
  const raw = (r.stdout || "") + (r.stderr || "");
  const line = raw.split(/\r?\n/).find((l) => new RegExp(`(^|\\s)${MCP_NAME}\\b`).test(l));
  if (!line) {
    record("mcp-registered", "FAIL", `"${MCP_NAME}" kayitli degil (node install.mjs)`);
  } else if (/fail|error|✗/i.test(line)) {
    record("mcp-registered", "WARN",
      `kayitli ama baglanti sorunlu: ${line.trim()} — Claude Code'u yeniden baslatin`);
  } else {
    record("mcp-registered", "PASS", line.trim());
  }
} else {
  record("mcp-registered", "FAIL", "claude CLI olmadan kontrol edilemez");
}

// ─────────────────────────────────────────────────── 6. Browser launch
// Gercek Chromium baslatilir. Yerel bir HTML dosyasi acilir -> ag GEREKMEZ,
// yani kisitli agda bile tarayici yetenegi dogrulanabilir.
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cezeri-hc-"));
  const page = path.join(tmp, "probe.html");
  const shot = path.join(tmp, "probe.png");
  fs.writeFileSync(page, "<!doctype html><title>cezeri</title><h1>ok</h1>");

  const r = run("npx", ["-y", "playwright", "screenshot", "--browser=chromium",
    pathToFileURL(page).href, shot], { timeout: 240_000 });

  const produced = fs.existsSync(shot) && fs.statSync(shot).size > 0;
  if (produced) {
    record("browser-launch", "PASS", "Chromium basladi, yerel sayfa render edildi");
  } else {
    const out = ((r.stdout || "") + (r.stderr || "")).trim().split("\n").filter(Boolean).slice(-1)[0];
    record("browser-launch", "WARN",
      `baslatilamadi — 'npx playwright install chromium' gerekebilir. Detay: ${out || "-"}`,
      false);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ─────────────────────────────────────────────────── 7. Ağ erişimi
if (NO_NET) {
  record("network", "BLOCKED", "--no-net verildi", false);
} else {
  let status = "FAIL", detail = "erisim yok";
  try {
    const ctl = AbortSignal.timeout(15_000);
    const res = await fetch("https://registry.npmjs.org/-/ping", { signal: ctl });
    status = res.ok ? "PASS" : "WARN";
    detail = `registry.npmjs.org -> HTTP ${res.status}`;
  } catch (e) {
    status = "FAIL";
    detail = `disari erisim basarisiz: ${e.message}`;
  }
  record("network", status, detail, false);
}

// ─────────────────────────────────────────────────── ÇIKTI
const manifest = readManifest();
const criticalFails = checks.filter((c) => c.critical && c.status === "FAIL");

if (JSON_OUT) {
  console.log(JSON.stringify({
    package_version: packageVersion(),
    installed_version: manifest?.version ?? null,
    installed_at: manifest?.installed_at ?? null,
    healthy: criticalFails.length === 0,
    checks,
  }, null, 2));
  process.exit(criticalFails.length ? 1 : 0);
}

const icon = { PASS: green("PASS   "), FAIL: red("FAIL   "), WARN: yellow("WARN   "), BLOCKED: cyan("BLOCKED") };
console.log(bold(`\nCEZERI Web Intelligence — saglik kontrolu`));
console.log(dim(`paket: v${packageVersion()}  |  kurulu: ${manifest?.version ?? "kurulum kaydi yok"}\n`));
for (const c of checks) {
  console.log(`  ${icon[c.status]}  ${c.name.padEnd(16)} ${c.detail}`);
}

console.log("");
if (criticalFails.length === 0) {
  console.log(green(bold("Sistem saglikli.")) + " " + dim("(WARN/BLOCKED satirlari kritik degil)"));
} else {
  console.log(red(bold("Kritik sorun var:")));
  for (const c of criticalFails) console.log(`  - ${c.name}: ${c.detail}`);
  console.log(`\n  Cogu sorun icin: ${cyan("node install.mjs")} (idempotent, tekrar calistirmak guvenli)`);
}
console.log("");
process.exit(criticalFails.length ? 1 : 0);
