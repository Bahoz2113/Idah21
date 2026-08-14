#!/usr/bin/env node
/**
 * CEZERI Web Intelligence — kurulum
 *
 * Her adım: CHECK -> CREATE/UPDATE -> VERIFY
 * Idempotent: ikinci çalıştırma hiçbir şeyi değiştirmez.
 *
 * Kullanım:
 *   node install.mjs             normal kurulum
 *   node install.mjs --dry-run   hiçbir şey yazmadan ne yapılacağını göster
 *   node install.mjs --no-mcp    Playwright MCP adımını atla
 */

import fs from "node:fs";
import path from "node:path";
import {
  PKG_ROOT, CLAUDE_HOME, SKILLS_DIR, GLOBAL_MEMORY, STATE_DIR,
  BACKUP_ROOT, MCP_NAME, MCP_PACKAGE, SKILL_NAMES,
  bold, dim, cyan, step, ok, skip, warn, fail, info,
  sha256, readIfExists, atomicWrite, backupFile, timestamp,
  run, hasCommand, readManifest, writeManifest, packageVersion,
  buildPolicyBlock, upsertPolicy, mcpStatus, validateSkillFrontmatter,
  addMcpToConfig, mcpInConfig,
} from "./lib/common.mjs";

const DRY = process.argv.includes("--dry-run");
const NO_MCP = process.argv.includes("--no-mcp");
const VERSION = packageVersion();
const STAMP = timestamp();

const summary = { skills: [], policy: null, mcp: null, changed: 0, errors: [] };

console.log(bold(`\nCEZERI Web Intelligence v${VERSION} — kurulum`));
console.log(dim(`Hedef: ${CLAUDE_HOME}`));
if (DRY) console.log(cyan("DRY-RUN: hicbir dosya yazilmayacak"));

// ─────────────────────────────────────────────────────── 1. ÖN KOŞULLAR
step("1) On kosullar");

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 18) {
  fail(`Node ${process.versions.node} bulundu, en az 18 gerekli.`);
  console.log("\n  YAPILACAK: Node.js 18+ kurun -> https://nodejs.org\n");
  process.exit(1);
}
ok(`Node ${process.versions.node}`);

if (!hasCommand("npx")) {
  fail("npx bulunamadi.");
  console.log("\n  YAPILACAK: Node.js kurulumunuzu onarin (npx, npm ile birlikte gelir).\n");
  process.exit(1);
}
ok("npx mevcut");

const claudeAvailable = hasCommand("claude");
if (claudeAvailable) {
  const v = run("claude", ["--version"], { timeout: 30_000 });
  ok(`claude CLI: ${(v.stdout || "").trim() || "surum okunamadi"}`);
} else {
  warn("claude komut satiri araci bulunamadi — MCP kaydi dogrudan ~/.claude.json'a yazilacak.");
  info("Komut satiri araci istersen: npm install -g @anthropic-ai/claude-code");
}

// ─────────────────────────────────────────────────────── 2. SKILL'LER
step("2) Skill'ler");

const installedSkills = [];
for (const name of SKILL_NAMES) {
  const src = path.join(PKG_ROOT, "skills", name, "SKILL.md");
  const dest = path.join(SKILLS_DIR, name, "SKILL.md");

  if (!fs.existsSync(src)) {
    fail(`kaynak yok: skills/${name}/SKILL.md`);
    summary.errors.push(`kaynak eksik: ${name}`);
    continue;
  }

  const content = fs.readFileSync(src, "utf8");
  const hash = sha256(content);
  const current = readIfExists(dest);

  if (current !== null && sha256(current) === hash) {
    skip(`${name} (degismedi)`);
    installedSkills.push({ name, path: dest, sha256: hash });
    summary.skills.push({ name, action: "unchanged" });
    continue;
  }

  const action = current === null ? "created" : "updated";
  if (!DRY) {
    if (current !== null) backupFile(dest, STAMP);
    atomicWrite(dest, content);
    // VERIFY: yazdigimiz sey gercekten diskte mi?
    const written = readIfExists(dest);
    if (written === null || sha256(written) !== hash) {
      fail(`${name} yazildi ama dogrulanamadi`);
      summary.errors.push(`dogrulama basarisiz: ${name}`);
      continue;
    }
  }
  ok(`${name} (${action === "created" ? "olusturuldu" : "guncellendi"})`);
  installedSkills.push({ name, path: dest, sha256: hash });
  summary.skills.push({ name, action });
  summary.changed++;
}

