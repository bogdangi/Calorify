import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/indexeddb/db';
import { weightRepository } from '../db/repositories/weightRepository';
import type { WeightEntry } from '../types/weight';

export function useWeights() {
  const weights = useLiveQuery(() => db.weights.orderBy('date').toArray());

  const addWeight = async (data: Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    return weightRepository.create(data);
  };

  const updateWeight = async (id: string, updates: Partial<WeightEntry>) => {
    return weightRepository.update(id, updates);
  };

  const deleteWeight = async (id: string) => {
    return weightRepository.delete(id);
  };

  return {
    weights: weights ?? [],
    isLoading: weights === undefined,
    addWeight,
    updateWeight,
    deleteWeight,
  };
}

export function useWeightByDate(date: string) {
  const entry = useLiveQuery(() => db.weights.where('date').equals(date).first(), [date]);

  return {
    entry,
    isLoading: entry === undefined,
  };
}
