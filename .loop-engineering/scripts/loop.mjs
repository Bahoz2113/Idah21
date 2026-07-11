#!/usr/bin/env node
/**
 * LOOP ENGINEERING OS — Core CLI
 * Sözleşmeli, durum bilgili, denetlenebilir loop çalışma sistemi.
 * Bağımlılık yok. Node >= 18. Termux / Windows / Linux uyumlu.
 *
 * Komutlar:
 *   loop init <template> "<objective>"   Yeni loop oluştur (contract + state)
 *   loop run <loop-id>                   Bir iterasyon çalıştır (execute→verify→score→gate)
 *   loop status [loop-id]                Durum göster
 *   loop list                            Tüm loop'ları listele
 *   loop pause <loop-id>                 Duraklat
 *   loop resume <loop-id>                Devam ettir
 *   loop verify <loop-id>                Verification'ı tek başına çalıştır
 *   loop score <loop-id>                 Skoru yeniden hesapla
 *   loop checkpoint <loop-id> [not]      Checkpoint oluştur
 *   loop rollback <loop-id> <cp-id>      Checkpoint'e geri dön
 *   loop report <loop-id>                Final rapor üret
 *   loop archive <loop-id>               Arşivle
 *   loop approve <loop-id> <approval-id> Bekleyen onayı onayla
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");          // .loop-engineering
const LOOPS = path.join(ROOT, "loops");
const RUNTIME = path.join(ROOT, "runtime");
const LOCKS = path.join(RUNTIME, "locks");
const MEMORY = path.join(ROOT, "memory");
const TEMPLATES = path.join(ROOT, "contracts", "templates");
const SCHEMAS = path.join(ROOT, "contracts", "schemas");

// ---------------------------------------------------------------- utils
const now = () => new Date().toISOString();
const uid = (p) => `${p}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);

function atomicWrite(file, data) {
  const tmp = file + ".tmp." + process.pid;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file); // atomic on POSIX & NTFS same-volume
}
const writeJSON = (f, o) => atomicWrite(f, JSON.stringify(o, null, 2) + "\n");
const readJSON = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

function appendEvent(loopId, ev) {
  const file = path.join(LOOPS, loopId, "events.jsonl");
  const record = {
    event_id: uid("evt"),
    timestamp: now(),
    loop_id: loopId,
    ...ev,
  };
  fs.appendFileSync(file, JSON.stringify(record) + "\n");
  return record;
}

function appendJSONL(loopId, name, obj) {
  fs.appendFileSync(path.join(LOOPS, loopId, name), JSON.stringify({ timestamp: now(), ...obj }) + "\n");
}

// -------------------------------------------------------- YAML (minimal)
// Sadece bu sistemin ürettiği düz key:value + listeler için yeterli parser.
function parseYAML(text) {
  const out = {};
  let currentKey = null;
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const listMatch = raw.match(/^\s+-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(out[currentKey])) out[currentKey] = [];
      out[currentKey].push(coerce(listMatch[1]));
      continue;
    }
    const kv = raw.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      out[currentKey] = kv[2] === "" ? [] : coerce(kv[2]);
    }
  }
  return out;
}
function coerce(v) {
  v = String(v).trim().replace(/^["']|["']$/g, "");
  if (v === "true") return true;
  if (v === "false") return false;
  if (v !== "" && !isNaN(Number(v))) return Number(v);
  return v;
}
function toYAML(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let s = "";
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      s += `${pad}${k}:\n`;
      for (const item of v) s += `${pad}  - ${item}\n`;
    } else if (v && typeof v === "object") {
      s += `${pad}${k}:\n` + toYAML(v, indent + 1);
    } else {
      s += `${pad}${k}: ${v}\n`;
    }
  }
  return s;
}

// -------------------------------------------------------- state machine
const STATES = [
  "draft","initialized","planning","ready","running","verifying","scoring",
  "criticizing","retrying","waiting_for_trigger","waiting_for_approval",
  "blocked","paused","rolling_back","failed","completed","archived",
];
const TRANSITIONS = {
  draft: ["initialized"],
  initialized: ["planning","paused","archived"],
  planning: ["ready","blocked","paused"],
  ready: ["running","paused","archived","waiting_for_trigger"],
  running: ["verifying","blocked","paused","failed","waiting_for_approval","rolling_back"],
  verifying: ["scoring","retrying","failed","blocked"],
  scoring: ["criticizing","completed","retrying","failed"],
  criticizing: ["retrying","completed","ready","failed","waiting_for_approval"],
  retrying: ["running","blocked","failed","paused"],
  waiting_for_trigger: ["running","paused","archived"],
  waiting_for_approval: ["running","ready","blocked","failed","archived"],
  blocked: ["ready","retrying","failed","archived","paused"],
  paused: ["ready","running","retrying","archived"],
  rolling_back: ["ready","failed","blocked"],
  failed: ["archived","retrying"],
  completed: ["archived"],
  archived: [],
};

function transition(loopId, state, to, reason = "") {
  const from = state.status;
  if (!STATES.includes(to)) throw new Error(`Geçersiz durum: ${to}`);
  if (!TRANSITIONS[from]?.includes(to))
    throw new Error(`Geçersiz durum geçişi: ${from} → ${to}`);
  state.status = to;
  state.updated_at = now();
  writeJSON(path.join(LOOPS, loopId, "state.json"), state);
  appendEvent(loopId, {
    iteration: state.iteration, phase: state.phase, agent: "loop-orchestrator",
    event_type: "state_transition", summary: `${from} → ${to}${reason ? " | " + reason : ""}`,
  });
  return state;
}

// -------------------------------------------------------- contract check
const REQUIRED_CONTRACT_FIELDS = [
  "loop_id","loop_name","version","objective","acceptance_criteria",
  "target_score","max_iterations","risk_level","stop_conditions",
];
function validateContract(c) {
  const errors = [];
  for (const f of REQUIRED_CONTRACT_FIELDS) {
    const v = c[f];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))
      errors.push(`Zorunlu alan eksik: ${f}`);
  }
  if (c.max_iterations !== undefined && (!Number.isInteger(c.max_iterations) || c.max_iterations < 1))
    errors.push("max_iterations pozitif tamsayı olmalı");
  if (c.target_score !== undefined && (c.target_score < 0 || c.target_score > 100))
    errors.push("target_score 0-100 aralığında olmalı");
  if (c.risk_level && !["low","medium","high","critical"].includes(String(c.risk_level)))
    errors.push("risk_level: low|medium|high|critical");
  return errors;
}

// -------------------------------------------------------- locking
function acquireLock(loopId) {
  fs.mkdirSync(LOCKS, { recursive: true });
  const lockFile = path.join(LOCKS, loopId + ".lock");
  if (fs.existsSync(lockFile)) {
    const lock = readJSON(lockFile);
    const ageMs = Date.now() - new Date(lock.heartbeat).getTime();
    if (ageMs < 5 * 60_000) throw new Error(`Loop kilitli (pid ${lock.pid}). Stale değil (${Math.round(ageMs/1000)}s).`);
    // stale lock recovery
    appendEvent(loopId, { event_type: "stale_lock_recovered", agent: "loop-orchestrator", summary: `Eski kilit temizlendi (pid ${lock.pid})` });
  }
  writeJSON(lockFile, { loop_id: loopId, pid: process.pid, acquired_at: now(), heartbeat: now() });
  return () => { try { fs.unlinkSync(lockFile); } catch {} };
}

// -------------------------------------------------------- commands
function cmdInit(templateName, objective, opts = {}) {
  if (!templateName || !objective) die("Kullanım: loop init <template> \"<objective>\"");
  const tplFile = path.join(TEMPLATES, templateName + ".yaml");
  if (!fs.existsSync(tplFile)) die(`Template bulunamadı: ${templateName}\nMevcut: ${fs.readdirSync(TEMPLATES).map(f=>f.replace(".yaml","")).join(", ")}`);
  const tpl = parseYAML(fs.readFileSync(tplFile, "utf8"));

  const loopId = uid("loop");
  const dir = path.join(LOOPS, loopId);
  for (const d of ["contract-history","checkpoints","artifacts","evidence","reports"])
    fs.mkdirSync(path.join(dir, d), { recursive: true });

  const contract = {
    loop_id: loopId,
    loop_name: opts.name || `${templateName}: ${objective.slice(0, 60)}`,
    version: 1,
    created_at: now(),
    created_by: opts.user || process.env.USER || "user",
    objective,
    business_goal: opts.business_goal || objective,
    template: templateName,
    in_scope: tpl.in_scope || ["repository içi değişiklikler"],
    out_of_scope: tpl.out_of_scope || ["production deployment","veri silme","secret değişikliği"],
    acceptance_criteria: opts.criteria || tpl.acceptance_criteria || ["Hedef doğrulanabilir kanıtla karşılandı"],
    verification_methods: tpl.verification_methods || ["file_check","test_run"],
    quality_threshold: tpl.quality_threshold ?? 70,
    baseline_score: 0,
    target_score: opts.target_score ?? tpl.target_score ?? 80,
    minimum_improvement: tpl.minimum_improvement ?? 5,
    max_iterations: opts.max_iterations ?? tpl.max_iterations ?? 5,
    max_retries_per_step: tpl.max_retries_per_step ?? 2,
    risk_level: tpl.risk_level || "low",
    required_approvals: tpl.required_approvals || [],
    rollback_policy: tpl.rollback_policy || "checkpoint-before-risky-change",
    stop_conditions: tpl.stop_conditions || [
      "target_score_reached","max_iterations_reached","budget_exhausted",
      "same_failure_repeated","user_cancelled",
    ],
    allowed_tools: tpl.allowed_tools || ["fs","tests","git"],
    forbidden_actions: tpl.forbidden_actions || [
      "production_deploy","data_deletion","secret_modification","force_push_main",
    ],
    data_classification: tpl.data_classification || "internal",
  };
  const errs = validateContract(contract);
  if (errs.length) die("Contract geçersiz:\n- " + errs.join("\n- "));

  atomicWrite(path.join(dir, "contract.yaml"), toYAML(contract));
  writeJSON(path.join(dir, "state.json"), {
    loop_id: loopId, status: "initialized", phase: "planning", iteration: 0,
    active_task: null, active_agent: null, last_successful_checkpoint: null,
    current_score: 0, baseline_score: 0, target_score: contract.target_score,
    retry_count: 0, failure_signatures: [], blocked_reason: null, pending_approval: null,
    started_at: now(), updated_at: now(), completed_at: null,
  });
  for (const f of ["events.jsonl","decisions.jsonl","scores.jsonl","failures.jsonl","approvals.jsonl"])
    fs.writeFileSync(path.join(dir, f), "");

  atomicWrite(path.join(dir, "plan.md"),
`# Plan — ${contract.loop_name}
## Objective
${objective}
## Tasks
- [ ] T1: Baseline ölç (owner: verifier)
- [ ] T2: Uygula (owner: implementer)
- [ ] T3: Doğrula (owner: verifier)
- [ ] T4: Puanla ve öğren (owner: scorer, memory-curator)
`);
  appendEvent(loopId, { iteration: 0, phase: "init", agent: "loop-orchestrator", event_type: "loop_created", summary: `Template: ${templateName}` });
  writeJSON(path.join(RUNTIME, "current-loop.json"), { loop_id: loopId, set_at: now() });
  console.log(`✅ Loop oluşturuldu: ${loopId}`);
  console.log(`   Contract: .loop-engineering/loops/${loopId}/contract.yaml`);
  console.log(`   Sonraki adım: node .loop-engineering/scripts/loop.mjs run ${loopId}`);
  return loopId;
}

// ---- verification: contract'taki her acceptance_criteria için evidence dosyası aranır
function runVerification(loopId, contract) {
  const dir = path.join(LOOPS, loopId);
  const evidenceDir = path.join(dir, "evidence");
  const results = [];
  const files = fs.existsSync(evidenceDir) ? fs.readdirSync(evidenceDir) : [];
  contract.acceptance_criteria.forEach((crit, i) => {
    const key = `ac${i + 1}`;
    const evFile = files.find(f => f.startsWith(key));
    let passed = false, evidence = null;
    if (evFile) {
      const content = fs.readFileSync(path.join(evidenceDir, evFile), "utf8");
      passed = /(^|\n)\s*(status|result)\s*:\s*(pass|passed|ok|true)/i.test(content);
      evidence = `evidence/${evFile}#sha:${sha(content)}`;
    }
    results.push({ criterion: crit, key, passed, evidence });
  });
  const allPassed = results.length > 0 && results.every(r => r.passed);
  appendEvent(loopId, {
    phase: "verification", agent: "verifier", event_type: "verification_completed",
    summary: `${results.filter(r=>r.passed).length}/${results.length} kriter geçti`,
    evidence: results.filter(r=>r.evidence).map(r=>r.evidence),
  });
  return { allPassed, results };
}

// ---- scoring: rubric ağırlıkları × verification sonucu; kanıtsız yüksek puan imkansız
const DEFAULT_RUBRIC = {
  goal_alignment: 20, functional_correctness: 20, verification_strength: 15,
  security: 10, reliability: 10, maintainability: 10,
  performance: 5, usability: 5, documentation: 5,
};
function runScoring(loopId, contract, verification) {
  const passRate = verification.results.length
    ? verification.results.filter(r => r.passed).length / verification.results.length : 0;
  const breakdown = {};
  let total = 0;
  for (const [cat, weight] of Object.entries(DEFAULT_RUBRIC)) {
    // Kanıta bağlı kategoriler pass rate ile ölçeklenir; verifier reddettiyse tavan düşer.
    const evidenceBound = ["goal_alignment","functional_correctness","verification_strength","reliability"].includes(cat);
    const factor = evidenceBound ? passRate : Math.min(passRate + 0.3, 1); // kanıtsız kısımda bile tavan var
    const pts = Math.round(weight * factor * 10) / 10;
    breakdown[cat] = { weight, points: pts, evidence_bound: evidenceBound };
    total += pts;
  }
  total = Math.round(total * 10) / 10;
  if (!verification.allPassed) total = Math.min(total, contract.quality_threshold - 1); // reddedilen çıktı eşiği geçemez
  appendJSONL(loopId, "scores.jsonl", { iteration: null, total, pass_rate: passRate, breakdown });
  appendEvent(loopId, { phase: "scoring", agent: "scorer", event_type: "score_computed", summary: `Score: ${total}`, score_after: total });
  return { total, breakdown, passRate };
}

function cmdRun(loopId) {
  const dir = mustLoop(loopId);
  const release = acquireLock(loopId);
  try {
    const contract = parseYAML(fs.readFileSync(path.join(dir, "contract.yaml"), "utf8"));
    let state = readJSON(path.join(dir, "state.json"));

    if (["completed","archived","failed"].includes(state.status))
      die(`Loop '${state.status}' durumunda; yeniden çalıştırılamaz. Gerekirse yeni loop aç.`);
    if (state.status === "paused") die("Loop duraklatılmış. Önce: loop resume " + loopId);
    if (state.status === "waiting_for_approval") die("Onay bekleniyor: " + state.pending_approval);

    // budget gate
    if (state.iteration >= contract.max_iterations) {
      state = transition(loopId, state, state.status === "running" ? "failed" : "blocked", "max_iterations_reached");
      appendJSONL(loopId, "failures.jsonl", { reason: "budget_exhausted", detail: "max_iterations" });
      die(`⛔ Bütçe doldu: max_iterations=${contract.max_iterations}. Loop durduruldu.`);
    }

    // ilerlet
    if (state.status === "initialized") state = transition(loopId, state, "planning");
    if (state.status === "planning") state = transition(loopId, state, "ready", "plan.md hazır");
    if (["ready","retrying","blocked"].includes(state.status)) {
      if (state.status === "blocked") state = transition(loopId, state, "retrying", "manuel yeniden deneme");
      state = transition(loopId, state, "running");
    }

    state.iteration += 1;
    state.phase = "execution";
    state.active_agent = "implementer";
    writeJSON(path.join(dir, "state.json"), state);
    appendEvent(loopId, { iteration: state.iteration, phase: "execution", agent: "implementer", event_type: "iteration_started", summary: `Iterasyon ${state.iteration}` });

    // EXECUTION: gerçek işi ajan (Claude Code) yapar; CLI kanıt bekler.
    // Demo/otomasyon için: artifacts/ içindeki dosyalar iş çıktısı sayılır.
    const artifacts = fs.readdirSync(path.join(dir, "artifacts"));
    appendEvent(loopId, { iteration: state.iteration, phase: "execution", agent: "implementer", event_type: "execution_observed", summary: `${artifacts.length} artifact mevcut`, outputs: artifacts });

    // VERIFY
    state = transition(loopId, state, "verifying");
    const verification = runVerification(loopId, contract);

    // SCORE
    state = transition(loopId, state, "scoring");
    const score = runScoring(loopId, contract, verification);
    state.current_score = score.total;
    if (state.iteration === 1 && state.baseline_score === 0) state.baseline_score = score.total;
    writeJSON(path.join(dir, "state.json"), state);

    // DECISION GATE
    const netImprovement = score.total - state.baseline_score;
    if (verification.allPassed && score.total >= contract.target_score) {
      state = transition(loopId, state, "completed", `target_score_reached (${score.total} ≥ ${contract.target_score})`);
      state.completed_at = now();
      writeJSON(path.join(dir, "state.json"), state);
      appendJSONL(loopId, "decisions.jsonl", { decision: "ACCEPTED", score: score.total, net_improvement: netImprovement });
      learn(loopId, contract, score, "success");
      console.log(`🎯 PASS — Loop tamamlandı. Score: ${score.total}/${contract.target_score}`);
      console.log(`   Rapor için: loop report ${loopId}`);
    } else {
      // aynı hata tekrar mı? (failure signature)
      const sig = sha(verification.results.filter(r=>!r.passed).map(r=>r.key).join("|") || "no-evidence");
      state.failure_signatures = state.failure_signatures || [];
      const repeatCount = state.failure_signatures.filter(s => s === sig).length;
      state.failure_signatures.push(sig);
      appendJSONL(loopId, "failures.jsonl", { signature: sig, repeat: repeatCount + 1, missing: verification.results.filter(r=>!r.passed).map(r=>r.criterion) });

      if (repeatCount >= 2) {
        state.status = "scoring"; // valid path: scoring -> failed
        state = transition(loopId, state, "failed", "same_failure_repeated (3x) — escalation gerekli");
        learn(loopId, contract, score, "anti-pattern");
        console.log(`⛔ Aynı hata 3. kez tekrarlandı. Loop FAILED. Root cause analizi ve strateji değişikliği gerekli.`);
      } else {
        state = transition(loopId, state, "retrying", `score ${score.total} < target ${contract.target_score}`);
        state.retry_count += 1;
        writeJSON(path.join(dir, "state.json"), state);
        console.log(`🔁 RETRY — Score ${score.total}/${contract.target_score}. Eksik kriterler:`);
        verification.results.filter(r=>!r.passed).forEach(r => console.log(`   ✗ ${r.criterion} → evidence/${r.key}-*.md bekleniyor (status: pass içermeli)`));
        console.log(`   Kanıt ekleyip tekrar: loop run ${loopId}  (kalan iterasyon: ${contract.max_iterations - state.iteration})`);
      }
    }
  } finally { release(); }
}

function learn(loopId, contract, score, kind) {
  const file = path.join(MEMORY, kind === "success" ? "successful-patterns.md" : "anti-patterns.md");
  fs.appendFileSync(file, `\n- [${now()}] loop:${loopId} | ${contract.loop_name} | score:${score.total} | template:${contract.template}\n`);
  appendEvent(loopId, { phase: "learning", agent: "memory-curator", event_type: "learning_recorded", summary: `${kind} → ${path.basename(file)}` });
}

function cmdCheckpoint(loopId, note = "") {
  const dir = mustLoop(loopId);
  const state = readJSON(path.join(dir, "state.json"));
  const cpId = uid("cp");
  const cpDir = path.join(dir, "checkpoints", cpId);
  fs.mkdirSync(cpDir, { recursive: true });
  fs.copyFileSync(path.join(dir, "state.json"), path.join(cpDir, "state.json"));
  fs.copyFileSync(path.join(dir, "contract.yaml"), path.join(cpDir, "contract.yaml"));
  writeJSON(path.join(cpDir, "meta.json"), { checkpoint_id: cpId, created_at: now(), note, iteration: state.iteration, score: state.current_score });
  state.last_successful_checkpoint = cpId;
  writeJSON(path.join(dir, "state.json"), state);
  appendEvent(loopId, { phase: state.phase, agent: "loop-orchestrator", event_type: "checkpoint_created", summary: cpId + (note ? " | " + note : "") });
  console.log(`📌 Checkpoint: ${cpId}`);
  return cpId;
}

function cmdRollback(loopId, cpId) {
  const dir = mustLoop(loopId);
  const cpDir = path.join(dir, "checkpoints", cpId);
  if (!fs.existsSync(cpDir)) die("Checkpoint bulunamadı: " + cpId);
  let state = readJSON(path.join(dir, "state.json"));
  if (TRANSITIONS[state.status]?.includes("rolling_back")) state = transition(loopId, state, "rolling_back", "manual rollback");
  const cpState = readJSON(path.join(cpDir, "state.json"));
  cpState.status = "ready"; cpState.updated_at = now();
  writeJSON(path.join(dir, "state.json"), cpState);
  fs.copyFileSync(path.join(cpDir, "contract.yaml"), path.join(dir, "contract.yaml"));
  appendEvent(loopId, { phase: "rollback", agent: "loop-orchestrator", event_type: "rollback_completed", summary: `→ ${cpId} (iter ${cpState.iteration}, score ${cpState.current_score})` });
  appendJSONL(loopId, "decisions.jsonl", { decision: "ROLLED_BACK", checkpoint: cpId });
  fs.appendFileSync(path.join(MEMORY, "anti-patterns.md"), `\n- [${now()}] loop:${loopId} rollback → ${cpId}\n`);
  console.log(`↩️ Rollback tamam: ${cpId}. State 'ready'.`);
}

function cmdStatus(loopId) {
  if (!loopId) {
    const cur = path.join(RUNTIME, "current-loop.json");
    if (fs.existsSync(cur)) loopId = readJSON(cur).loop_id;
    else die("Aktif loop yok. loop list ile bakın.");
  }
  const dir = mustLoop(loopId);
  const s = readJSON(path.join(dir, "state.json"));
  const c = parseYAML(fs.readFileSync(path.join(dir, "contract.yaml"), "utf8"));
  const events = fs.readFileSync(path.join(dir, "events.jsonl"), "utf8").trim().split("\n").filter(Boolean);
  const last = events.length ? JSON.parse(events[events.length - 1]) : null;
  console.log(`── LOOP STATUS ─────────────────────────────
Loop     : ${c.loop_name}
ID       : ${loopId}
Status   : ${s.status}   Phase: ${s.phase}
Iteration: ${s.iteration}/${c.max_iterations}   Retries: ${s.retry_count}
Score    : baseline ${s.baseline_score} → current ${s.current_score} → target ${s.target_score}
Checkpoint: ${s.last_successful_checkpoint || "-"}
Son olay : ${last ? `${last.event_type} — ${last.summary}` : "-"}
Events   : ${events.length} kayıt (append-only)`);
}

function cmdList() {
  if (!fs.existsSync(LOOPS)) return console.log("Hiç loop yok.");
  for (const id of fs.readdirSync(LOOPS)) {
    const f = path.join(LOOPS, id, "state.json");
    if (!fs.existsSync(f)) continue;
    const s = readJSON(f);
    console.log(`${id}  [${s.status}]  iter:${s.iteration}  score:${s.current_score}/${s.target_score}`);
  }
}

function cmdPause(loopId) {
  const dir = mustLoop(loopId);
  let s = readJSON(path.join(dir, "state.json"));
  transition(loopId, s, "paused", "user_paused");
  console.log("⏸️ Loop duraklatıldı.");
}
function cmdResume(loopId) {
  const dir = mustLoop(loopId);
  let s = readJSON(path.join(dir, "state.json"));
  if (s.status !== "paused") die("Loop 'paused' değil: " + s.status);
  transition(loopId, s, "ready", "user_resumed");
  console.log("▶️ Loop hazır. Devam: loop run " + loopId);
}

function cmdVerify(loopId) {
  const dir = mustLoop(loopId);
  const c = parseYAML(fs.readFileSync(path.join(dir, "contract.yaml"), "utf8"));
  const v = runVerification(loopId, c);
  v.results.forEach(r => console.log(`${r.passed ? "✅" : "❌"} ${r.criterion}${r.evidence ? "  [" + r.evidence + "]" : "  [kanıt yok: evidence/" + r.key + "-*.md]"}`));
  console.log(v.allPassed ? "Sonuç: PASS" : "Sonuç: FAIL");
}
function cmdScore(loopId) {
  const dir = mustLoop(loopId);
  const c = parseYAML(fs.readFileSync(path.join(dir, "contract.yaml"), "utf8"));
  const v = runVerification(loopId, c);
  const s = runScoring(loopId, c, v);
  console.log(`Score: ${s.total} (pass rate: ${Math.round(s.passRate * 100)}%)`);
  for (const [k, b] of Object.entries(s.breakdown)) console.log(`  ${k}: ${b.points}/${b.weight}${b.evidence_bound ? " [evidence-bound]" : ""}`);
}

function cmdReport(loopId) {
  const dir = mustLoop(loopId);
  const s = readJSON(path.join(dir, "state.json"));
  const c = parseYAML(fs.readFileSync(path.join(dir, "contract.yaml"), "utf8"));
  const events = fs.readFileSync(path.join(dir, "events.jsonl"), "utf8").trim().split("\n").filter(Boolean).map(l=>JSON.parse(l));
  const scores = fs.existsSync(path.join(dir,"scores.jsonl")) ? fs.readFileSync(path.join(dir,"scores.jsonl"),"utf8").trim().split("\n").filter(Boolean).map(l=>JSON.parse(l)) : [];
  const decisions = fs.existsSync(path.join(dir,"decisions.jsonl")) ? fs.readFileSync(path.join(dir,"decisions.jsonl"),"utf8").trim().split("\n").filter(Boolean).map(l=>JSON.parse(l)) : [];
  const finalDecision = decisions.length ? decisions[decisions.length-1].decision
    : s.status === "completed" ? "ACCEPTED" : s.status === "failed" ? "REJECTED" : "BLOCKED";
  const artifacts = fs.readdirSync(path.join(dir, "artifacts"));
  const evidence = fs.readdirSync(path.join(dir, "evidence"));
  const report = `# Loop Final Report — ${c.loop_name}

## 1. Executive Summary
Loop **${loopId}** durum: **${s.status}**. Final skor: **${s.current_score}** (hedef ${s.target_score}, baseline ${s.baseline_score}). Karar: **${finalDecision}**.

## 2. Original Objective
${c.objective}

## 3. Contract Summary
- Template: ${c.template} | Risk: ${c.risk_level} | Max iterations: ${c.max_iterations}
- Quality threshold: ${c.quality_threshold} | Minimum improvement: ${c.minimum_improvement}

## 4. Baseline & Score Evolution
${scores.map((x,i)=>`- Iterasyon ${i+1}: ${x.total} (pass rate ${(x.pass_rate*100).toFixed(0)}%)`).join("\n") || "- Skor kaydı yok"}

## 5. Iteration History
- Toplam iterasyon: ${s.iteration} | Retry: ${s.retry_count}
- Olay sayısı: ${events.length} (append-only events.jsonl)

## 6. Artifacts (${artifacts.length})
${artifacts.map(a=>"- artifacts/"+a).join("\n") || "- yok"}

## 7. Evidence (${evidence.length})
${evidence.map(a=>"- evidence/"+a).join("\n") || "- yok"}

## 8. Acceptance Criteria
${c.acceptance_criteria.map(a=>"- "+a).join("\n")}

## 9. Final Decision
**${finalDecision}**

## 10. Lessons Learned
Bkz. memory/successful-patterns.md ve memory/anti-patterns.md (loop:${loopId} etiketli satırlar).
`;
  atomicWrite(path.join(dir, "final-report.md"), report);
  console.log(report);
  console.log(`💾 Kaydedildi: loops/${loopId}/final-report.md`);
}

function cmdArchive(loopId) {
  const dir = mustLoop(loopId);
  let s = readJSON(path.join(dir, "state.json"));
  if (!TRANSITIONS[s.status]?.includes("archived")) die(`'${s.status}' durumundan arşivlenemez.`);
  transition(loopId, s, "archived", "user_archive");
  console.log("🗄️ Arşivlendi.");
}

function mustLoop(loopId) {
  if (!loopId) die("loop-id gerekli.");
  const dir = path.join(LOOPS, loopId);
  if (!fs.existsSync(path.join(dir, "state.json"))) die("Loop bulunamadı: " + loopId);
  return dir;
}
function die(msg) { console.error(msg); process.exit(1); }

// -------------------------------------------------------- main
const [,, cmd, ...args] = process.argv;
const commands = {
  init: () => cmdInit(args[0], args.slice(1).join(" ")),
  run: () => cmdRun(args[0]),
  status: () => cmdStatus(args[0]),
  list: cmdList,
  pause: () => cmdPause(args[0]),
  resume: () => cmdResume(args[0]),
  verify: () => cmdVerify(args[0]),
  score: () => cmdScore(args[0]),
  checkpoint: () => cmdCheckpoint(args[0], args.slice(1).join(" ")),
  rollback: () => cmdRollback(args[0], args[1]),
  report: () => cmdReport(args[0]),
  archive: () => cmdArchive(args[0]),
};
if (!cmd || !commands[cmd]) {
  console.log(`LOOP ENGINEERING OS — komutlar:
  init <template> "<objective>"   run <loop-id>        status [loop-id]
  list                            pause <loop-id>      resume <loop-id>
  verify <loop-id>                score <loop-id>      checkpoint <loop-id> [not]
  rollback <loop-id> <cp-id>      report <loop-id>     archive <loop-id>

Template'ler: ${fs.existsSync(TEMPLATES) ? fs.readdirSync(TEMPLATES).map(f=>f.replace(".yaml","")).join(", ") : "-"}`);
  process.exit(cmd ? 1 : 0);
}
commands[cmd]();
