/** Gundem puanlama — master prompt md. 13 */
export interface TopicSignals {
  healthRelevance: number;      // 0-100
  sourceReliability: number;
  urgency: number;
  trendStrength: number;
  rightsImpact: number;
  batmanRelevance: number;
  discussionPotential: number;
  legalRiskPenalty: number;     // 0-100, dogrudan dusulur
  distinctSourceCount: number;
  isHeavyAllegation: boolean;
}

export interface TopicScoreResult {
  score: number;
  eligible: boolean;
  reasons: string[];
}

export const TOPIC_WEIGHTS = {
  healthRelevance: 0.25,
  sourceReliability: 0.2,
  urgency: 0.15,
  trendStrength: 0.15,
  rightsImpact: 0.1,
  batmanRelevance: 0.1,
  discussionPotential: 0.05,
} as const;

export const DEFAULT_TOPIC_THRESHOLD = 70;

export function scoreTopic(s: TopicSignals, threshold = DEFAULT_TOPIC_THRESHOLD): TopicScoreResult {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const raw =
    TOPIC_WEIGHTS.healthRelevance * clamp(s.healthRelevance) +
    TOPIC_WEIGHTS.sourceReliability * clamp(s.sourceReliability) +
    TOPIC_WEIGHTS.urgency * clamp(s.urgency) +
    TOPIC_WEIGHTS.trendStrength * clamp(s.trendStrength) +
    TOPIC_WEIGHTS.rightsImpact * clamp(s.rightsImpact) +
    TOPIC_WEIGHTS.batmanRelevance * clamp(s.batmanRelevance) +
    TOPIC_WEIGHTS.discussionPotential * clamp(s.discussionPotential);

  const score = Math.round(Math.max(0, raw - clamp(s.legalRiskPenalty)) * 10) / 10;
  const reasons: string[] = [];
  let eligible = true;

  if (score < threshold) {
    eligible = false;
    reasons.push(`Puan ${score}, esik ${threshold} altinda.`);
  }
  // Tek kaynaga dayanan agir iddia paylasim konusu olamaz (md. 13)
  if (s.isHeavyAllegation && s.distinctSourceCount < 2) {
    eligible = false;
    reasons.push("Agir iddia tek kaynaga dayaniyor. En az iki bagimsiz kaynak gerekli.");
  }
  if (eligible) reasons.push("Taslak uretimi icin uygun.");

  return { score, eligible, reasons };
}
