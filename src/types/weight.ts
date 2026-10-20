export interface WeightEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  weightKg: number;
  createdAt: string;
  updatedAt: string;
}

export type WeightChartRange = '7d' | '30d' | '3m' | 'all';

export interface WeightStats {
  currentWeight: number | null;
  startingWeight: number | null;
  weightChange: number | null;
  averageWeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
}
