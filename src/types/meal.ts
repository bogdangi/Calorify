export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type AmountUnit = 'g' | 'ml' | 'portion' | 'piece';
export type MealSource = 'manual' | 'vision';

export interface VisionPrediction {
  foodId: string;
  foodName?: string;
  confidence: number;
  detectedPortionGrams?: number;
  modelId: string;
  modelVersion: string;
  isMock: boolean;
  analyzedAt: string;
}

export interface MealEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  name: string;
  amount?: number;
  amountUnit?: AmountUnit;
  calories: number;
  mealType?: MealType;
  source: MealSource;
  visionPrediction?: VisionPrediction;
  createdAt: string;
  updatedAt: string;
}
