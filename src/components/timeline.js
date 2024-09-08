// Create Year and Month Selectors
const yearSelector = document.createElement('select');
yearSelector.id = 'yearSelector';
const monthSelector = document.createElement('select');
monthSelector.id = 'monthSelector';

// Populate Year and Month Selectors
function populateSelectors(data) {
  const years = Array.from(new Set(data.map(d => d.year)));
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearSelector.appendChild(option);
  });

  months.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.text = month;
    monthSelector.appendChild(option);
  });

  document.body.prepend(monthSelector);
  document.body.prepend(yearSelector);
}

// Fetch and Filter Data
Promise.all([
  fetch('../data/health_activity_data.json').then(response => response.json()),
  fetch('../data/health_sport_data.json').then(response => response.json())
]).then(([healthActivityData, healthSportData]) => {
  populateSelectors(healthActivityData); // Populate selectors with initial data
  
  const filteredActivityData = filterData(healthActivityData);
  const filteredSportData = filterData(healthSportData);

  updateStepsDashboard(filteredActivityData);
  createStepsChart(filteredActivityData);
  updateDistanceDashboard(filteredSportData);
  createDistanceChart(filteredSportData);

  // Add Event Listeners for selectors
  yearSelector.addEventListener('change', () => updateVisualizations(healthActivityData, healthSportData));
  monthSelector.addEventListener('change', () => updateVisualizations(healthActivityData, healthSportData));
});

// Function to filter data based on the selected year and month
function filterData(data) {
  const selectedYear = parseInt(document.getElementById('yearSelector').value, 10);
  const selectedMonth = parseInt(document.getElementById('monthSelector').value, 10);
  return data.filter(d => d.year === selectedYear && d.month === selectedMonth);
}

// Update visualizations when selectors change
function updateVisualizations(healthActivityData, healthSportData) {
  const filteredActivityData = filterData(healthActivityData);
  const filteredSportData = filterData(healthSportData);

  updateStepsDashboard(filteredActivityData);
  updateDistanceDashboard(filteredSportData);
  createStepsChart(filteredActivityData);
  createDistanceChart(filteredSportData);
}

// Function to update steps dashboard
function updateStepsDashboard(data) {
  const totalSteps = d3.sum(data, d => d.step);
  const averageSteps = (totalSteps / data.length).toFixed(0);

  document.getElementById('totalSteps').innerText = `Total Pași: ${totalSteps}`;
  document.getElementById('averageSteps').innerText = `Pași Medii/zi: ${averageSteps}`;
}

// Function to update distance dashboard
function updateDistanceDashboard(data) {
  const totalDistance = d3.sum(data, d => d.total_distance);

  document.getElementById('totalDistance').innerText = `Distanță Totală: ${totalDistance} m`;
}

// Function to create Steps per Day Chart
function createStepsChart(data) {
  d3.select("#stepsChart").selectAll("*").remove(); // Clear previous chart
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const width = 1000;
  const height = 500;

  const svg = d3.select("#stepsChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font", "20px sans-serif");

  const x = d3.scaleBand()
    .domain(data.map(d => d.day))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.step)]).nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.selectAll("text").style("font-size", "20px"))
    .call(g => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("font-size", "24px")
      .text("Ziua"));

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.selectAll("text").style("font-size", "20px"))
    .call(g => g.append("text")
      .attr("x", -margin.left + 10)
      .attr("y", margin.top - 20)
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .attr("font-size", "24px")
      .text("Pași"));

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.day))
    .attr("y", d => y(d.step))
    .attr("height", d => y(0) - y(d.step))
    .attr("width", x.bandwidth())
    .attr("fill", "steelblue");

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);
}

// Function to create Distance Over Days Chart
function createDistanceChart(data) {
  d3.select("#distanceChart").selectAll("*").remove(); // Clear previous chart
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const width = 1000;
  const height = 500;

  const svg = d3.select("#distanceChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font", "20px sans-serif");

  const x = d3.scaleBand()
    .domain(data.map(d => d.day))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total_distance)]).nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.selectAll("text").style("font-size", "20px"))
    .call(g => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("font-size", "24px")
      .text("Ziua"));

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.selectAll("text").style("font-size", "20px"))
    .call(g => g.append("text")
      .attr("x", -margin.left + 10)
      .attr("y", margin.top - 20)
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .attr("font-size", "24px")
      .text("Distanță (m)"));

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.day))
    .attr("y", d => y(d.total_distance))
    .attr("height", d => y(0) - y(d.total_distance))
    .attr("width", x.bandwidth())
    .attr("fill", "steelblue");

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);
}
