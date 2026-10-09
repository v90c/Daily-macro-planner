import React, { useState, useMemo } from "react";

const TARGETS = { protein: 150, fat: 100, carbs: 50, kcal: 1700 };

// A small, reusable pantry - the same ~19 items get bought every week,
// just combined differently. Nutrition per 100g unless the entry has a
// `unit` (grams per single unit, e.g. 1 egg, 1 scoop).
const INGREDIENTS = {
  chicken_breast: { p: 31, f: 3.6, c: 0, kcal: 165 },
  cod: { p: 23, f: 1, c: 0, kcal: 105 },
  firm_tofu: { p: 16, f: 9, c: 2, kcal: 144 },
  greek_yogurt_0: { p: 10, f: 0.2, c: 3.6, kcal: 55 },
  cottage_cheese: { p: 10.3, f: 6, c: 2.2, kcal: 104 },
  olive_oil: { p: 0, f: 100, c: 0, kcal: 884 },
  avocado: { p: 2, f: 15, c: 9, kcal: 160 },
  almonds: { p: 21, f: 49, c: 22, kcal: 579 },
  mixed_salad: { p: 2, f: 0.3, c: 3, kcal: 20 },
  spinach: { p: 2.9, f: 0.4, c: 3.6, kcal: 23 },
  broccoli: { p: 2.8, f: 0.4, c: 7, kcal: 34 },
  green_beans: { p: 1.8, f: 0.1, c: 7, kcal: 31 },
  sweet_potato: { p: 2, f: 0.1, c: 20, kcal: 86 },
  mixed_berries: { p: 0.7, f: 0.3, c: 12, kcal: 52 },
  oats: { p: 13, f: 7, c: 67, kcal: 389 },
  almond_milk: { p: 0.6, f: 1.1, c: 0.3, kcal: 15 },
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

// Just 17 recipes total (vs 34 before), every one built from the same
// 19-item pantry above, reused across the week rather than one-off buys.
const MEAL_OPTIONS = {
  Breakfast: [
    { id: "B1", ingredients: [{ id: "greek_yogurt_0", grams: 150, label: "Greek yoghurt" }, { id: "whey", grams: 30, label: "whey" }] },
    { id: "B2", ingredients: [{ id: "greek_yogurt_0", grams: 200, label: "Greek yoghurt" }, { id: "mixed_berries", grams: 100, label: "mixed berries" }] },
    { id: "B3", ingredients: [{ id: "egg_whole", grams: 150, label: "whole eggs" }, { id: "egg_white", grams: 66, label: "egg whites" }, { id: "spinach", grams: 50, label: "spinach" }] },
    { id: "B4", ingredients: [{ id: "oats", grams: 40, label: "oats" }, { id: "whey", grams: 30, label: "whey" }, { id: "almond_milk", grams: 200, label: "almond milk" }, { id: "mixed_berries", grams: 50, label: "mixed berries" }] },
  ],
  Lunch: [
    { id: "L1", ingredients: [{ id: "chicken_breast", grams: 120, label: "chicken breast" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 18, label: "olive oil" }] },
    { id: "L2", ingredients: [{ id: "cod", grams: 170, label: "cod" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 20, label: "olive oil" }] },
    { id: "L3", ingredients: [{ id: "firm_tofu", grams: 200, label: "firm tofu" }, { id: "mixed_salad", grams: 150, label: "mixed salad" }, { id: "olive_oil", grams: 14, label: "olive oil" }] },
  ],
  Snack: [
    { id: "S1", ingredients: [{ id: "cottage_cheese", grams: 150, label: "cottage cheese" }, { id: "almonds", grams: 20, label: "almonds" }] },
    { id: "S2", ingredients: [{ id: "egg_whole", grams: 100, label: "hard-boiled eggs" }, { id: "almonds", grams: 15, label: "almonds" }] },
    { id: "S3", ingredients: [{ id: "greek_yogurt_0", grams: 150, label: "Greek yoghurt" }, { id: "mixed_berries", grams: 50, label: "mixed berries" }] },
    { id: "S4", ingredients: [{ id: "cottage_cheese", grams: 120, label: "cottage cheese" }, { id: "mixed_berries", grams: 60, label: "mixed berries" }] },
  ],
  Dinner: [
    { id: "D1", ingredients: [{ id: "chicken_breast", grams: 150, label: "chicken breast" }, { id: "olive_oil", grams: 24, label: "olive oil" }, { id: "avocado", grams: 130, label: "avocado" }, { id: "broccoli", grams: 120, label: "broccoli" }] },
    { id: "D2", ingredients: [{ id: "cod", grams: 170, label: "cod" }, { id: "olive_oil", grams: 26, label: "olive oil" }, { id: "avocado", grams: 140, label: "avocado" }, { id: "green_beans", grams: 120, label: "green beans" }] },
    { id: "D3", ingredients: [{ id: "firm_tofu", grams: 210, label: "firm tofu" }, { id: "olive_oil", grams: 22, label: "olive oil" }, { id: "avocado", grams: 130, label: "avocado" }, { id: "spinach", grams: 80, label: "spinach" }] },
    { id: "D4", ingredients: [{ id: "chicken_breast", grams: 140, label: "chicken breast" }, { id: "olive_oil", grams: 20, label: "olive oil" }, { id: "sweet_potato", grams: 120, label: "sweet potato" }, { id: "green_beans", grams: 120, label: "green beans" }] },
  ],
  Shake: [
    { id: "P1", ingredients: [{ id: "whey", grams: 30, label: "whey" }, { id: "almond_milk", grams: 200, label: "almond milk" }] },
    { id: "P2", ingredients: [{ id: "whey", grams: 30, label: "whey" }, { id: "water", grams: 250, label: "water" }] },
  ],
};

const CATEGORIES = ["Breakfast", "Lunch", "Snack", "Dinner", "Shake"];

// Each day reuses the same 17 recipes above (repeats are expected and
// intentional - same shop, same prep, different pairing) with a small
// portion adjustment per slot so the day lands close to target.
const CURATED_DAYS = [
  { id: "day1", name: "Day 1", slots: { Breakfast: ["B1", 1], Lunch: ["L2", 0.85], Snack: ["S1", 1], Dinner: ["D1", 1.0], Shake: ["P1", 1] } },
  { id: "day2", name: "Day 2", slots: { Breakfast: ["B2", 1], Lunch: ["L1", 1], Snack: ["S2", 1], Dinner: ["D2", 1.12], Shake: ["P2", 1] } },
  { id: "day3", name: "Day 3", slots: { Breakfast: ["B3", 1], Lunch: ["L3", 0.9], Snack: ["S1", 0.9], Dinner: ["D1", 0.85], Shake: ["P1", 1] } },
  { id: "day4", name: "Day 4", slots: { Breakfast: ["B4", 0.65], Lunch: ["L2", 1], Snack: ["S4", 0.85], Dinner: ["D3", 1], Shake: ["P2", 1] } },
  { id: "day5", name: "Day 5", slots: { Breakfast: ["B1", 0.9], Lunch: ["L1", 1], Snack: ["S2", 1], Dinner: ["D2", 1.05], Shake: ["P2", 1] } },
  { id: "day6", name: "Day 6", slots: { Breakfast: ["B2", 0.85], Lunch: ["L3", 1], Snack: ["S3", 0.8], Dinner: ["D1", 1.1], Shake: ["P1", 1] } },
  { id: "day7", name: "Day 7", slots: { Breakfast: ["B3", 1], Lunch: ["L2", 1.05], Snack: ["S4", 0.9], Dinner: ["D4", 1.25], Shake: ["P2", 1] } },
  { id: "day8", name: "Day 8", slots: { Breakfast: ["B4", 0.7], Lunch: ["L1", 1.15], Snack: ["S1", 1], Dinner: ["D3", 0.88], Shake: ["P1", 1] } },
];

function findOption(cat, id) {
  return MEAL_OPTIONS[cat].find((o) => o.id === id);
}

function configTotals(config) {
  const t = { p: 0, f: 0, c: 0, kcal: 0 };
  for (const cat of CATEGORIES) {
    const slot = config[cat];
    if (!slot) continue;
    const option = findOption(cat, slot.optionId);
    const m = itemMacros(option.ingredients, slot.scale);
    t.p += m.p; t.f += m.f; t.c += m.c; t.kcal += m.kcal;
  }
  return t;
}

function configFromDay(day) {
  const config = {};
  for (const cat of CATEGORIES) {
    const [optionId, scale] = day.slots[cat];
    config[cat] = { optionId, scale };
  }
  return config;
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
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [config, setConfig] = useState(null);
  const [swapOpenCat, setSwapOpenCat] = useState(null);

  const totals = useMemo(() => (config ? configTotals(config) : { p: 0, f: 0, c: 0, kcal: 0 }), [config]);

  const selectDay = (day) => {
    if (selectedDayId === day.id) {
      setSelectedDayId(null);
      setConfig(null);
      setSwapOpenCat(null);
      return;
    }
    setSelectedDayId(day.id);
    setConfig(configFromDay(day));
    setSwapOpenCat(null);
  };

  const swapMeal = (cat, newOptionId) => {
    setConfig((prev) => {
      const prevSlot = prev[cat];
      const prevOption = findOption(cat, prevSlot.optionId);
      const prevKcal = itemMacros(prevOption.ingredients, prevSlot.scale).kcal;
      const newOption = findOption(cat, newOptionId);
      const newBaseKcal = itemMacros(newOption.ingredients, 1).kcal;
      let scale = newBaseKcal > 0 ? prevKcal / newBaseKcal : 1;
      scale = Math.max(0.5, Math.min(2, scale));
      return { ...prev, [cat]: { optionId: newOptionId, scale } };
    });
    setSwapOpenCat(null);
  };

  const reset = () => {
    setSelectedDayId(null);
    setConfig(null);
    setSwapOpenCat(null);
  };

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
          Pick a day below. Every recipe is built from the same ~19-item shopping list, repeated across the week.
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
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>
              {selectedDayId ? `${CURATED_DAYS.find((d) => d.id === selectedDayId).name} — today's totals` : "Today's totals"}
            </span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#d61f2c" }}>{totals.kcal.toFixed(0)} kcal</span>
          </div>
          <MacroBar label="Protein" value={totals.p} target={TARGETS.protein} unit="g" color="#d61f2c" />
          <MacroBar label="Fat" value={totals.f} target={TARGETS.fat} unit="g" color="#2c3e50" />
          <MacroBar label="Carbs" value={totals.c} target={TARGETS.carbs} unit="g" color="#7f8c8d" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CURATED_DAYS.map((day) => {
            const isSelected = selectedDayId === day.id;
            const baseConfig = configFromDay(day);
            const baseTotals = configTotals(baseConfig);

            return (
              <div
                key={day.id}
                style={{
                  background: isSelected ? "#111" : "#fff",
                  color: isSelected ? "#fff" : "#222",
                  border: isSelected ? "2px solid #111" : "2px solid #eaeaea",
                  borderRadius: 12,
                  padding: "14px 16px",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  onClick={() => selectDay(day)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{day.name}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontVariantNumeric: "tabular-nums",
                      color: isSelected ? "#ccc" : "#888",
                    }}
                  >
                    P{baseTotals.p.toFixed(0)} · F{baseTotals.f.toFixed(0)} · C{baseTotals.c.toFixed(0)} · {baseTotals.kcal.toFixed(0)}kcal
                  </span>
                </div>

                {isSelected && (
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {CATEGORIES.map((cat) => {
                      const slot = config[cat];
                      const option = findOption(cat, slot.optionId);
                      const m = itemMacros(option.ingredients, slot.scale);
                      const swapOpen = swapOpenCat === cat;
                      return (
                        <div key={cat} style={{ background: "#1c1c1c", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                                {cat}
                              </div>
                              <div style={{ fontSize: 13.5 }}>{formatItemName(option.ingredients, slot.scale)}</div>
                            </div>
                            <span style={{ fontSize: 11.5, color: "#999", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                              {m.kcal.toFixed(0)}kcal
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSwapOpenCat(swapOpen ? null : cat);
                            }}
                            style={{
                              marginTop: 8,
                              background: "none",
                              border: "1px solid #444",
                              color: "#ccc",
                              fontSize: 11,
                              borderRadius: 6,
                              padding: "4px 10px",
                              cursor: "pointer",
                            }}
                          >
                            {swapOpen ? "Cancel" : "Swap"}
                          </button>
                          {swapOpen && (
                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                              {MEAL_OPTIONS[cat]
                                .filter((o) => o.id !== slot.optionId)
                                .map((o) => {
                                  const altKcal = itemMacros(o.ingredients, 1).kcal;
                                  return (
                                    <div
                                      key={o.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        swapMeal(cat, o.id);
                                      }}
                                      style={{
                                        background: "#2a2a2a",
                                        borderRadius: 6,
                                        padding: "8px 10px",
                                        fontSize: 12.5,
                                        color: "#ddd",
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 10,
                                      }}
                                    >
                                      <span>{formatItemName(o.ingredients, 1)}</span>
                                      <span style={{ color: "#888", whiteSpace: "nowrap" }}>{altKcal.toFixed(0)}kcal</span>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
