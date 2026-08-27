import React, { useState, useMemo } from "react";

const TARGETS = { protein: 150, fat: 100, carbs: 50, kcal: 1700 };

// Nutrition per 100g unless the entry has a `unit` (grams per single unit, e.g. 1 egg, 1 scoop).
const INGREDIENTS = {
  chicken_breast: { p: 31, f: 3.6, c: 0, kcal: 165 },
  chicken_thigh: { p: 26, f: 11, c: 0, kcal: 180 },
  turkey_breast: { p: 29, f: 1, c: 0, kcal: 135 },
  turkey_mince: { p: 28, f: 8, c: 0, kcal: 176 },
  cod: { p: 23, f: 1, c: 0, kcal: 105 },
  haddock: { p: 24, f: 0.9, c: 0, kcal: 116 },
  duck_breast: { p: 19, f: 28, c: 0, kcal: 337 },
  salmon_fillet: { p: 25, f: 13, c: 0, kcal: 208 },
  smoked_salmon: { p: 18, f: 4.3, c: 0, kcal: 117 },
  tuna_canned: { p: 26, f: 0.8, c: 0, kcal: 116 },
  prawns: { p: 24, f: 1.4, c: 0.2, kcal: 99 },
  beef_steak: { p: 29, f: 10, c: 0, kcal: 207 },
  pork_tenderloin: { p: 27, f: 4, c: 0, kcal: 143 },
  firm_tofu: { p: 16, f: 9, c: 2, kcal: 144 },
  cottage_cheese: { p: 10.3, f: 6, c: 2.2, kcal: 104 },
  greek_yogurt_0: { p: 10, f: 0.2, c: 3.6, kcal: 55 },
  nonfat_cheese: { p: 13, f: 0.5, c: 4, kcal: 72 },
  olive_oil: { p: 0, f: 100, c: 0, kcal: 884 },
  coconut_oil: { p: 0, f: 100, c: 0, kcal: 862 },
  sesame_oil: { p: 0, f: 100, c: 0, kcal: 884 },
  peanut_butter: { p: 25, f: 50, c: 20, kcal: 588 },
  almond_butter: { p: 21, f: 55, c: 19, kcal: 614 },
  avocado: { p: 2, f: 15, c: 9, kcal: 160 },
  almonds: { p: 21, f: 49, c: 22, kcal: 579 },
  walnuts: { p: 15, f: 65, c: 14, kcal: 654 },
  chia_seeds: { p: 17, f: 31, c: 42, kcal: 486 },
  granola: { p: 10, f: 16, c: 64, kcal: 471 },
  almond_milk: { p: 0.6, f: 1.1, c: 0.3, kcal: 15 },
  mixed_salad: { p: 2, f: 0.3, c: 3, kcal: 20 },
  spinach: { p: 2.9, f: 0.4, c: 3.6, kcal: 23 },
  cauliflower: { p: 2, f: 0.3, c: 5, kcal: 25 },
  courgette: { p: 1.2, f: 0.3, c: 3.4, kcal: 17 },
  green_beans: { p: 1.8, f: 0.1, c: 7, kcal: 31 },
  celery: { p: 0.7, f: 0.2, c: 3, kcal: 14 },
  carrot: { p: 0.9, f: 0.2, c: 10, kcal: 41 },
  broccoli: { p: 2.8, f: 0.4, c: 7, kcal: 34 },
  mixed_berries: { p: 0.7, f: 0.3, c: 12, kcal: 52 },
  pineapple: { p: 0.5, f: 0.1, c: 13, kcal: 50 },
  apple: { p: 0.3, f: 0.2, c: 14, kcal: 52 },
  banana: { p: 1.1, f: 0.3, c: 23, kcal: 89 },
  oats: { p: 13, f: 7, c: 67, kcal: 389 },
  brown_rice: { p: 2.6, f: 0.9, c: 23, kcal: 112 },
  quinoa: { p: 4.4, f: 1.9, c: 21, kcal: 120 },
  sweet_potato: { p: 2, f: 0.1, c: 20, kcal: 86 },
  lentils: { p: 9, f: 0.4, c: 20, kcal: 116 },
  chickpeas: { p: 8.9, f: 2.6, c: 27, kcal: 164 },
  hummus: { p: 8, f: 10, c: 11, kcal: 177 },
  edamame: { p: 11, f: 5, c: 10, kcal: 121 },
  egg_whole: { unit: 50, p: 6.3, f: 4.8, c: 0.4, kcal: 72 },
  egg_white: { unit: 33, p: 3.6, f: 0, c: 0.2, kcal: 17 },
  whey: { unit: 30, p: 24, f: 1.5, c: 3, kcal: 120 },
  water: { p: 0, f: 0, c: 0, kcal: 0 },
};

