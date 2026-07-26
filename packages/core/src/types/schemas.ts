import { z } from "zod";

/** LLM ciktilarinin sozlesmesi. Model cikti dogrudan yayimlanmaz; once buradan gecer. */

export const RiskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "BLOCKED"]);

export const DraftGenerationOutput = z.object({
  promptVersion: z.string(),
  text: z.string().min(20).max(4000),
  altHooks: z.array(z.string().min(5).max(300)).length(2),
  hashtags: z.array(z.string().regex(/^#[\p{L}\p{N}_]+$/u)).max(2),
  sourceSummary: z.string().min(10),
  /** Kaynakta gecmeyen olgu uretilmediginin model beyani */
  factsGroundedInSources: z.literal(true),
  uncertainties: z.array(z.string()).default([]),
});
export type DraftGenerationOutput = z.infer<typeof DraftGenerationOutput>;

export const LegalReviewOutput = z.object({
  promptVersion: z.string(),
  level: RiskLevelSchema,
  reasons: z.array(z.string()).min(1),
  saferAlternative: z.string().nullable(),
  namedEntities: z.array(z.string()).default([]),
});
export type LegalReviewOutput = z.infer<typeof LegalReviewOutput>;

export const ToneReviewOutput = z.object({
  promptVersion: z.string(),
  humanStyleScore: z.number().min(0).max(100),
  corporateAlignmentScore: z.number().min(0).max(100),
  toneScore: z.number().min(0).max(100),
  detectedCliches: z.array(z.string()).default([]),
  rewrite: z.string().nullable(),
});
export type ToneReviewOutput = z.infer<typeof ToneReviewOutput>;

export const TopicScoringOutput = z.object({
  promptVersion: z.string(),
  items: z.array(
    z.object({
      collectedItemId: z.string(),
      healthRelevance: z.number().min(0).max(100),
      urgency: z.number().min(0).max(100),
      rightsImpact: z.number().min(0).max(100),
      batmanRelevance: z.number().min(0).max(100),
      discussionPotential: z.number().min(0).max(100),
      isHeavyAllegation: z.boolean(),
      category: z.string(),
    }),
  ),
});

export const BenchmarkInsightOutput = z.object({
  promptVersion: z.string(),
  weekStart: z.string(),
  findings: z.array(z.object({ pattern: z.string(), evidence: z.string(), lift: z.string() })),
  recommendations: z.array(z.string()).max(3),
  /** Metin kopyalanmadiginin beyani */
  noVerbatimText: z.literal(true),
});

export const ReplyDraftOutput = DraftGenerationOutput.extend({
  hashtags: z.array(z.string()).max(0), // yanitlarda hashtag yok
  replyToPostId: z.string(),
});
