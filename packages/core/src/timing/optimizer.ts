/** Akilli yayin zamani — master prompt md. 21 */

export interface SlotPerformance {
  dayOfWeek: number;   // 0=Pazar
  hourBucket: number;  // 0-23
  sampleSize: number;
  avgEngagementRate: number; // 0-1
  confidenceScore: number;   // 0-100
}

export interface TimingInput {
  now: Date;
  accountHistory: SlotPerformance[];
  /** Benchmark + genel saglik kitlesi aktivitesi, saat -> 0-100 */
  generalActivityByHour: Record<number, number>;
  contentCategory: string;
  urgency: number;         // 0-100
  isCritical: boolean;     // kritik aciklama: deney yapilmaz
  accountStartedAt: Date;
}

export interface TimingSuggestion {
  publishAt: Date;
  score: number;
  confidence: number;
  isExperiment: boolean;
  reason: string;
}

export interface TimingResult {
  primary: TimingSuggestion;
  alternatives: TimingSuggestion[];
  coldStart: boolean;
  weights: { account: number; general: number };
}

const COLD_START_WEEKS = 4;
const MIN_SAMPLE = 3;

/** Soguk baslangic agirliklari: ilk 4 hafta %40 hesap / %60 genel, sonra %80/%20 */
export function blendWeights(accountStartedAt: Date, now: Date) {
  const weeks = (now.getTime() - accountStartedAt.getTime()) / (7 * 864e5);
  return weeks < COLD_START_WEEKS
    ? { account: 0.4, general: 0.6, coldStart: true }
    : { account: 0.8, general: 0.2, coldStart: false };
}

function slotScore(
  day: number,
  hour: number,
  input: TimingInput,
  w: { account: number; general: number },
): { score: number; confidence: number } {
  const slot = input.accountHistory.find(
    (s) => s.dayOfWeek === day && s.hourBucket === hour && s.sampleSize >= MIN_SAMPLE,
  );
  const accountPart = slot ? slot.avgEngagementRate * 100 : 0;
  const confidence = slot ? slot.confidenceScore : 0;
  const generalPart = input.generalActivityByHour[hour] ?? 0;

  // Aciliyet: gundem tazeyse erken saat kazanir
  const freshness = input.urgency >= 70 ? Math.max(0, 100 - hour * 3) : 50;

  const base = w.account * accountPart + w.general * generalPart;
  const score = 0.75 * base + 0.25 * freshness;
  return { score: Math.round(score * 10) / 10, confidence };
}

function nextOccurrence(now: Date, hour: number): Date {
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(0);
  d.setHours(hour);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
  return d;
}

/**
 * Icerigin ~%80'i kanitlanmis saatlerde, %20'si kontrollu test saatlerinde.
 * Kritik aciklamalar deney icin kullanilmaz.
 */
export function suggestTiming(input: TimingInput, rand: () => number = Math.random): TimingResult {
  const w = blendWeights(input.accountStartedAt, input.now);
  const candidates: TimingSuggestion[] = [];

  for (let hour = 7; hour <= 23; hour++) {
    const at = nextOccurrence(input.now, hour);
    const { score, confidence } = slotScore(at.getDay(), hour, input, w);
    candidates.push({
      publishAt: at,
      score,
      confidence,
      isExperiment: false,
      reason:
        confidence > 0
          ? `Hesabin ${hour}:00 diliminde gecmis performansi (guven %${confidence}) ve kitle aktifligi.`
          : `Hesap verisi henuz yok; genel saglik kitlesi aktifligi ve gundem tazeligi esas alindi.`,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const proven = candidates.slice(0, 3);

  const doExperiment = !input.isCritical && rand() < 0.2;
  let primary = proven[0]!;

  if (doExperiment) {
    const untested = candidates.filter((c) => c.confidence === 0);
    const pick = untested[Math.floor(rand() * Math.max(1, untested.length))];
    if (pick) {
      primary = {
        ...pick,
        isExperiment: true,
        reason: "Kontrollu zaman testi (%20 kesif kotasi). Veri toplamak icin secildi.",
      };
    }
  }

  const alternatives = proven.filter((c) => c.publishAt.getTime() !== primary.publishAt.getTime()).slice(0, 2);

  return { primary, alternatives, coldStart: w.coldStart, weights: { account: w.account, general: w.general } };
}
