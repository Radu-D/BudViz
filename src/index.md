---
theme: dashboard
title: Vizualizare Date de Sănătate
toc: false
---

# Vizualizare Date de Sănătate

<!-- Year Selector -->
<div style="margin-bottom: 20px;">
  <button onclick="window.location.href = './year-2022'">2022</button>
  <button onclick="window.location.href = './year-2023'">2023</button>
  <button onclick="window.location.href = './year-2024'">2024</button>
</div>

## Statistici Generale

```js
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// Load the data files
const healthActivityData = await d3.json("https://raw.githubusercontent.com/Radu-D/budviz/main/src/data/health_activity_data.json");
const healthSportData = await d3.json("https://raw.githubusercontent.com/Radu-D/budviz/main/src/data/health_sport_data.json");

// Aggregate data by month and year
const monthlyActivityData = d3.rollups(
  healthActivityData,
  v => ({
    totalSteps: d3.sum(v, d => d.step),
    averageSteps: d3.mean(v, d => d.step)
  }),
  d => `${d.year}-${d.month}`
);

const monthlySportData = d3.rollups(
  healthSportData,
  v => ({
    totalDistance: d3.sum(v, d => d.total_distance),
    totalSteps: d3.sum(v, d => d.total_step_count)
  }),
  d => `${d.year}-${d.month}`
);

// Convert aggregated data into a flat array
const aggregatedActivityData = monthlyActivityData.map(([key, value]) => ({
  month: key,
  ...value
}));

const aggregatedSportData = monthlySportData.map(([key, value]) => ({
  month: key,
  ...value
}));

// Compute all-time statistics
const allTimeTotalSteps = d3.sum(aggregatedActivityData, d => d.totalSteps);
const allTimeAverageSteps = (allTimeTotalSteps / aggregatedActivityData.length).toFixed(0);
const allTimeTotalDistance = d3.sum(aggregatedSportData, d => d.totalDistance);
```

```html
<div class="grid grid-cols-3">
  <div class="card">
    <h2>Total Pași (Toate Timpurile)</h2>
    <span class="big">${allTimeTotalSteps.toLocaleString("fr-CA")}</span>
  </div>
  <div class="card">
    <h2>Pași Medii/Lună (Toate Timpurile)</h2>
    <span class="big">${allTimeAverageSteps.toLocaleString("fr-CA")}</span>
  </div>
  <div class="card">
    <h2>Distanță Totală (Toate Timpurile)</h2>
    <span class="big">${allTimeTotalDistance.toLocaleString("fr-CA")} m</span>
  </div>
</div>
```

```js
const allTimeStepsChart = Plot.plot({
  title: "Pași per Lună - Toate Timpurile",
  width: 1000,
  height: 600,
  marginBottom: 50,
  x: {
    domain: aggregatedActivityData.map(d => d.month),
    label: "Luna",
  },
  y: {
    grid: true,
    label: "Pași",
  },
  marks: [
    Plot.barY(aggregatedActivityData, { x: "month", y: "totalSteps", fill: "steelblue" }),
    Plot.line(aggregatedActivityData, { x: "month", y: "totalSteps", stroke: "red", strokeWidth: 2 }),
    Plot.dot(aggregatedActivityData, { x: "month", y: "totalSteps", fill: "red", r: 4 })
  ]
});
```

```html
<div class="grid grid-cols-1">
  <div class="card">
    ${allTimeStepsChart}
  </div>
</div>
```

```js
const allTimeStepsHistogram = Plot.plot({
  title: "Distribuția Pașilor per Lună (Toate Timpurile)",
  width: 1000,
  height: 600,
  y: { grid: true, label: "Frecvență" },
  x: { label: "Pași", grid: true },
  marks: [
    Plot.rectY(aggregatedActivityData, Plot.binX({ y: "count" }, { x: "totalSteps", fill: "green" })),
    Plot.ruleY([0])
  ]
});
```

```html
<div class="grid grid-cols-1">
  <div class="card">
    ${allTimeStepsHistogram}
  </div>
</div>
```

```js
const cumulativeAllTimeSteps = aggregatedActivityData.map((d, i) => ({
  month: d.month,
  cumulative: d3.sum(aggregatedActivityData.slice(0, i + 1), d => d.totalSteps)
}));

const allTimeCumulativeChart = Plot.plot({
  title: "Cumulativ Pași per Lună (Toate Timpurile)",
  width: 1000,
  height: 600,
  y: { grid: true, label: "Pași Cumulativi" },
  x: { label: "Luna", domain: cumulativeAllTimeSteps.map(d => d.month) },
  marks: [
    Plot.line(cumulativeAllTimeSteps, { x: "month", y: "cumulative", stroke: "orange", strokeWidth: 2 }),
    Plot.dot(cumulativeAllTimeSteps, { x: "month", y: "cumulative", fill: "orange", r: 4 })
  ]
});
```

```html
<div class="grid grid-cols-1">
  <div class="card">
    ${allTimeCumulativeChart}
  </div>
</div>
```

```js
const allTimeHeatmapChart = Plot.plot({
  title: "Intensitatea Pașilor per Lună (Toate Timpurile)",
  width: 1000,
  height: 600,
  x: { label: "Luna", domain: aggregatedActivityData.map(d => d.month) },
  color: { scheme: "reds" },
  marks: [
    Plot.cell(aggregatedActivityData, { x: "month", y: "averageSteps", fill: "totalSteps" })
  ]
});
```

```html
<div class="grid grid-cols-1">
  <div class="card">
    ${allTimeHeatmapChart}
  </div>
</div>
```