const LIQUID_IDS = new Set(["almond_milk", "water"]);
const SCOOP_IDS = new Set(["whey"]);

function ingredientMacros(id, grams) {
  const d = INGREDIENTS[id];
  const n = d.unit ? grams / d.unit : grams / 100;
  return { p: d.p * n, f: d.f * n, c: d.c * n, kcal: d.kcal * n };
}

function itemMacros(ingredients, scale) {
  return ingredients.reduce(
    (t, ing) => {
      const m = ingredientMacros(ing.id, ing.grams * scale);
      return { p: t.p + m.p, f: t.f + m.f, c: t.c + m.c, kcal: t.kcal + m.kcal };
    },
    { p: 0, f: 0, c: 0, kcal: 0 }
  );
}

function formatIngredient(ing, scale) {
  const grams = Math.round((ing.grams * scale) / 5) * 5;
  if (SCOOP_IDS.has(ing.id)) {
    const scoops = Math.round((grams / 30) * 2) / 2;
    return `${scoops} scoop${scoops === 1 ? "" : "s"} ${ing.label} (${grams}g)`;
  }
  const unit = LIQUID_IDS.has(ing.id) ? "ml" : "g";
  return `${grams}${unit} ${ing.label}`;
}

function formatItemName(ingredients, scale) {
  return ingredients.map((ing) => formatIngredient(ing, scale)).join(" + ");
}

