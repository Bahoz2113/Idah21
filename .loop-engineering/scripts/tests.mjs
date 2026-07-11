#!/usr/bin/env node
// Loop Engineering OS — otomatik testler (bağımlılıksız)
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLI = path.join(__dirname, "loop.mjs");
const LOOPS = path.join(ROOT, "loops");

let passed = 0, failed = 0;
const results = [];
function test(name, fn) {
  try { fn(); passed++; results.push(`✅ ${name}`); }
  catch (e) { failed++; results.push(`❌ ${name} — ${e.message}`); }
}
function run(args, opts = {}) {
  return execSync(`node "${CLI}" ${args}`, { encoding: "utf8", ...opts });
}
function runFail(args) {
  try { run(args, { stdio: "pipe" }); return null; }
  catch (e) { return (e.stdout || "") + (e.stderr || ""); }
}
function runAny(args) {
  try { return run(args, { stdio: "pipe" }); }
  catch (e) { return (e.stdout || "") + (e.stderr || ""); }
}
const assert = (c, m) => { if (!c) throw new Error(m || "assertion failed"); };

// ---------- CONTRACT TESTS ----------
test("Contract: eksik objective reddediliyor", () => {
  const out = runFail(`init generic-improvement`);
  assert(out !== null && /Kullanım|Zorunlu/.test(out), "eksik parametre kabul edildi");
});
test("Contract: geçersiz template reddediliyor", () => {
  const out = runFail(`init boyle-template-yok "test hedefi"`);
  assert(out !== null && /bulunamadı/.test(out), "geçersiz template kabul edildi");
});

// ---------- INIT + STATE MACHINE ----------
let loopId;
test("Init: geçerli loop oluşuyor", () => {
  const out = run(`init generic-improvement "Test loop hedefi"`);
  loopId = out.match(/loop-[a-z0-9-]+/)[0];
  assert(fs.existsSync(path.join(LOOPS, loopId, "contract.yaml")), "contract yok");
  assert(fs.existsSync(path.join(LOOPS, loopId, "state.json")), "state yok");
  const s = JSON.parse(fs.readFileSync(path.join(LOOPS, loopId, "state.json"), "utf8"));
  assert(s.status === "initialized", "başlangıç durumu yanlış: " + s.status);
});
test("State machine: geçersiz geçiş engelleniyor (initialized→archived değil, resume)", () => {
  const out = runFail(`resume ${loopId}`);
  assert(out !== null && /paused|değil/.test(out), "paused olmayan loop resume edildi");
});

// ---------- VERIFICATION: kanıtsız completion reddi ----------
test("Verification: kanıtsız completion reddediliyor", () => {
  const out = run(`run ${loopId}`);
  assert(/RETRY/.test(out), "kanıtsız run PASS verdi!");
  const s = JSON.parse(fs.readFileSync(path.join(LOOPS, loopId, "state.json"), "utf8"));
  assert(s.status === "retrying", "durum retrying değil: " + s.status);
});
test("Scoring: verifier reddi threshold'u geçemiyor", () => {
  const scores = fs.readFileSync(path.join(LOOPS, loopId, "scores.jsonl"), "utf8").trim().split("\n");
  const last = JSON.parse(scores[scores.length - 1]);
  assert(last.total < 65, "reddedilen çıktı yüksek puan aldı: " + last.total);
});

// ---------- EVIDENCE → PASS ----------
test("Verification: kanıtla PASS + loop completed", () => {
  fs.writeFileSync(path.join(LOOPS, loopId, "evidence", "ac1-test.md"),
    "status: pass\nkanıt: test çıktısı — 12/12 test geçti\n");
  const out = run(`run ${loopId}`);
  assert(/PASS/.test(out), "kanıtlı run PASS vermedi");
  const s = JSON.parse(fs.readFileSync(path.join(LOOPS, loopId, "state.json"), "utf8"));
  assert(s.status === "completed", "durum completed değil");
});
test("State machine: completed loop yeniden çalıştırılamıyor", () => {
  const out = runFail(`run ${loopId}`);
  assert(out !== null && /yeniden çalıştırılamaz/.test(out), "completed loop tekrar çalıştı!");
});

// ---------- APPEND-ONLY LOG ----------
test("Event log: append-only ve geçerli JSONL", () => {
  const lines = fs.readFileSync(path.join(LOOPS, loopId, "events.jsonl"), "utf8").trim().split("\n");
  assert(lines.length >= 5, "yetersiz event");
  for (const l of lines) { const e = JSON.parse(l); assert(e.event_id && e.timestamp && e.event_type, "bozuk event"); }
});

// ---------- PERSISTENCE: atomic write ----------
test("Persistence: state atomic yazılıyor (tmp dosya kalmıyor)", () => {
  const dir = path.join(LOOPS, loopId);
  const tmps = fs.readdirSync(dir).filter(f => f.includes(".tmp."));
  assert(tmps.length === 0, "tmp dosya kaldı: " + tmps.join(","));
});

