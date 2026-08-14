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
const IS_WIN = process.platform === "win32";
const resolvedCache = new Map();

/**
 * Windows'ta bir komutun gercek yolunu bulur (`where`).
 * `npx` gibi komutlar orada `npx.cmd` batch dosyasidir; bunlar shell olmadan
 * dogrudan calistirilamaz, `cmd.exe /c` ile cagrilmalari gerekir.
 * @returns {string|null}
 */
function resolveWindowsCommand(cmd) {
  if (resolvedCache.has(cmd)) return resolvedCache.get(cmd);
  let found = null;
  try {
    const out = execFileSync("where", [cmd], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 15_000,
    });
    const lines = String(out).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    // .cmd/.bat/.exe tercih et; yoksa ilk sonucu al.
    found = lines.find((l) => /\.(cmd|bat|exe)$/i.test(l)) ?? lines[0] ?? null;
  } catch {
    found = null;
  }
  resolvedCache.set(cmd, found);
  return found;
}

/**
 * Komutu çalıştırır; hata fırlatmaz.
 *
 * `shell: true` KULLANMAZ. Node 24 bunu args dizisiyle birlikte kullanmayı
 * DEP0190 ile uyarıyor (argümanlar escape edilmez, yalnızca birleştirilir —
 * enjeksiyon riski). Windows'ta batch sarmalayıcıları bunun yerine
 * `cmd.exe /c <tam-yol> <args>` ile çağrılır; argümanlar ayrı dizi
 * elemanları olarak geçtiği için birleştirme yapılmaz.
 *
 * @returns {{ok: boolean, stdout: string, stderr: string, code: number|null}}
 */
export function run(cmd, args = [], opts = {}) {
  const { timeout, ...rest } = opts;
  let file = cmd;
  let argv = args;

  if (IS_WIN) {
    const resolved = resolveWindowsCommand(cmd);
    if (resolved && /\.(cmd|bat)$/i.test(resolved)) {
      file = process.env.ComSpec || "cmd.exe";
      argv = ["/d", "/s", "/c", resolved, ...args];
    } else if (resolved) {
      file = resolved;
    }
  }

  try {
    const stdout = execFileSync(file, argv, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: timeout ?? 60_000,
      windowsHide: true,
      ...rest,
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
  if (IS_WIN) return resolveWindowsCommand(cmd) !== null;
  return run("which", [cmd], { timeout: 15_000 }).ok;
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
  if (!hasCommand("claude")) {
    // claude CLI yoksa yapilandirma dosyasindan bak.
    return { available: false, registered: mcpInConfig(), raw: "" };
  }
  const r = run("claude", ["mcp", "list"], { timeout: 90_000 });
  const raw = (r.stdout || "") + (r.stderr || "");
  const registered = new RegExp(`(^|\\s)${MCP_NAME}\\b`, "m").test(raw);
  return { available: true, registered, raw };
}

/** Kullanici duzeyindeki Claude yapilandirma dosyasi (~/.claude.json). */
export const CLAUDE_CONFIG = path.join(os.homedir(), ".claude.json");

/** MCP kaydi yapilandirma dosyasinda var mi? */
export function mcpInConfig() {
  const raw = readIfExists(CLAUDE_CONFIG);
  if (!raw) return false;
  try {
    return Boolean(JSON.parse(raw)?.mcpServers?.[MCP_NAME]);
  } catch {
    return false;
  }
}

/**
 * claude CLI yokken MCP kaydini dogrudan ~/.claude.json icine yazar.
 * `claude mcp add -s user` ile ayni sonucu uretir (user scope).
 * Dosyanin geri kalanina DOKUNMAZ; yalnizca mcpServers.<MCP_NAME> eklenir.
 *
 * @returns {{ok: boolean, action: "added"|"already-present"|"failed", detail?: string}}
 */
export function addMcpToConfig(stamp) {
  const raw = readIfExists(CLAUDE_CONFIG);
  let cfg = {};
  if (raw !== null) {
    try {
      cfg = JSON.parse(raw);
    } catch (e) {
      return { ok: false, action: "failed", detail: `~/.claude.json okunamadi (bozuk JSON): ${e.message}` };
    }
    if (cfg === null || typeof cfg !== "object" || Array.isArray(cfg)) {
      return { ok: false, action: "failed", detail: "~/.claude.json beklenen bicimde degil" };
    }
  }

  if (cfg.mcpServers && cfg.mcpServers[MCP_NAME]) {
    return { ok: true, action: "already-present" };
  }

  if (raw !== null) backupFile(CLAUDE_CONFIG, stamp);
  cfg.mcpServers = { ...(cfg.mcpServers ?? {}) };
  cfg.mcpServers[MCP_NAME] = {
    type: "stdio",
    command: "npx",
    args: ["-y", MCP_PACKAGE],
    env: {},
  };

  try {
    atomicWrite(CLAUDE_CONFIG, JSON.stringify(cfg, null, 2) + "\n");
  } catch (e) {
    return { ok: false, action: "failed", detail: e.message };
  }

  // VERIFY: geri okuyup kaydin gercekten yerinde oldugunu dogrula.
  return mcpInConfig()
    ? { ok: true, action: "added" }
    : { ok: false, action: "failed", detail: "yazildi ama dogrulanamadi" };
}

/** MCP kaydini ~/.claude.json icinden kaldirir (uninstall icin). */
export function removeMcpFromConfig(stamp) {
  const raw = readIfExists(CLAUDE_CONFIG);
  if (!raw) return { ok: true, action: "absent" };
  let cfg;
  try {
    cfg = JSON.parse(raw);
  } catch {
    return { ok: false, action: "failed", detail: "~/.claude.json okunamadi (bozuk JSON)" };
  }
  if (!cfg?.mcpServers?.[MCP_NAME]) return { ok: true, action: "absent" };

  backupFile(CLAUDE_CONFIG, stamp);
  delete cfg.mcpServers[MCP_NAME];
  try {
    atomicWrite(CLAUDE_CONFIG, JSON.stringify(cfg, null, 2) + "\n");
  } catch (e) {
    return { ok: false, action: "failed", detail: e.message };
  }
  return mcpInConfig() ? { ok: false, action: "failed", detail: "silindi ama hala gorunuyor" } : { ok: true, action: "removed" };
}
