import type { FoodClassifier, FoodClassification, ImageSource } from '../../types/ml';

export interface EnsembleHead {
  classifier: FoodClassifier;
  label: string;
}

export type HeadStepStatus = 'pending' | 'running' | 'done' | 'failed';

export interface HeadStep {
  label: string;
  status: HeadStepStatus;
  ms?: number;
}

/**
 * Runs classifier heads one after another and shows whichever candidate
 * scores highest. Sequential is mandatory, not a preference: ORT-web's
 * WASM binding guards all sessions with ONE global run lock — concurrent
 * session.run() calls throw "Session already started" / "Session
 * mismatch" and destroy each other's runs.
 *
 * onProgress gets a fresh snapshot after every step so the UI can show
 * which model is running.
 *
 * ponytail: raw softmax scores across heads aren't calibrated — a
 * confidently wrong head can outrank a correct-but-iffy one. Upgrade
 * path: per-head temperature scaling if field results misbehave.
 */
export class EnsembleClassifier implements FoodClassifier {
  private heads: EnsembleHead[];
  private onProgress?: (steps: HeadStep[]) => void;

  constructor(heads: EnsembleHead[], onProgress?: (steps: HeadStep[]) => void) {
    this.heads = heads;
    this.onProgress = onProgress;
  }

  async classify(image: ImageSource): Promise<FoodClassification[]> {
    const steps: HeadStep[] = this.heads.map((head) => ({ label: head.label, status: 'pending' }));
    const emit = () => this.onProgress?.(steps.map((step) => ({ ...step })));
    emit();

    const results: FoodClassification[][] = [];
    for (let i = 0; i < this.heads.length; i++) {
      steps[i].status = 'running';
      emit();
      const started = performance.now();
      try {
        results.push(await this.heads[i].classifier.classify(image));
        steps[i].status = 'done';
      } catch {
        results.push([]);
        steps[i].status = 'failed';
      }
      steps[i].ms = Math.round(performance.now() - started);
      emit();
    }

    const byFood = new Map<string, FoodClassification>();
    for (const candidates of results) {
      for (const candidate of candidates) {
        const existing = byFood.get(candidate.foodId);
        if (!existing || candidate.confidence > existing.confidence) {
          byFood.set(candidate.foodId, candidate);
        }
      }
    }

    return [...byFood.values()]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }
}
