export type AppTab = "macros" | "workouts";

export interface MacroEntry {
  id: string;
  itemName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sugars: number;
  createdAt: string;
}

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sugars: number;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  sugars: number;
}

export type WorkoutDay = "Legs" | "Push" | "Pull" | "Upper" | "Lower";

export interface Exercise {
  id: string;
  name: string;
  startingWeight: number;
  maxWeight: number;
  sets: number;
  reps: number;
  completed: boolean;
}

export type WorkoutData = Record<WorkoutDay, Exercise[]>;