const MEAL_OPTIONS = {
  Breakfast: [
    { id: "b1", ingredients: [{ id: "greek_yogurt_0", grams: 150, label: "0% Greek yoghurt" }, { id: "whey", grams: 30, label: "whey" }] },
    { id: "b2", ingredients: [{ id: "greek_yogurt_0", grams: 200, label: "non-fat Greek yoghurt" }, { id: "chia_seeds", grams: 20, label: "chia seeds" }] },
    { id: "b3", ingredients: [{ id: "egg_whole", grams: 150, label: "whole eggs" }, { id: "egg_white", grams: 66, label: "egg whites" }, { id: "spinach", grams: 50, label: "spinach" }] },
    { id: "b4", ingredients: [{ id: "whey", grams: 30, label: "whey" }, { id: "almond_butter", grams: 25, label: "almond butter" }, { id: "almond_milk", grams: 200, label: "almond milk" }, { id: "banana", grams: 80, label: "banana" }] },
    { id: "b5", ingredients: [{ id: "egg_whole", grams: 100, label: "whole eggs" }, { id: "oats", grams: 12, label: "oats" }, { id: "almond_milk", grams: 150, label: "almond milk" }, { id: "almond_butter", grams: 12, label: "almond butter" }] },
    { id: "b6", ingredients: [{ id: "greek_yogurt_0", grams: 180, label: "0% Greek yoghurt" }, { id: "granola", grams: 15, label: "granola" }, { id: "walnuts", grams: 10, label: "walnuts" }] },
    { id: "b7", ingredients: [{ id: "cottage_cheese", grams: 180, label: "cottage cheese" }, { id: "pineapple", grams: 50, label: "pineapple" }, { id: "walnuts", grams: 20, label: "walnuts" }] },
    { id: "b8", ingredients: [{ id: "egg_whole", grams: 100, label: "whole eggs" }, { id: "egg_white", grams: 66, label: "egg whites" }, { id: "oats", grams: 15, label: "oats" }, { id: "mixed_berries", grams: 40, label: "mixed berries" }] },
  ],
  Lunch: [
    { id: "l1", ingredients: [{ id: "chicken_breast", grams: 100, label: "chicken breast" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 15, label: "olive oil" }] },
    { id: "l2", ingredients: [{ id: "turkey_breast", grams: 120, label: "turkey breast" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 20, label: "olive oil" }] },
    { id: "l3", ingredients: [{ id: "firm_tofu", grams: 260, label: "firm tofu" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "sesame_oil", grams: 6, label: "sesame oil" }] },
    { id: "l4", ingredients: [{ id: "haddock", grams: 160, label: "haddock" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 22, label: "olive oil" }] },
    { id: "l5", ingredients: [{ id: "prawns", grams: 180, label: "prawns" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 22, label: "olive oil" }, { id: "avocado", grams: 60, label: "avocado" }] },
    { id: "l6", ingredients: [{ id: "salmon_fillet", grams: 160, label: "salmon fillet" }, { id: "quinoa", grams: 35, label: "quinoa" }, { id: "spinach", grams: 60, label: "spinach" }, { id: "olive_oil", grams: 10, label: "olive oil" }] },
    { id: "l7", ingredients: [{ id: "chicken_breast", grams: 140, label: "chicken breast" }, { id: "chickpeas", grams: 30, label: "chickpeas" }, { id: "mixed_salad", grams: 100, label: "mixed salad" }, { id: "olive_oil", grams: 24, label: "olive oil" }] },
    { id: "l8", ingredients: [{ id: "turkey_breast", grams: 170, label: "turkey breast" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 20, label: "olive oil" }] },
  ],
  Snack: [
    { id: "s1", ingredients: [{ id: "cottage_cheese", grams: 120, label: "cottage cheese" }, { id: "walnuts", grams: 28, label: "walnuts" }, { id: "mixed_berries", grams: 80, label: "mixed berries" }] },
    { id: "s2", ingredients: [{ id: "cottage_cheese", grams: 150, label: "cottage cheese" }, { id: "almonds", grams: 30, label: "almonds" }] },
    { id: "s3", ingredients: [{ id: "egg_whole", grams: 100, label: "hard-boiled eggs" }, { id: "almonds", grams: 15, label: "almonds" }] },
    { id: "s4", ingredients: [{ id: "nonfat_cheese", grams: 100, label: "non-fat cheese" }, { id: "celery", grams: 100, label: "celery sticks" }] },
    { id: "s5", ingredients: [{ id: "edamame", grams: 80, label: "edamame" }, { id: "egg_whole", grams: 50, label: "whole egg" }] },
    { id: "s6", ingredients: [{ id: "tuna_canned", grams: 90, label: "tinned tuna" }, { id: "avocado", grams: 70, label: "avocado" }] },
    { id: "s7", ingredients: [{ id: "hummus", grams: 60, label: "hummus" }, { id: "carrot", grams: 60, label: "carrot sticks" }] },
    { id: "s8", ingredients: [{ id: "apple", grams: 70, label: "apple" }, { id: "almond_butter", grams: 15, label: "almond butter" }] },
  ],
  Dinner: [
    { id: "d1", ingredients: [{ id: "cod", grams: 160, label: "cod" }, { id: "olive_oil", grams: 24, label: "olive oil" }, { id: "avocado", grams: 150, label: "avocado" }] },
    { id: "d2", ingredients: [{ id: "chicken_thigh", grams: 170, label: "chicken thigh" }, { id: "peanut_butter", grams: 30, label: "peanut butter" }, { id: "courgette", grams: 150, label: "courgette" }, { id: "olive_oil", grams: 14, label: "olive oil" }] },
    { id: "d3", ingredients: [{ id: "duck_breast", grams: 135, label: "duck breast" }, { id: "cauliflower", grams: 100, label: "cauliflower" }, { id: "sweet_potato", grams: 120, label: "sweet potato" }] },
    { id: "d4", ingredients: [{ id: "firm_tofu", grams: 120, label: "firm tofu" }, { id: "smoked_salmon", grams: 100, label: "smoked salmon" }, { id: "olive_oil", grams: 30, label: "olive oil" }, { id: "avocado", grams: 60, label: "avocado" }, { id: "spinach", grams: 60, label: "spinach" }] },
    { id: "d5", ingredients: [{ id: "turkey_mince", grams: 160, label: "turkey mince" }, { id: "brown_rice", grams: 40, label: "brown rice" }, { id: "broccoli", grams: 120, label: "broccoli" }, { id: "olive_oil", grams: 20, label: "olive oil" }] },
    { id: "d6", ingredients: [{ id: "beef_steak", grams: 145, label: "beef steak" }, { id: "sweet_potato", grams: 40, label: "sweet potato" }, { id: "green_beans", grams: 120, label: "green beans" }, { id: "olive_oil", grams: 26, label: "olive oil" }] },
    { id: "d7", ingredients: [{ id: "pork_tenderloin", grams: 170, label: "pork tenderloin" }, { id: "lentils", grams: 30, label: "lentils" }, { id: "broccoli", grams: 120, label: "broccoli" }, { id: "olive_oil", grams: 29, label: "olive oil" }] },
    { id: "d8", ingredients: [{ id: "cod", grams: 190, label: "cod" }, { id: "coconut_oil", grams: 32, label: "coconut oil" }, { id: "avocado", grams: 120, label: "avocado" }, { id: "green_beans", grams: 100, label: "green beans" }] },
  ],
  Shake: [
    { id: "p1", ingredients: [{ id: "whey", grams: 30, label: "whey" }, { id: "almond_milk", grams: 200, label: "almond milk" }] },
    { id: "p2", ingredients: [{ id: "whey", grams: 30, label: "whey" }, { id: "water", grams: 250, label: "water" }] },
  ],
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

const CATEGORIES = ["Breakfast", "Lunch", "Snack", "Dinner", "Shake"];
const EMPTY_SELECTION = { Breakfast: null, Lunch: null, Snack: null, Dinner: null, Shake: null };

export default function MacroPlanner() {
  const [selected, setSelected] = useState(EMPTY_SELECTION);

  const totals = useMemo(() => {
    const t = { p: 0, f: 0, c: 0, kcal: 0 };
    for (const cat of CATEGORIES) {
      const sel = selected[cat];
      if (!sel) continue;
      const option = MEAL_OPTIONS[cat].find((o) => o.id === sel.optionId);
      if (!option) continue;
      const m = itemMacros(option.ingredients, sel.scale);
      t.p += m.p; t.f += m.f; t.c += m.c; t.kcal += m.kcal;
    }
    return t;
  }, [selected]);

  const selectOption = (cat, optionId) => {
    setSelected((prev) => {
      if (prev[cat] && prev[cat].optionId === optionId) {
        return { ...prev, [cat]: null };
      }
      return { ...prev, [cat]: { optionId, scale: 1 } };
    });
  };

  const setScale = (cat, scale) => {
    setSelected((prev) => ({ ...prev, [cat]: { ...prev[cat], scale } }));
  };

  const reset = () => setSelected(EMPTY_SELECTION);

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
          Pick any food for each meal, then use the portion slider to nudge the totals onto target.
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
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Today's totals</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#d61f2c" }}>{totals.kcal.toFixed(0)} kcal</span>
          </div>
          <MacroBar label="Protein" value={totals.p} target={TARGETS.protein} unit="g" color="#d61f2c" />
          <MacroBar label="Fat" value={totals.f} target={TARGETS.fat} unit="g" color="#2c3e50" />
          <MacroBar label="Carbs" value={totals.c} target={TARGETS.carbs} unit="g" color="#7f8c8d" />
        </div>

        {CATEGORIES.map((cat) => (
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
              {cat}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MEAL_OPTIONS[cat].map((option) => {
                const sel = selected[cat];
                const isSelected = sel && sel.optionId === option.id;
                const scale = isSelected ? sel.scale : 1;
                const m = itemMacros(option.ingredients, scale);
                return (
                  <div key={option.id}>
                    <div
                      onClick={() => selectOption(cat, option.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        minHeight: 44,
                        background: isSelected ? "#111" : "#fff",
                        color: isSelected ? "#fff" : "#222",
                        border: isSelected ? "2px solid #111" : "2px solid #eaeaea",
                        borderRadius: isSelected ? "10px 10px 0 0" : 10,
                        padding: "12px 16px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          flexShrink: 0,
                          borderRadius: "50%",
                          border: isSelected ? "none" : "2px solid #ccc",
                          background: isSelected ? "#d61f2c" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "#fff",
                        }}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: isSelected ? 600 : 500, flex: 1 }}>
                        {formatItemName(option.ingredients, scale)}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          color: isSelected ? "#ccc" : "#999",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        P{m.p.toFixed(0)} F{m.f.toFixed(0)} C{m.c.toFixed(0)} · {m.kcal.toFixed(0)}kcal
                      </span>
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          background: "#1c1c1c",
                          borderRadius: "0 0 10px 10px",
                          padding: "10px 16px 14px",
                          border: "2px solid #111",
                          borderTop: "none",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginBottom: 4 }}>
                          <span>Portion</span>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(scale * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={150}
                          step={5}
                          value={Math.round(scale * 100)}
                          onChange={(e) => setScale(cat, Number(e.target.value) / 100)}
                          style={{ width: "100%", accentColor: "#d61f2c" }}
                        />
                      </div>
                    )}
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