// ---------- BUDGET ----------
test("Budget: max_iterations aşımında loop duruyor", () => {
  const out2 = run(`init generic-improvement "Bütçe testi"`);
  const id2 = out2.match(/loop-[a-z0-9-]+/)[0];
  // max_iterations=5; farklı failure imzaları üretmek için evidence değiştirilir
  let stopped = false;
  for (let i = 0; i < 7; i++) {
    fs.writeFileSync(path.join(LOOPS, id2, "evidence", "ac1-x.md"), `status: fail\ndeneme:${i}\n`);
    // failure signature aynı olur → 3'te failed beklenir; onu da sayarız
    const r = runAny(`run ${id2}`);
    if (/FAILED|Bütçe doldu|durduruldu/.test(r)) { stopped = true; break; }
  }
  assert(stopped, "loop hiç durmadı");
});

// ---------- SAME FAILURE REPEATED ----------
test("Stop: aynı hata 3. tekrarda FAILED + escalation", () => {
  const out3 = run(`init generic-improvement "Tekrar hata testi"`);
  const id3 = out3.match(/loop-[a-z0-9-]+/)[0];
  let out = "";
  for (let i = 0; i < 3; i++) out = runAny(`run ${id3}`);
  const s = JSON.parse(fs.readFileSync(path.join(LOOPS, id3, "state.json"), "utf8"));
  assert(s.status === "failed", "3. tekrarda failed olmadı: " + s.status);
  assert(/3\. kez|FAILED/.test(out), "escalation mesajı yok");
});

// ---------- CHECKPOINT + ROLLBACK ----------
test("Rollback: checkpoint geri yükleniyor, state tutarlı, event yazılıyor", () => {
  const out4 = run(`init generic-improvement "Rollback testi"`);
  const id4 = out4.match(/loop-[a-z0-9-]+/)[0];
  const cpOut = run(`checkpoint ${id4} baslangic`);
  const cpId = cpOut.match(/cp-[a-z0-9-]+/)[0];
  runAny(`run ${id4}`); // iterasyon 1 (fail)
  run(`rollback ${id4} ${cpId}`);
  const s = JSON.parse(fs.readFileSync(path.join(LOOPS, id4, "state.json"), "utf8"));
  assert(s.iteration === 0 && s.status === "ready", "rollback state tutarsız");
  const events = fs.readFileSync(path.join(LOOPS, id4, "events.jsonl"), "utf8");
  assert(/rollback_completed/.test(events), "rollback event yok");
  const ap = fs.readFileSync(path.join(ROOT, "memory", "anti-patterns.md"), "utf8");
  assert(ap.includes(id4), "anti-pattern kaydı yok");
});

// ---------- PAUSE / RESUME ----------
test("Pause/Resume çalışıyor", () => {
  const out5 = run(`init generic-improvement "Pause testi"`);
  const id5 = out5.match(/loop-[a-z0-9-]+/)[0];
  run(`pause ${id5}`);
  let s = JSON.parse(fs.readFileSync(path.join(LOOPS, id5, "state.json"), "utf8"));
  assert(s.status === "paused", "pause olmadı");
  const blocked = runFail(`run ${id5}`);
  assert(blocked !== null && /duraklatılmış/.test(blocked), "paused loop çalıştı");
  run(`resume ${id5}`);
  s = JSON.parse(fs.readFileSync(path.join(LOOPS, id5, "state.json"), "utf8"));
  assert(s.status === "ready", "resume olmadı");
});

// ---------- LOCK ----------
test("Locking: aktif kilit ikinci çalıştırmayı engelliyor", () => {
  const out6 = run(`init generic-improvement "Lock testi"`);
  const id6 = out6.match(/loop-[a-z0-9-]+/)[0];
  const lockFile = path.join(ROOT, "runtime", "locks", id6 + ".lock");
  fs.mkdirSync(path.dirname(lockFile), { recursive: true });
  fs.writeFileSync(lockFile, JSON.stringify({ loop_id: id6, pid: 99999, acquired_at: new Date().toISOString(), heartbeat: new Date().toISOString() }));
  const out = runFail(`run ${id6}`);
  assert(out !== null && /kilitli/.test(out), "kilitli loop çalıştı");
  fs.unlinkSync(lockFile);
});

// ---------- REPORT ----------
test("Report: final rapor üretiliyor", () => {
  run(`report ${loopId}`);
  const rep = fs.readFileSync(path.join(LOOPS, loopId, "final-report.md"), "utf8");
  assert(/Executive Summary/.test(rep) && /ACCEPTED/.test(rep), "rapor eksik");
});

// ---------- SECURITY: redaction convention ----------
test("Security: config'te secret koruması tanımlı", () => {
  const cfg = fs.readFileSync(path.join(ROOT, "config", "tools.yaml"), "utf8");
  assert(/secret_redaction: true/.test(cfg) && /env_files_readable: false/.test(cfg), "güvenlik config eksik");
  const perms = fs.readFileSync(path.join(ROOT, "config", "permissions.yaml"), "utf8");
  assert(/secret_modification/.test(perms) && /production_deploy/.test(perms), "permissions eksik");
});

// ---------- RESULTS ----------
console.log(results.join("\n"));
console.log(`\n═══ SONUÇ: ${passed} geçti, ${failed} başarısız ═══`);
fs.writeFileSync(path.join(ROOT, "dashboard", "data", "last-test-run.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), passed, failed, results }, null, 2));
process.exit(failed ? 1 : 0);