// ─────────────────────────────────────────────────────── 3. GLOBAL POLICY
step("3) Global policy (CEZERI WEB INTELLIGENCE POLICY)");

const policySrc = path.join(PKG_ROOT, "policy", "CEZERI-POLICY.md");
const policyBody = readIfExists(policySrc);

if (policyBody === null) {
  fail("policy/CEZERI-POLICY.md bulunamadi");
  summary.errors.push("policy kaynagi eksik");
} else {
  const block = buildPolicyBlock(policyBody, VERSION);
  const existing = readIfExists(GLOBAL_MEMORY);
  const { content, action } = upsertPolicy(existing, block);

  if (action === "unchanged") {
    skip("~/.claude/CLAUDE.md (blok guncel)");
    summary.policy = "unchanged";
  } else {
    if (!DRY) {
      if (existing !== null) backupFile(GLOBAL_MEMORY, STAMP);
      atomicWrite(GLOBAL_MEMORY, content);
    }
    const label = {
      created: "dosya olusturuldu",
      appended: "blok eklendi (mevcut icerik korundu)",
      updated: "blok guncellendi (blok disi icerik korundu)",
    }[action];
    ok(`~/.claude/CLAUDE.md — ${label}`);
    summary.policy = action;
    summary.changed++;
  }
}

// ─────────────────────────────────────────────────────── 4. PLAYWRIGHT MCP
step("4) Playwright MCP");

let mcpAddedByUs = readManifest()?.mcp?.added_by_cezeri === true;

if (NO_MCP) {
  skip("--no-mcp verildi");
  summary.mcp = "skipped";
} else if (mcpStatus().registered) {
  skip(`"${MCP_NAME}" zaten kayitli — dokunulmadi (duplicate olusturulmadi)`);
  summary.mcp = "already-present";
} else if (DRY) {
  info(claudeAvailable
    ? `eklenecek: claude mcp add -s user ${MCP_NAME} -- npx -y ${MCP_PACKAGE}`
    : `eklenecek: ~/.claude.json -> mcpServers.${MCP_NAME} (claude CLI yok)`);
  summary.mcp = "would-add";
} else if (claudeAvailable) {
  const r = run("claude", ["mcp", "add", "-s", "user", MCP_NAME, "--", "npx", "-y", MCP_PACKAGE], {
    timeout: 180_000,
  });
  if (r.ok || mcpStatus().registered) {
    ok(`"${MCP_NAME}" user scope'a eklendi`);
    summary.mcp = "added";
    mcpAddedByUs = true;
    summary.changed++;
  } else {
    fail(`MCP eklenemedi: ${(r.stderr || r.stdout || "").trim().split("\n")[0]}`);
    info(`Elle deneyin: claude mcp add -s user ${MCP_NAME} -- npx -y ${MCP_PACKAGE}`);
    summary.mcp = "failed";
    summary.errors.push("mcp add basarisiz");
  }
} else {
  // claude CLI yok — kaydi dogrudan yapilandirma dosyasina yaz (ayni sonuc, user scope).
  const r = addMcpToConfig(STAMP);
  if (r.ok && r.action === "added") {
    ok(`"${MCP_NAME}" ~/.claude.json icine eklendi (claude CLI olmadan)`);
    summary.mcp = "added-via-config";
    mcpAddedByUs = true;
    summary.changed++;
  } else if (r.ok) {
    skip(`"${MCP_NAME}" zaten kayitli`);
    summary.mcp = "already-present";
  } else {
    fail(`MCP kaydi yazilamadi: ${r.detail}`);
    info(`Claude Code CLI kurup tekrar deneyin: npm install -g @anthropic-ai/claude-code`);
    summary.mcp = "failed";
    summary.errors.push("mcp config yazilamadi");
  }
}

