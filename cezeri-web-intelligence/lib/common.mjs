/**
 * CEZERI Web Intelligence — ortak yardımcılar
 * Bağımlılık yok. Node >= 18. Windows / macOS / Linux.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CLAUDE_HOME = path.join(os.homedir(), ".claude");
export const SKILLS_DIR = path.join(CLAUDE_HOME, "skills");
export const GLOBAL_MEMORY = path.join(CLAUDE_HOME, "CLAUDE.md");
export const STATE_DIR = path.join(CLAUDE_HOME, "cezeri-web-intelligence");
export const MANIFEST = path.join(STATE_DIR, "installed.json");
export const BACKUP_ROOT = path.join(CLAUDE_HOME, "backups");

export const MCP_NAME = "playwright";
export const MCP_PACKAGE = "@playwright/mcp@latest";

export const POLICY_BEGIN = "<!-- CEZERI-WEB-INTELLIGENCE:BEGIN -->";
export const POLICY_END = "<!-- CEZERI-WEB-INTELLIGENCE:END -->";

export const SKILL_NAMES = [
  "cezeri-orchestrator",
  "cezeri-web-research",
  "cezeri-browser-agent",
  "cezeri-article-reader",
  "cezeri-documentation-reader",
  "cezeri-web-extractor",
  "cezeri-source-verifier",
  "cezeri-deep-research",
];

// ---------------------------------------------------------------- çıktı
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (useColor ? `\u001b[${code}m${s}\u001b[0m` : s);
export const bold = (s) => c("1", s);
export const dim = (s) => c("2", s);
export const green = (s) => c("32", s);
export const yellow = (s) => c("33", s);
export const red = (s) => c("31", s);
export const cyan = (s) => c("36", s);

export function step(title) {
  console.log("\n" + bold(title));
}
export function ok(msg) {
  console.log("  " + green("[OK]") + " " + msg);
}
export function skip(msg) {
  console.log("  " + dim("[ATLA]") + " " + dim(msg));
}
export function warn(msg) {
  console.log("  " + yellow("[UYARI]") + " " + msg);
}
export function fail(msg) {
  console.log("  " + red("[HATA]") + " " + msg);
}
export function info(msg) {
  console.log("  " + cyan("[BILGI]") + " " + msg);
}

// ---------------------------------------------------------------- dosya
export const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

export function readIfExists(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

/** Atomik yazma: aynı dizine geçici dosya, sonra rename. */
export function atomicWrite(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp.${process.pid}`;
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
}

/** Değiştirilecek dosyayı zaman damgalı yedek klasörüne kopyalar. */
export function backupFile(file, stamp) {
  if (!fs.existsSync(file)) return null;
  const dir = path.join(BACKUP_ROOT, `cezeri-${stamp}`);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, path.basename(file));
  fs.copyFileSync(file, dest);
  return dest;
}

export function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

// ---------------------------------------------------------------- komut
/**
 * Komutu çalıştırır; hata fırlatmaz.
 * @returns {{ok: boolean, stdout: string, stderr: string, code: number|null}}
 */
export function run(cmd, args = [], opts = {}) {
  try {
    const stdout = execFileSync(cmd, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: opts.timeout ?? 60_000,
      shell: process.platform === "win32", // .cmd/.ps1 sarmalayıcıları için
      ...opts,
    });
    return { ok: true, stdout: stdout || "", stderr: "", code: 0 };
  } catch (e) {
    return {
      ok: false,
      stdout: e.stdout ? String(e.stdout) : "",
      stderr: e.stderr ? String(e.stderr) : String(e.message || ""),
      code: typeof e.status === "number" ? e.status : null,
    };
  }
}

export function hasCommand(cmd) {
  const probe = process.platform === "win32" ? "where" : "which";
  return run(probe, [cmd], { timeout: 15_000 }).ok;
}

// ---------------------------------------------------------------- skill dogrulama
/**
 * SKILL.md frontmatter'ini dogrular. Tam bir YAML parser degil; Claude Code'un
 * skill kesfini bozan pratik hatalari yakalar:
 *   - frontmatter blogu yok
 *   - description alani yok/bos
 *   - bir deger tirnakla BASLIYOR ama ayni tirnakla BITMIYOR
 *     (YAML bunu quoted-scalar sanip tum frontmatter'i gecersiz kilar)
 *   - anahtar satiri "key: value" bicimine uymuyor
 *
 * @returns {{valid: boolean, errors: string[], fields: Record<string,string>}}
 */
export function validateSkillFrontmatter(raw) {
  const errors = [];
  const fields = {};
  if (typeof raw !== "string") return { valid: false, errors: ["dosya okunamadi"], fields };

  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { valid: false, errors: ["frontmatter blogu yok (--- ile baslamali)"], fields };

  for (const line of m[1].split(/\r?\n/)) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue;
    if (/^\s/.test(line)) continue; // devam / liste satiri
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) {
      errors.push(`gecersiz satir: ${line.slice(0, 60)}`);
      continue;
    }
    const [, key, value] = kv;
    const q = value[0];
    if ((q === '"' || q === "'") && !(value.length > 1 && value.endsWith(q))) {
      errors.push(`"${key}" degeri ${q} ile basliyor ama ayni karakterle bitmiyor — YAML bunu gecersiz sayar`);
    }
    fields[key] = value;
  }

  if (!fields.description || fields.description.trim() === "") {
    errors.push("description alani zorunlu");
  }
  return { valid: errors.length === 0, errors, fields };
}

// ---------------------------------------------------------------- manifest
export function readManifest() {
  const raw = readIfExists(MANIFEST);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeManifest(obj) {
  atomicWrite(MANIFEST, JSON.stringify(obj, null, 2) + "\n");
}

export function packageVersion() {
  return (readIfExists(path.join(PKG_ROOT, "VERSION")) || "0.0.0").trim();
}

// ---------------------------------------------------------------- policy
/**
 * Marker'lı policy bloğunu üretir. Sürüm blok içine yazılır ki
 * marker'lar sürümden bağımsız kalsın (eski blok her zaman bulunabilsin).
 */
export function buildPolicyBlock(policyBody, version) {
  return [
    POLICY_BEGIN,
    `<!-- surum: ${version} — bu blok CEZERI kurulumu tarafindan yonetilir, elle duzenleme -->`,
    "",
    policyBody.trim(),
    "",
    POLICY_END,
  ].join("\n");
}

/**
 * Mevcut içeriğe policy bloğunu ekler veya günceller.
 * Blok dışındaki hiçbir satıra dokunmaz.
 * @returns {{content: string, action: "created"|"appended"|"updated"|"unchanged"}}
 */
export function upsertPolicy(existing, block) {
  if (existing === null || existing === "") {
    return { content: block + "\n", action: "created" };
  }
  const start = existing.indexOf(POLICY_BEGIN);
  const end = existing.indexOf(POLICY_END);
  if (start !== -1 && end !== -1 && end > start) {
    const current = existing.slice(start, end + POLICY_END.length);
    if (current === block) return { content: existing, action: "unchanged" };
    const content = existing.slice(0, start) + block + existing.slice(end + POLICY_END.length);
    return { content, action: "updated" };
  }
  const sep = existing.endsWith("\n") ? "\n" : "\n\n";
  return { content: existing + sep + block + "\n", action: "appended" };
}

/**
 * Policy bloğunu içerikten çıkarır (uninstall).
 * @returns {{content: string, removed: boolean}}
 */
export function removePolicy(existing) {
  if (!existing) return { content: existing ?? "", removed: false };
  const start = existing.indexOf(POLICY_BEGIN);
  const end = existing.indexOf(POLICY_END);
  if (start === -1 || end === -1 || end < start) return { content: existing, removed: false };
  const before = existing.slice(0, start).replace(/\n+$/, "\n");
  const after = existing.slice(end + POLICY_END.length).replace(/^\n+/, "");
  return { content: (before + after).replace(/\n{3,}/g, "\n\n"), removed: true };
}

// ---------------------------------------------------------------- MCP
/**
 * Playwright MCP kayıtlı mı? `claude mcp list` çıktısında ada göre arar.
 * claude CLI yoksa {available:false} döner.
 */
export function mcpStatus() {
  if (!hasCommand("claude")) return { available: false, registered: false, raw: "" };
  const r = run("claude", ["mcp", "list"], { timeout: 90_000 });
  const raw = (r.stdout || "") + (r.stderr || "");
  const registered = new RegExp(`(^|\\s)${MCP_NAME}\\b`, "m").test(raw);
  return { available: true, registered, raw };
}
