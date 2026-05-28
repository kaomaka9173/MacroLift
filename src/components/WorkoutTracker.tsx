import { useState } from "react";
import { WORKOUT_DAYS } from "../storage";
import type { Exercise, WorkoutData, WorkoutDay } from "../types";

interface WorkoutTrackerProps {
  workoutData: WorkoutData;
  onWorkoutDataChange: (data: WorkoutData) => void;
}

interface ExerciseFormState {
  name: string;
  startingWeight: string;
  maxWeight: string;
  sets: string;
  reps: string;
}

const emptyExerciseForm: ExerciseFormState = {
  name: "",
  startingWeight: "",
  maxWeight: "",
  sets: "",
  reps: "",
};

const toNumber = (value: string): number => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

export function WorkoutTracker({ workoutData, onWorkoutDataChange }: WorkoutTrackerProps) {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>("Legs");
  const [form, setForm] = useState<ExerciseFormState>(emptyExerciseForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const exercises = workoutData[selectedDay];
  const completedCount = exercises.filter((exercise) => exercise.completed).length;
  const weeklyCompletedCount = WORKOUT_DAYS.reduce(
    (count, day) => count + workoutData[day].filter((exercise) => exercise.completed).length,
    0,
  );

  const updateField = (field: keyof ExerciseFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const clearForm = () => {
    setForm(emptyExerciseForm);
    setEditingId(null);
  };

  const saveExercise = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const exercise: Exercise = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name.trim(),
      startingWeight: toNumber(form.startingWeight),
      maxWeight: toNumber(form.maxWeight),
      sets: toNumber(form.sets),
      reps: toNumber(form.reps),
      completed: editingId ? exercises.find((item) => item.id === editingId)?.completed ?? false : false,
    };

    if (!exercise.name) return;

    const nextExercises = editingId
      ? exercises.map((item) => (item.id === editingId ? exercise : item))
      : [exercise, ...exercises];

    onWorkoutDataChange({ ...workoutData, [selectedDay]: nextExercises });
    clearForm();
  };

  const startEdit = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setForm({
      name: exercise.name,
      startingWeight: String(exercise.startingWeight || ""),
      maxWeight: String(exercise.maxWeight || ""),
      sets: String(exercise.sets || ""),
      reps: String(exercise.reps || ""),
    });
  };

  const toggleCompleted = (id: string) => {
    onWorkoutDataChange({
      ...workoutData,
      [selectedDay]: exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, completed: !exercise.completed } : exercise,
      ),
    });
  };

  const deleteExercise = (id: string) => {
    onWorkoutDataChange({
      ...workoutData,
      [selectedDay]: exercises.filter((exercise) => exercise.id !== id),
    });
    if (editingId === id) clearForm();
  };

  const changeDay = (day: WorkoutDay) => {
    setSelectedDay(day);
    clearForm();
  };

  const resetDone = () => {
    if (weeklyCompletedCount === 0) return;

    if (
      window.confirm(
        "Reset all completed workout checkmarks for the week? Your exercises, weights, sets, and reps will stay saved.",
      )
    ) {
      onWorkoutDataChange(
        WORKOUT_DAYS.reduce<WorkoutData>(
          (nextData, day) => ({
            ...nextData,
            [day]: workoutData[day].map((exercise) => ({ ...exercise, completed: false })),
          }),
          { ...workoutData },
        ),
      );
    }
  };

  return (
    <section className="tracker-stack" aria-labelledby="workout-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">5-day split</p>
          <h2 id="workout-heading">Workout Tracker</h2>
        </div>
        <div className="completion-pill">
          {completedCount}/{exercises.length} done
        </div>
      </div>

      <div className="day-tabs" aria-label="Workout days">
        {WORKOUT_DAYS.map((day) => (
          <button
            type="button"
            key={day}
            className={day === selectedDay ? "day-button active" : "day-button"}
            onClick={() => changeDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <form className="panel form-panel" onSubmit={saveExercise}>
        <label>
          <span>Exercise name</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Back squat"
            required
          />
        </label>

        <div className="field-grid">
          <NumberField
            label="Starting weight"
            value={form.startingWeight}
            onChange={(value) => updateField("startingWeight", value)}
          />
          <NumberField label="Max weight" value={form.maxWeight} onChange={(value) => updateField("maxWeight", value)} />
          <NumberField label="Sets" value={form.sets} onChange={(value) => updateField("sets", value)} />
          <NumberField label="Reps" value={form.reps} onChange={(value) => updateField("reps", value)} />
        </div>

        <div className="button-row">
          <button type="submit" className="primary-button">
            {editingId ? "Save Changes" : "Add Exercise"}
          </button>
          {editingId && (
            <button type="button" className="ghost-button" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-stack">
        {exercises.length === 0 ? (
          <div className="empty-state">No exercises added for {selectedDay}.</div>
        ) : (
          exercises.map((exercise) => (
            <article className={exercise.completed ? "panel exercise-card completed" : "panel exercise-card"} key={exercise.id}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={() => toggleCompleted(exercise.id)}
                  aria-label={`Mark ${exercise.name} complete`}
                />
                <span>
                  <strong>{exercise.name}</strong>
                  <small>{exercise.completed ? "Completed" : "Not completed"}</small>
                </span>
              </label>

              <div className="exercise-stats">
                <span>Start {exercise.startingWeight || 0}</span>
                <span>Max {exercise.maxWeight || 0}</span>
                <span>
                  {exercise.sets || 0} x {exercise.reps || 0}
                </span>
              </div>

              <div className="card-actions">
                <button type="button" className="ghost-button" onClick={() => startEdit(exercise)}>
                  Edit
                </button>
                <button type="button" className="danger-button" onClick={() => deleteExercise(exercise.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="weekly-reset-area">
        <button type="button" className="reset-done-button" onClick={resetDone} disabled={weeklyCompletedCount === 0}>
          Reset Done
        </button>
      </div>
    </section>
  );
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step="0.1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0"
      />
    </label>
  );
}
