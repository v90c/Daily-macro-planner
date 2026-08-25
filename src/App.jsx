import React, { useState, useMemo } from "react";

const TARGETS = { protein: 150, fat: 100, carbs: 50, kcal: 1700 };

const MEALS = {
  breakfast: [
    { id: "b1", name: "Coconut flakes + protein powder + almond milk", protein: 23, fat: 24, carbs: 5, kcal: 320 },
    { id: "b2", name: "0% Greek yoghurt + mixed berries", protein: 16, fat: 1, carbs: 18, kcal: 145 },
    { id: "b3", name: "3 whole eggs + 2 egg whites, scrambled, spinach", protein: 27, fat: 15, carbs: 2, kcal: 260 },
    { id: "b4", name: "Protein powder + almond butter + almond milk, blended", protein: 24, fat: 22, carbs: 4, kcal: 300 },
    { id: "b5", name: "Non-fat Greek yoghurt + chia seeds", protein: 24, fat: 9, carbs: 5, kcal: 210 },
  ],
  lunch: [
    { id: "l1", name: "Chicken breast + mixed salad + olive oil", protein: 50, fat: 16, carbs: 10, kcal: 380 },
    { id: "l2", name: "Cod or haddock + mixed salad + olive oil", protein: 40, fat: 16, carbs: 10, kcal: 340 },
    { id: "l3", name: "Turkey breast + mixed salad + olive oil", protein: 46, fat: 15, carbs: 10, kcal: 350 },
    { id: "l4", name: "3 whole eggs + 2 egg whites + mixed salad + olive oil", protein: 27, fat: 25, carbs: 4, kcal: 340 },
    { id: "l5", name: "Firm tofu + mixed salad + sesame oil", protein: 20, fat: 20, carbs: 8, kcal: 290 },
    { id: "l6", name: "Smoked salmon + mixed salad + olive oil", protein: 20, fat: 20, carbs: 4, kcal: 280 },
  ],
  snack: [
    { id: "s1", name: "Cottage cheese + almonds", protein: 17, fat: 8, carbs: 6, kcal: 165 },
    { id: "s2", name: "Non-fat Greek yoghurt + walnuts", protein: 20, fat: 10, carbs: 8, kcal: 195 },
    { id: "s3", name: "2 hard-boiled eggs + almonds", protein: 15, fat: 12, carbs: 2, kcal: 175 },
    { id: "s4", name: "Non-fat cheese + celery sticks", protein: 20, fat: 4, carbs: 3, kcal: 130 },
  ],
  dinner: [
    { id: "d1", name: "Cod + olive oil + almonds + avocado + spinach", protein: 47, fat: 72, carbs: 13, kcal: 900 },
    { id: "d2", name: "Chicken thigh + olive oil + peanut butter + avocado + courgette", protein: 48, fat: 68, carbs: 15, kcal: 850 },
    { id: "d3", name: "Duck breast + olive oil + leafy greens + cauliflower", protein: 55, fat: 60, carbs: 12, kcal: 780 },
    { id: "d4", name: "Haddock + coconut oil + cashews + avocado + rocket", protein: 44, fat: 65, carbs: 12, kcal: 820 },
    { id: "d5", name: "Chicken breast + sesame oil + sesame seeds + mushroom + green beans", protein: 53, fat: 60, carbs: 12, kcal: 800 },
    { id: "d6", name: "Firm tofu + smoked salmon + olive oil + walnuts + spinach", protein: 40, fat: 70, carbs: 10, kcal: 790 },
  ],
  shake: [
    { id: "p1", name: "Whey + water", protein: 20, fat: 1.5, carbs: 2, kcal: 100 },
    { id: "p2", name: "Whey + almond milk", protein: 21, fat: 4, carbs: 3, kcal: 130 },
  ],
};

const CATEGORY_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
  shake: "Post-training shake",
};

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
  const [selected, setSelected] = useState({
    breakfast: null,
    lunch: null,
    snack: null,
    dinner: null,
    shake: null,
  });

  const totals = useMemo(() => {
    const t = { protein: 0, fat: 0, carbs: 0, kcal: 0 };
    Object.entries(selected).forEach(([cat, id]) => {
      if (!id) return;
      const item = MEALS[cat].find((m) => m.id === id);
      if (item) {
        t.protein += item.protein;
        t.fat += item.fat;
        t.carbs += item.carbs;
        t.kcal += item.kcal;
      }
    });
    return t;
  }, [selected]);

  const selectMeal = (cat, id) => {
    setSelected((prev) => ({ ...prev, [cat]: prev[cat] === id ? null : id }));
  };

  const reset = () => setSelected({ breakfast: null, lunch: null, snack: null, dinner: null, shake: null });

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
          Pick one option per meal slot. Totals update live against your daily targets.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 24,
            border: "1px solid #eee",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Today's totals</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#d61f2c" }}>{totals.kcal.toFixed(0)} kcal</span>
          </div>
          <MacroBar label="Protein" value={totals.protein} target={TARGETS.protein} unit="g" color="#d61f2c" />
          <MacroBar label="Fat" value={totals.fat} target={TARGETS.fat} unit="g" color="#2c3e50" />
          <MacroBar label="Carbs" value={totals.carbs} target={TARGETS.carbs} unit="g" color="#7f8c8d" />
        </div>

        {Object.keys(MEALS).map((cat) => (
          <div key={cat} style={{ marginBottom: 22 }}>
            <h2
              style={{
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#999",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {CATEGORY_LABELS[cat]}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MEALS[cat].map((item) => {
                const isSelected = selected[cat] === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => selectMeal(cat, item.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: isSelected ? "#111" : "#fff",
                      color: isSelected ? "#fff" : "#222",
                      border: isSelected ? "1px solid #111" : "1px solid #eaeaea",
                      borderRadius: 8,
                      padding: "10px 14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: isSelected ? 600 : 500, paddingRight: 12 }}>
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        whiteSpace: "nowrap",
                        color: isSelected ? "#ccc" : "#999",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      P{item.protein} F{item.fat} C{item.carbs} · {item.kcal}kcal
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
