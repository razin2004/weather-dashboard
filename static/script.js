/* util: fetch as JSON */
const jFetch = async (url) => (await fetch(url)).json();

let chart; // Chart.js instance

// Populate city list for first country at load
document.addEventListener('DOMContentLoaded', async () => {
  const countrySel = document.getElementById('country');
  const citySel    = document.getElementById('city');
  const loadBtn    = document.getElementById('loadBtn');

  // ------- helper to fill city dropdown -------
  const loadCities = async (country) => {
    const cities = await jFetch(`/cities?country=${encodeURIComponent(country)}`);
    citySel.innerHTML = cities.map(c => `<option>${c}</option>`).join('');
  };

  // initial city list
  await loadCities(countrySel.value);

  // update cities when country changes
  countrySel.addEventListener('change', () => loadCities(countrySel.value));

  // draw chart on button click
  loadBtn.addEventListener('click', () => drawChart(citySel.value));
  // draw initial
  drawChart(citySel.value);
});

/* draw / redraw the temperature line chart */
async function drawChart(city) {
  const data = await jFetch(`/data?city=${encodeURIComponent(city)}`);

  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy(); // destroy previous

  // blue gradient fill under line
  const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  g.addColorStop(0, 'rgba(0,106,255,0.4)');
  g.addColorStop(1, 'rgba(0,106,255,0.05)');

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: `Temperature (°C) — ${city}`,
        data: data.temps,
        borderColor:'#ffffff',          // white line for high contrast
        backgroundColor:g,
        tension:0.35,
        fill:true,
        pointRadius:4,
        pointBorderWidth:1,
        pointBackgroundColor:'#ffffff',
      }]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      scales:{
        x:{ticks:{color:'#000000'}, grid:{display:false}},
        y:{ticks:{color:'#000000'}, grid:{color:'rgba(0,0,0,1)'}}
      },
      plugins:{
        legend:{labels:{color:'#000000', font:{size:14}}},
        tooltip:{backgroundColor:'#0040a0'}
      }
    }
  });
}

