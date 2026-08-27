import React, { useState } from "react";

const TARGETS = { protein: 150, fat: 100, carbs: 50, kcal: 1700 };

const DAY_PLANS = [
  {
    id: "plan1",
    name: "Day 1",
    meals: [
      { label: "Breakfast", name: "150g 0% Greek yoghurt + 1 scoop whey (30g), mixed in", protein: 39, fat: 2, carbs: 8, kcal: 203 },
      { label: "Lunch", name: "100g chicken breast + 150g mixed salad + 15g olive oil", protein: 34, fat: 19, carbs: 5, kcal: 328 },
      { label: "Snack", name: "120g cottage cheese + 28g walnuts + 80g mixed berries", protein: 17, fat: 26, carbs: 16, kcal: 350 },
      { label: "Dinner", name: "160g cod + 24g olive oil + 150g avocado", protein: 40, fat: 48, carbs: 14, kcal: 620 },
      { label: "Shake", name: "1 scoop whey (30g) + 200ml almond milk", protein: 25, fat: 4, carbs: 4, kcal: 150 },
    ],
  },
  {
    id: "plan2",
    name: "Day 2",
    meals: [
      { label: "Breakfast", name: "200g non-fat Greek yoghurt + 20g chia seeds", protein: 23, fat: 7, carbs: 16, kcal: 207 },
      { label: "Lunch", name: "120g turkey breast + 150g mixed salad + 20g olive oil", protein: 38, fat: 22, carbs: 5, kcal: 369 },
      { label: "Snack", name: "150g cottage cheese + 30g almonds", protein: 22, fat: 24, carbs: 10, kcal: 330 },
      { label: "Dinner", name: "170g chicken thigh + 30g peanut butter + 150g courgette + 14g olive oil", protein: 53, fat: 48, carbs: 11, kcal: 632 },
      { label: "Shake", name: "1 scoop whey (30g) + water", protein: 24, fat: 2, carbs: 3, kcal: 120 },
    ],
  },
  {
    id: "plan3",
    name: "Day 3",
    meals: [
      { label: "Breakfast", name: "3 whole eggs + 2 egg whites, scrambled, 50g spinach", protein: 28, fat: 15, carbs: 3, kcal: 262 },
      { label: "Lunch", name: "260g firm tofu + 150g mixed salad + 6g sesame oil", protein: 45, fat: 30, carbs: 10, kcal: 457 },
      { label: "Snack", name: "2 hard-boiled eggs + 15g almonds", protein: 16, fat: 17, carbs: 4, kcal: 231 },
      { label: "Dinner", name: "135g duck breast + 100g cauliflower + 120g sweet potato", protein: 30, fat: 38, carbs: 29, kcal: 583 },
      { label: "Shake", name: "1 scoop whey (30g) + 200ml almond milk", protein: 25, fat: 4, carbs: 4, kcal: 150 },
    ],
  },
  {
    id: "plan4",
    name: "Day 4",
    meals: [
      { label: "Breakfast", name: "1 scoop whey + 25g almond butter + 200ml almond milk + 80g banana, blended", protein: 31, fat: 18, carbs: 27, kcal: 375 },
      { label: "Lunch", name: "160g haddock + 150g mixed salad + 22g olive oil", protein: 41, fat: 24, carbs: 5, kcal: 410 },
      { label: "Snack", name: "100g non-fat cheese + 100g celery sticks", protein: 14, fat: 1, carbs: 7, kcal: 86 },
      { label: "Dinner", name: "120g firm tofu + 100g smoked salmon + 30g olive oil + 60g avocado + 60g spinach", protein: 40, fat: 54, carbs: 10, kcal: 665 },
      { label: "Shake", name: "1 scoop whey (30g) + water", protein: 24, fat: 2, carbs: 3, kcal: 120 },
    ],
  },
  {
    id: "plan5",
    name: "Day 5",
    meals: [
      { label: "Breakfast", name: "2 whole eggs + 12g oats + 150ml almond milk + 12g almond butter", protein: 18, fat: 19, carbs: 12, kcal: 287 },
      { label: "Lunch", name: "180g prawns + 150g mixed salad + 22g olive oil + 60g avocado", protein: 47, fat: 34, carbs: 10, kcal: 499 },
      { label: "Snack", name: "80g edamame + 1 whole egg", protein: 15, fat: 9, carbs: 8, kcal: 169 },
      { label: "Dinner", name: "160g turkey mince + 40g brown rice + 120g broccoli + 20g olive oil", protein: 49, fat: 34, carbs: 18, kcal: 544 },
      { label: "Shake", name: "1 scoop whey (30g) + water", protein: 24, fat: 2, carbs: 3, kcal: 120 },
    ],
  },
  {
    id: "plan6",
    name: "Day 6",
    meals: [
      { label: "Breakfast", name: "180g 0% Greek yoghurt + 15g granola + 10g walnuts", protein: 21, fat: 9, carbs: 17, kcal: 235 },
      { label: "Lunch", name: "160g salmon fillet + 35g quinoa + 60g spinach + 10g olive oil", protein: 43, fat: 32, carbs: 10, kcal: 477 },
      { label: "Snack", name: "90g tinned tuna + 70g avocado", protein: 25, fat: 11, carbs: 6, kcal: 216 },
      { label: "Dinner", name: "145g beef steak + 40g sweet potato + 120g green beans + 26g olive oil", protein: 45, fat: 41, carbs: 16, kcal: 602 },
      { label: "Shake", name: "1 scoop whey (30g) + 200ml almond milk", protein: 25, fat: 4, carbs: 4, kcal: 150 },
    ],
  },
  {
    id: "plan7",
    name: "Day 7",
    meals: [
      { label: "Breakfast", name: "180g cottage cheese + 50g pineapple + 20g walnuts", protein: 22, fat: 24, carbs: 13, kcal: 343 },
      { label: "Lunch", name: "140g chicken breast + 30g chickpeas + 100g mixed salad + 24g olive oil", protein: 48, fat: 30, carbs: 11, kcal: 512 },
      { label: "Snack", name: "60g hummus + 60g carrot sticks", protein: 5, fat: 6, carbs: 13, kcal: 131 },
      { label: "Dinner", name: "170g pork tenderloin + 30g lentils + 120g broccoli + 29g olive oil", protein: 52, fat: 36, carbs: 14, kcal: 575 },
      { label: "Shake", name: "1 scoop whey (30g) + water", protein: 24, fat: 2, carbs: 3, kcal: 120 },
    ],
  },
  {
    id: "plan8",
    name: "Day 8",
    meals: [
      { label: "Breakfast", name: "2 whole eggs + 2 egg whites + 15g oats + 40g mixed berries", protein: 22, fat: 11, carbs: 16, kcal: 257 },
      { label: "Lunch", name: "170g turkey breast + 150g mixed salad + 20g olive oil", protein: 52, fat: 22, carbs: 5, kcal: 436 },
      { label: "Snack", name: "70g apple + 15g almond butter", protein: 3, fat: 8, carbs: 13, kcal: 129 },
      { label: "Dinner", name: "190g cod + 32g coconut oil + 120g avocado + 100g green beans", protein: 48, fat: 52, carbs: 18, kcal: 698 },
      { label: "Shake", name: "1 scoop whey (30g) + 200ml almond milk", protein: 25, fat: 4, carbs: 4, kcal: 150 },
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
