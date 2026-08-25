import React, { useState } from "react";

const TARGETS = { protein: 150, fat: 100, carbs: 50, kcal: 1700 };

const DAY_PLANS = [
  {
    id: "plan1",
    name: "Classic",
    meals: [
      { label: "Breakfast", name: "0% Greek yoghurt + mixed berries", protein: 16, fat: 1, carbs: 18, kcal: 145 },
      { label: "Lunch", name: "Chicken breast + mixed salad + olive oil", protein: 50, fat: 16, carbs: 10, kcal: 380 },
      { label: "Snack", name: "Non-fat Greek yoghurt + walnuts", protein: 20, fat: 10, carbs: 8, kcal: 195 },
      { label: "Dinner", name: "Cod + olive oil + avocado", protein: 42, fat: 62, carbs: 8, kcal: 780 },
      { label: "Shake", name: "Whey + almond milk", protein: 21, fat: 4, carbs: 3, kcal: 130 },
    ],
  },
  {
    id: "plan2",
    name: "Lean",
    meals: [
      { label: "Breakfast", name: "Non-fat Greek yoghurt + chia seeds", protein: 24, fat: 9, carbs: 5, kcal: 210 },
      { label: "Lunch", name: "Turkey breast + mixed salad + olive oil", protein: 46, fat: 15, carbs: 10, kcal: 350 },
      { label: "Snack", name: "Cottage cheese + almonds", protein: 17, fat: 8, carbs: 6, kcal: 165 },
      { label: "Dinner", name: "Chicken thigh + peanut butter + courgette", protein: 48, fat: 60, carbs: 10, kcal: 760 },
      { label: "Shake", name: "Whey + water", protein: 20, fat: 1.5, carbs: 2, kcal: 100 },
    ],
  },
  {
    id: "plan3",
    name: "High Protein",
    meals: [
      { label: "Breakfast", name: "3 whole eggs + 2 egg whites, scrambled, spinach", protein: 27, fat: 15, carbs: 2, kcal: 260 },
      { label: "Lunch", name: "Firm tofu + mixed salad + sesame oil", protein: 20, fat: 20, carbs: 8, kcal: 290 },
      { label: "Snack", name: "2 hard-boiled eggs + almonds", protein: 15, fat: 12, carbs: 2, kcal: 175 },
      { label: "Dinner", name: "Duck breast + walnuts + cauliflower", protein: 55, fat: 58, carbs: 8, kcal: 760 },
      { label: "Shake", name: "Whey + almond milk", protein: 21, fat: 4, carbs: 3, kcal: 130 },
    ],
  },
  {
    id: "plan4",
    name: "Light & Simple",
    meals: [
      { label: "Breakfast", name: "Protein powder + almond butter + almond milk, blended", protein: 24, fat: 22, carbs: 4, kcal: 300 },
      { label: "Lunch", name: "Cod or haddock + mixed salad + olive oil", protein: 40, fat: 16, carbs: 10, kcal: 340 },
      { label: "Snack", name: "Non-fat cheese + celery sticks", protein: 20, fat: 4, carbs: 3, kcal: 130 },
      { label: "Dinner", name: "Firm tofu + smoked salmon + olive oil + spinach", protein: 40, fat: 62, carbs: 6, kcal: 760 },
      { label: "Shake", name: "Whey + water", protein: 20, fat: 1.5, carbs: 2, kcal: 100 },
    ],
  },
];

function sumMacros(meals) {
  return meals.reduce(
    (t, m) => ({
      protein: t.protein + m.protein,
      fat: t.fat + m.fat,
      carbs: t.carbs + m.carbs,
      kcal: t.kcal + m.kcal,
    }),
    { protein: 0, fat: 0, carbs: 0, kcal: 0 }
  );
}

function MacroBar({ label, value, target, unit, color }) {
  const pct = Math.min(100, (value / target) * 100);
  const over = value > target;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, color: "#3a3a3a" }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: over ? "#c0392b" : "#3a3a3a" }}>
          {value.toFixed(0)}{unit} / {target}{unit}
        </span>
      </div>
      <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: over ? "#c0392b" : color,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function MacroPlanner() {
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const selectedPlan = DAY_PLANS.find((p) => p.id === selectedPlanId) || null;
  const totals = selectedPlan ? sumMacros(selectedPlan.meals) : { protein: 0, fat: 0, carbs: 0, kcal: 0 };

  const selectPlan = (id) => {
    setSelectedPlanId((prev) => (prev === id ? null : id));
  };

  const reset = () => setSelectedPlanId(null);

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        background: "#f7f7f5",
        minHeight: "100vh",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#111" }}>
            Daily <span style={{ color: "#d61f2c" }}>Macro</span> Planner
          </h1>
          <button
            onClick={reset}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              color: "#555",
            }}
          >
            Reset day
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#777", marginTop: 0, marginBottom: 20 }}>
          Pick a full day plan below. Each one is pre-balanced to fit your daily targets.
        </p>

        <div
          style={{
            position: "sticky",
            top: 12,
            zIndex: 20,
            background: "#fff",
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 24,
            border: "1px solid #eee",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>
              {selectedPlan ? `${selectedPlan.name} — today's totals` : "Today's totals"}
            </span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#d61f2c" }}>{totals.kcal.toFixed(0)} kcal</span>
          </div>
          <MacroBar label="Protein" value={totals.protein} target={TARGETS.protein} unit="g" color="#d61f2c" />
          <MacroBar label="Fat" value={totals.fat} target={TARGETS.fat} unit="g" color="#2c3e50" />
          <MacroBar label="Carbs" value={totals.carbs} target={TARGETS.carbs} unit="g" color="#7f8c8d" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DAY_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const planTotals = sumMacros(plan.meals);
            return (
              <div
                key={plan.id}
                onClick={() => selectPlan(plan.id)}
                style={{
                  background: isSelected ? "#111" : "#fff",
                  color: isSelected ? "#fff" : "#222",
                  border: isSelected ? "2px solid #111" : "2px solid #eaeaea",
                  borderRadius: 12,
                  padding: "16px 18px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      borderRadius: "50%",
                      border: isSelected ? "none" : "2px solid #ccc",
                      background: isSelected ? "#d61f2c" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      color: "#fff",
                    }}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{plan.name}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                  {plan.meals.map((meal) => (
                    <div
                      key={meal.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: isSelected ? "#ddd" : "#444" }}>
                        <span style={{ fontWeight: 600, color: isSelected ? "#fff" : "#111" }}>{meal.label}:</span>{" "}
                        {meal.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          whiteSpace: "nowrap",
                          color: isSelected ? "#999" : "#999",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {meal.kcal}kcal
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 10,
                    borderTop: isSelected ? "1px solid #333" : "1px solid #eee",
                    fontSize: 12.5,
                    fontVariantNumeric: "tabular-nums",
                    color: isSelected ? "#ccc" : "#666",
                  }}
                >
                  <span>
                    P{planTotals.protein} · F{planTotals.fat} · C{planTotals.carbs}
                  </span>
                  <span style={{ fontWeight: 700, color: isSelected ? "#fff" : "#111" }}>
                    {planTotals.kcal} kcal
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
