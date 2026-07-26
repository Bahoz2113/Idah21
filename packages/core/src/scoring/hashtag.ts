/** Hashtag puanlama — master prompt md. 20 */
export interface HashtagSignals {
  topicRelevance: number;
  currentVelocity: number;
  healthAudienceUsage: number;
  reachPotential: number;
  brandAlignment: number;
  spamPenalty: number;
}

export interface HashtagCandidate {
  tag: string;
  signals: HashtagSignals;
}

export interface HashtagDecision {
  selected: string[];
  scores: { tag: string; score: number }[];
  note: string;
}

export const HASHTAG_MIN_SCORE = 60;

export function scoreHashtag(s: HashtagSignals): number {
  const c = (n: number) => Math.max(0, Math.min(100, n));
  const raw =
    0.4 * c(s.topicRelevance) +
    0.25 * c(s.currentVelocity) +
    0.15 * c(s.healthAudienceUsage) +
    0.1 * c(s.reachPotential) +
    0.1 * c(s.brandAlignment) -
    c(s.spamPenalty);
  return Math.round(Math.max(0, raw) * 10) / 10;
}

/**
 * Tweet basina 0-2 etiket. Hicbir etiket esigi gecmezse bos donmek gecerlidir
 * ve cogu zaman tercih edilir.
 */
export function selectHashtags(
  candidates: HashtagCandidate[],
  opts: { isReply?: boolean; max?: number } = {},
): HashtagDecision {
  if (opts.isReply) {
    return { selected: [], scores: [], note: "Yanitlarda hashtag kullanilmaz." };
  }
  const scores = candidates
    .map((c) => ({ tag: c.tag, score: scoreHashtag(c.signals) }))
    .sort((a, b) => b.score - a.score);

  const selected = scores.filter((s) => s.score >= HASHTAG_MIN_SCORE).slice(0, opts.max ?? 2).map((s) => s.tag);

  return {
    selected,
    scores,
    note: selected.length === 0
      ? "Esigi gecen etiket yok. Etiketsiz paylasim gecerli ve tercih edilir."
      : `${selected.length} etiket secildi.`,
  };
}