// ─────────────────────────────────────────────────────── 5. MANIFEST
step("5) Manifest");

if (DRY) {
  skip("dry-run — manifest yazilmadi");
} else {
  writeManifest({
    name: "cezeri-web-intelligence",
    version: VERSION,
    installed_at: new Date().toISOString(),
    package_root: PKG_ROOT,
    skills: installedSkills,
    policy_file: GLOBAL_MEMORY,
    mcp: { name: MCP_NAME, package: MCP_PACKAGE, added_by_cezeri: mcpAddedByUs },
    backup_dir: path.join(BACKUP_ROOT, `cezeri-${STAMP}`),
  });
  atomicWrite(path.join(STATE_DIR, "VERSION"), VERSION + "\n");
  ok(`${path.join(STATE_DIR, "installed.json")}`);
}

// ─────────────────────────────────────────────────────── 6. DOĞRULAMA
step("6) Dogrulama");

let verifyFailed = 0;
// Dry-run'da diske yazilmadigi icin kaynak dosyalar dogrulanir.
const toVerify = DRY
  ? SKILL_NAMES.map((name) => ({ name, path: path.join(PKG_ROOT, "skills", name, "SKILL.md") }))
  : installedSkills;

for (const s of toVerify) {
  const raw = readIfExists(s.path);
  if (raw === null) {
    fail(`${s.name}: dosya yok`);
    verifyFailed++;
    continue;
  }
  const { valid, errors } = validateSkillFrontmatter(raw);
  if (!valid) {
    fail(`${s.name}: ${errors.join("; ")}`);
    verifyFailed++;
  }
}
if (verifyFailed === 0) {
  ok(`${toVerify.length} skill dosyasi dogrulandi${DRY ? " (kaynak)" : ""}`);
}

if (!DRY) {
  const mem = readIfExists(GLOBAL_MEMORY);
  if (mem && mem.includes("CEZERI WEB INTELLIGENCE POLICY")) ok("Global policy blogu yerinde");
  else if (policyBody !== null) { fail("Global policy blogu bulunamadi"); verifyFailed++; }
}

if (!NO_MCP && !DRY) {
  if (claudeAvailable) {
    const g = run("claude", ["mcp", "get", MCP_NAME], { timeout: 90_000 });
    if (g.ok) ok(`MCP kaydi okunabiliyor: ${MCP_NAME}`);
    else warn("MCP kaydi dogrulanamadi (Claude Code yeniden baslatilinca baglanir)");
  } else if (mcpInConfig()) {
    ok(`MCP kaydi ~/.claude.json icinde dogrulandi: ${MCP_NAME}`);
  }
}

// ─────────────────────────────────────────────────────── ÖZET
console.log(bold("\n" + "-".repeat(60)));
console.log(bold("OZET"));
console.log(`  Skill'ler   : ${summary.skills.map((s) => `${s.name}=${s.action}`).join(", ") || "-"}`);
console.log(`  Policy      : ${summary.policy ?? "-"}`);
console.log(`  MCP         : ${summary.mcp ?? "-"}`);
console.log(`  Degisiklik  : ${summary.changed}`);
if (summary.errors.length) console.log(`  Hatalar     : ${summary.errors.join("; ")}`);
console.log(bold("-".repeat(60)));

if (summary.errors.length || verifyFailed) {
  console.log(`\n${bold("Kurulum eksik tamamlandi.")} Yukaridaki hatalari giderip tekrar calistirin.\n`);
  process.exit(1);
}

if (DRY) {
  console.log("\nDry-run bitti. Gercek kurulum icin: node install.mjs\n");
} else {
  console.log(`
${bold("Kurulum tamam.")}

  Siradaki tek adim: ${cyan("Claude Code'u yeniden baslatin")} (yeni MCP sunucusu ancak
  yeniden baslatildiginda baglanir).

  Sonra:
    - Saglik kontrolu : node healthcheck.mjs
    - Smoke testler   : SMOKE-TESTS.md
    - Kaldirma        : node uninstall.mjs
`);
}
