#!/usr/bin/env node
/**
 * CEZERI Web Intelligence — kaldirma
 *
 * Manifest'i okur ve yalnizca CEZERI'nin kurdugu seyleri geri alir:
 *   - cezeri-* skill klasorleri
 *   - ~/.claude/CLAUDE.md icindeki marker'li policy blogu (blok disi icerige DOKUNMAZ)
 *   - Playwright MCP kaydi (yalnizca CEZERI ekledi ise)
 *
 * Kullanim:
 *   node uninstall.mjs             kaldir
 *   node uninstall.mjs --dry-run   ne silinecegini goster
 *   node uninstall.mjs --keep-mcp  MCP kaydini birak
 */

import fs from "node:fs";
import path from "node:path";
import {
  CLAUDE_HOME, SKILLS_DIR, GLOBAL_MEMORY, STATE_DIR, MCP_NAME, SKILL_NAMES,
  bold, dim, cyan, step, ok, skip, warn, fail, info,
  readIfExists, atomicWrite, backupFile, timestamp,
  run, hasCommand, readManifest, removePolicy, mcpStatus,
} from "./lib/common.mjs";

const DRY = process.argv.includes("--dry-run");
const KEEP_MCP = process.argv.includes("--keep-mcp");
const STAMP = timestamp();

console.log(bold("\nCEZERI Web Intelligence — kaldirma"));
console.log(dim(`Hedef: ${CLAUDE_HOME}`));
if (DRY) console.log(cyan("DRY-RUN: hicbir sey silinmeyecek"));

const manifest = readManifest();
if (!manifest) {
  warn("installed.json bulunamadi — bilinen skill adlariyla devam ediliyor.");
}

let removed = 0;
const errors = [];

// ─────────────────────────────────────────────────────── 1. SKILL'LER
step("1) Skill'ler");

const skillNames = manifest?.skills?.map((s) => s.name) ?? SKILL_NAMES;
for (const name of skillNames) {
  const dir = path.join(SKILLS_DIR, name);
  if (!fs.existsSync(dir)) {
    skip(`${name} (zaten yok)`);
    continue;
  }
  if (DRY) {
    info(`${name} silinecek`);
    continue;
  }
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    fail(`${name}: ${e.message}`);
    errors.push(name);
    continue;
  }
  ok(`${name} silindi`);
  removed++;
}

// ─────────────────────────────────────────────────────── 2. POLICY BLOĞU
step("2) Global policy blogu");

const existing = readIfExists(GLOBAL_MEMORY);
if (existing === null) {
  skip("~/.claude/CLAUDE.md yok");
} else {
  const { content, removed: didRemove } = removePolicy(existing);
  if (!didRemove) {
    skip("CEZERI blogu bulunamadi — dosyaya dokunulmadi");
  } else if (DRY) {
    info("CEZERI blogu silinecek, blok disi icerik korunacak");
  } else {
    backupFile(GLOBAL_MEMORY, STAMP);
    if (content.trim() === "") {
      // Dosyada baska icerik kalmadiysa dosyayi da kaldir (yedegi alindi).
      fs.rmSync(GLOBAL_MEMORY, { force: true });
      ok("~/.claude/CLAUDE.md kaldirildi (icinde baska icerik yoktu, yedeklendi)");
    } else {
      atomicWrite(GLOBAL_MEMORY, content);
      ok("CEZERI blogu silindi, diger icerik korundu");
    }
    removed++;
  }
}

// ─────────────────────────────────────────────────────── 3. MCP
step("3) Playwright MCP");

const addedByUs = manifest?.mcp?.added_by_cezeri === true;
if (KEEP_MCP) {
  skip("--keep-mcp verildi");
} else if (!addedByUs) {
  skip("MCP kaydini CEZERI eklemedi — dokunulmadi");
} else if (!hasCommand("claude")) {
  warn("claude CLI yok — MCP kaydi kaldirilamadi");
} else if (!mcpStatus().registered) {
  skip("kayit zaten yok");
} else if (DRY) {
  info(`kaldirilacak: claude mcp remove -s user ${MCP_NAME}`);
} else {
  const r = run("claude", ["mcp", "remove", "-s", "user", MCP_NAME], { timeout: 90_000 });
  if (r.ok || !mcpStatus().registered) {
    ok(`"${MCP_NAME}" kaydi kaldirildi`);
    removed++;
  } else {
    fail(`kaldirilamadi: ${(r.stderr || r.stdout || "").trim().split("\n")[0]}`);
    info(`Elle: claude mcp remove -s user ${MCP_NAME}`);
    errors.push("mcp remove");
  }
}

// ─────────────────────────────────────────────────────── 4. DURUM KLASÖRÜ
step("4) Durum klasoru");

if (!fs.existsSync(STATE_DIR)) {
  skip("zaten yok");
} else if (DRY) {
  info(`${STATE_DIR} silinecek`);
} else {
  fs.rmSync(STATE_DIR, { recursive: true, force: true });
  ok(`${STATE_DIR} silindi`);
  removed++;
}

// ─────────────────────────────────────────────────────── ÖZET
console.log(bold("\n" + "-".repeat(60)));
console.log(`  Geri alinan adim sayisi: ${removed}`);
if (errors.length) console.log(`  Hatalar: ${errors.join(", ")}`);
console.log(dim(`  Yedekler: ${path.join(CLAUDE_HOME, "backups")}`));
console.log(bold("-".repeat(60)));

if (DRY) console.log("\nDry-run bitti. Gercek kaldirma icin: node uninstall.mjs\n");
else console.log("\nKaldirma tamam. Claude Code'u yeniden baslatin.\n");

process.exit(errors.length ? 1 : 0);
