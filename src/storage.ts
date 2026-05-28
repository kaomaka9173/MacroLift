import type { MacroEntry, MacroGoals, WorkoutData, WorkoutDay } from "./types";

export const MACRO_STORAGE_KEY = "macrolift_macro_entries";
export const MACRO_GOALS_STORAGE_KEY = "macrolift_macro_goals";
export const WORKOUT_STORAGE_KEY = "macrolift_workout_data";

export const WORKOUT_DAYS: WorkoutDay[] = ["Legs", "Push", "Pull", "Upper", "Lower"];

export const DEFAULT_MACRO_GOALS: MacroGoals = {
  calories: 2603,
  protein: 195,
  fats: 101,
  carbs: 22,
  sugars: 0,
};

export const createEmptyWorkoutData = (): WorkoutData => ({
  Legs: [],
  Push: [],
  Pull: [],
  Upper: [],
  Lower: [],
});

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const safeNumber = (value: unknown): number => (isNumber(value) ? value : 0);

export const loadMacroEntries = (): MacroEntry[] => {
  try {
    const stored = localStorage.getItem(MACRO_STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object")
      .map((entry) => ({
        id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(),
        itemName: typeof entry.itemName === "string" ? entry.itemName : "",
        calories: safeNumber(entry.calories),
        protein: safeNumber(entry.protein),
        carbs: safeNumber(entry.carbs),
        fats: safeNumber(entry.fats),
        sugars: safeNumber(entry.sugars),
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
};

export const saveMacroEntries = (entries: MacroEntry[]) => {
  localStorage.setItem(MACRO_STORAGE_KEY, JSON.stringify(entries));
};

export const loadMacroGoals = (): MacroGoals => {
  try {
    const stored = localStorage.getItem(MACRO_GOALS_STORAGE_KEY);
    if (!stored) return DEFAULT_MACRO_GOALS;

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return DEFAULT_MACRO_GOALS;

    const source = parsed as Record<string, unknown>;

    return {
      calories: safeNumber(source.calories) || DEFAULT_MACRO_GOALS.calories,
      protein: safeNumber(source.protein) || DEFAULT_MACRO_GOALS.protein,
      fats: safeNumber(source.fats) || DEFAULT_MACRO_GOALS.fats,
      carbs: safeNumber(source.carbs) || DEFAULT_MACRO_GOALS.carbs,
      sugars: safeNumber(source.sugars),
    };
  } catch {
    return DEFAULT_MACRO_GOALS;
  }
};

export const saveMacroGoals = (goals: MacroGoals) => {
  localStorage.setItem(MACRO_GOALS_STORAGE_KEY, JSON.stringify(goals));
};

export const loadWorkoutData = (): WorkoutData => {
  try {
    const stored = localStorage.getItem(WORKOUT_STORAGE_KEY);
    if (!stored) return createEmptyWorkoutData();

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return createEmptyWorkoutData();

    const source = parsed as Record<string, unknown>;
    const data = createEmptyWorkoutData();

    WORKOUT_DAYS.forEach((day) => {
      const exercises = source[day];
      if (!Array.isArray(exercises)) return;

      data[day] = exercises
        .filter((exercise): exercise is Record<string, unknown> => !!exercise && typeof exercise === "object")
        .map((exercise) => ({
          id: typeof exercise.id === "string" ? exercise.id : crypto.randomUUID(),
          name: typeof exercise.name === "string" ? exercise.name : "",
          startingWeight: safeNumber(exercise.startingWeight),
          maxWeight: safeNumber(exercise.maxWeight),
          sets: safeNumber(exercise.sets),
          reps: safeNumber(exercise.reps),
          completed: typeof exercise.completed === "boolean" ? exercise.completed : false,
        }));
    });

    return data;
  } catch {
    return createEmptyWorkoutData();
  }
};

export const saveWorkoutData = (data: WorkoutData) => {
  localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(data));
};
