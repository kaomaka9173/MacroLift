import { useEffect, useMemo, useState } from "react";
import { MacroTracker } from "./components/MacroTracker";
import { WorkoutTracker } from "./components/WorkoutTracker";
import {
  loadMacroEntries,
  loadMacroGoals,
  loadWorkoutData,
  saveMacroEntries,
  saveMacroGoals,
  saveWorkoutData,
} from "./storage";
import type { AppTab, MacroEntry, MacroGoals, WorkoutData } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("macros");
  const [macroEntries, setMacroEntries] = useState<MacroEntry[]>(() => loadMacroEntries());
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(() => loadMacroGoals());
  const [workoutData, setWorkoutData] = useState<WorkoutData>(() => loadWorkoutData());

  useEffect(() => {
    saveMacroEntries(macroEntries);
  }, [macroEntries]);

  useEffect(() => {
    saveMacroGoals(macroGoals);
  }, [macroGoals]);

  useEffect(() => {
    saveWorkoutData(workoutData);
  }, [workoutData]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="header-date">{todayLabel}</p>
        </div>
        <div className="brand-mark">
          <img src={`${import.meta.env.BASE_URL}icons/macrolift-icon.svg`} alt="MacroLift app icon" />
        </div>
      </header>

      <main className="app-main">
        {activeTab === "macros" ? (
          <MacroTracker entries={macroEntries} goals={macroGoals} onEntriesChange={setMacroEntries} onGoalsChange={setMacroGoals} />
        ) : (
          <WorkoutTracker workoutData={workoutData} onWorkoutDataChange={setWorkoutData} />
        )}
      </main>

      <nav className="tab-bar" aria-label="Main sections">
        <button
          type="button"
          className={activeTab === "macros" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("macros")}
        >
          <span>Macros</span>
        </button>
        <button
          type="button"
          className={activeTab === "workouts" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("workouts")}
        >
          <span>Workouts</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
