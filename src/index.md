---
theme: dashboard
title: Vizualizare Date de Sănătate
toc: false
---

# Vizualizare Date de Sănătate

```js
import {Plot} from "@observablehq/plot";
import * as d3 from "d3";

// Load the data files
const healthActivityData = await d3.json("https://raw.githubusercontent.com/Radu-D/budviz/main/src/data/health_activity_data.json");
const healthSportData = await d3.json("https://raw.githubusercontent.com/Radu-D/budviz/main/src/data/health_sport_data.json");

// Clean and filter the data
const cleanedActivityData = healthActivityData.filter(d => d.step > 0);
const cleanedSportData = healthSportData.filter(d => d.total_step_count > 0);

// Compute summary statistics
const totalSteps = d3.sum(cleanedActivityData, d => d.step);
const averageSteps = (totalSteps / cleanedActivityData.length).toFixed(0);
const totalDistance = d3.sum(cleanedSportData, d => d.total_distance);
```

<!-- Dashboard cards with summary metrics -->

```html
<div class="grid grid-cols-3">
  <div class="card">
    <h2>Total Pași</h2>
    <span class="big">${totalSteps.toLocaleString("ro-RO")}</span>
  </div>
  <div class="card">
    <h2>Pași Medii/zi</h2>
    <span class="big">${averageSteps.toLocaleString("ro-RO")}</span>
  </div>
  <div class="card">
    <h2>Distanță Totală</h2>
    <span class="big">${totalDistance.toLocaleString("ro-RO")} m</span>
  </div>
</div>
```

```js
// Visualization for Steps per Day
const stepsChart = Plot.plot({
  title: "Pași pe Zi",
  height: 400,
  y: {grid: true, label: "Pași"},
  color: {scheme: "blues"},
  marks: [
    Plot.barY(cleanedActivityData, {x: "day", y: "step", tip: true, fill: "steelblue"})
  ]
});
```

```html
<div class="grid grid-cols-1">
  <div class="card">
    ${stepsChart}
  </div>
</div>
```

```js
// Visualization for Distance per Day
const distanceChart = Plot.plot({
  title: "Distanță Totală pe Zi",
  height: 400,
  y: {grid: true, label: "Distanță (m)"},
  color: {scheme: "greens"},
  marks: [
    Plot.barY(cleanedSportData, {x: "day", y: "total_distance", tip: true, fill: "green"})
  ]
});
```

```html
<div class="grid grid-cols-1">
  <div class="card">
    ${distanceChart}
  </div>
</div>
```
