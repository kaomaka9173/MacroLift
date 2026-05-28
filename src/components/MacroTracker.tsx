import { useMemo, useState } from "react";
import type { MacroEntry, MacroGoals, MacroTotals } from "../types";

interface MacroTrackerProps {
  entries: MacroEntry[];
  goals: MacroGoals;
  onEntriesChange: (entries: MacroEntry[]) => void;
  onGoalsChange: (goals: MacroGoals) => void;
}

interface MacroFormState {
  itemName: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  sugars: string;
}

const emptyForm: MacroFormState = {
  itemName: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  sugars: "",
};

const toNumber = (value: string): number => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

const goalMeta: Array<{ key: keyof MacroGoals; label: string; unit: string }> = [
  { key: "calories", label: "Calories", unit: "cal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "fats", label: "Fats", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "sugars", label: "Sugars", unit: "g" },
];

export function MacroTracker({ entries, goals, onEntriesChange, onGoalsChange }: MacroTrackerProps) {
  const [form, setForm] = useState<MacroFormState>(emptyForm);
  const [goalsOpen, setGoalsOpen] = useState(false);

  const totals = useMemo<MacroTotals>(
    () =>
      entries.reduce(
        (sum, entry) => ({
          calories: sum.calories + entry.calories,
          protein: sum.protein + entry.protein,
          carbs: sum.carbs + entry.carbs,
          fats: sum.fats + entry.fats,
          sugars: sum.sugars + entry.sugars,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0, sugars: 0 },
      ),
    [entries],
  );

  const updateField = (field: keyof MacroFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateGoal = (field: keyof MacroGoals, value: string) => {
    const number = Number(value);
    onGoalsChange({
      ...goals,
      [field]: Number.isFinite(number) && number > 0 ? number : 0,
    });
  };

  const addEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const entry: MacroEntry = {
      id: crypto.randomUUID(),
      itemName: form.itemName.trim(),
      calories: toNumber(form.calories),
      protein: toNumber(form.protein),
      carbs: toNumber(form.carbs),
      fats: toNumber(form.fats),
      sugars: toNumber(form.sugars),
      createdAt: new Date().toISOString(),
    };

    if (entry.calories + entry.protein + entry.carbs + entry.fats + entry.sugars === 0 && !entry.itemName) {
      return;
    }

    onEntriesChange([entry, ...entries]);
    setForm(emptyForm);
  };

  const deleteEntry = (id: string) => {
    onEntriesChange(entries.filter((entry) => entry.id !== id));
  };

  const resetDay = () => {
    if (entries.length === 0) return;
    if (window.confirm("Reset today's macro entries? This cannot be undone.")) {
      onEntriesChange([]);
    }
  };

  return (
    <section className="tracker-stack" aria-labelledby="macro-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Daily tracker</p>
          <h2 id="macro-heading">Macro Tracker</h2>
        </div>
        <div className="header-actions">
          <button type="button" className="ghost-button compact" onClick={() => setGoalsOpen((open) => !open)}>
            {goalsOpen ? "Done" : "Edit Goals"}
          </button>
          <button type="button" className="ghost-button compact" onClick={resetDay} disabled={entries.length === 0}>
            Reset Day
          </button>
        </div>
      </div>

      <div className="totals-grid" aria-label="Daily macro totals">
        <TotalCard label="Calories" value={totals.calories} unit="cal" goal={goals.calories} highlight />
        <div className="compact-macro-list">
          <TotalCard label="Protein" value={totals.protein} unit="g" goal={goals.protein} compact />
          <TotalCard label="Carbs" value={totals.carbs} unit="g" goal={goals.carbs} compact />
          <TotalCard label="Fats" value={totals.fats} unit="g" goal={goals.fats} compact />
          <TotalCard label="Sugars" value={totals.sugars} unit="g" goal={goals.sugars} compact />
        </div>
      </div>

      {goalsOpen && (
        <div className="panel goal-editor">
          {goalMeta.map((goal) => (
            <NumberField
              key={goal.key}
              label={`${goal.label} goal`}
              value={goals[goal.key] > 0 ? String(goals[goal.key]) : ""}
              onChange={(value) => updateGoal(goal.key, value)}
            />
          ))}
        </div>
      )}

      <form className="panel form-panel" onSubmit={addEntry}>
        <label>
          <span>Item name</span>
          <input
            value={form.itemName}
            onChange={(event) => updateField("itemName", event.target.value)}
            placeholder="Chicken bowl"
          />
        </label>

        <div className="field-grid">
          <NumberField label="Calories" value={form.calories} onChange={(value) => updateField("calories", value)} />
          <NumberField label="Protein" value={form.protein} onChange={(value) => updateField("protein", value)} />
          <NumberField label="Carbs" value={form.carbs} onChange={(value) => updateField("carbs", value)} />
          <NumberField label="Fats" value={form.fats} onChange={(value) => updateField("fats", value)} />
          <NumberField label="Sugars" value={form.sugars} onChange={(value) => updateField("sugars", value)} />
        </div>

        <button type="submit" className="primary-button">
          Add Entry
        </button>
      </form>

      <div className="list-stack">
        {entries.length === 0 ? (
          <div className="empty-state">No macro entries yet.</div>
        ) : (
          entries.map((entry) => (
            <article className="panel list-card" key={entry.id}>
              <div>
                <h3>{entry.itemName || "Macro entry"}</h3>
                <p>
                  {formatNumber(entry.calories)} cal - P {formatNumber(entry.protein)}g - C{" "}
                  {formatNumber(entry.carbs)}g - F {formatNumber(entry.fats)}g - S {formatNumber(entry.sugars)}g
                </p>
              </div>
              <button type="button" className="danger-button" onClick={() => deleteEntry(entry.id)}>
                Delete
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

interface TotalCardProps {
  label: string;
  value: number;
  unit: string;
  goal?: number;
  highlight?: boolean;
  compact?: boolean;
}

function TotalCard({ label, value, unit, goal, highlight = false, compact = false }: TotalCardProps) {
  const hasGoal = typeof goal === "number" && Number.isFinite(goal) && goal > 0;
  const percentage = hasGoal ? Math.round((value / goal) * 100) : 0;
  const remaining = hasGoal ? Math.max(goal - value, 0) : 0;
  const barWidth = Math.min(percentage, 100);
  const overGoal = hasGoal && value > goal;
  const cardClassName = [
    "total-card",
    highlight ? "highlight" : "",
    compact ? "compact-card" : "",
    overGoal ? "over-goal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClassName}>
      <div className="macro-card-main">
        <div>
          <span>{label}</span>
          <strong>{formatNumber(value)}</strong>
          <small>{unit}</small>
        </div>
        {compact && !hasGoal ? <p className="no-goal">No goal set</p> : null}
      </div>
      {hasGoal ? (
        <div className="macro-card-progress">
          <div className="macro-progress-copy">
            <p>
              {formatNumber(value)} / {formatNumber(goal)} {unit}
            </p>
            <p>{overGoal ? `${formatNumber(value - goal)} ${unit} over` : `${formatNumber(remaining)} ${unit} remaining`}</p>
            <div className="macro-card-percent">{percentage}%</div>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${barWidth}%` }} />
          </div>
        </div>
      ) : null}
    </div>
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
