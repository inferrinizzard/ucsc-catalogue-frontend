const Plotly = require('plotly.js/lib/core');

// Load in the trace types for pie, and choropleth
Plotly.register([require('plotly.js/lib/scatter.js')]);

export default Plotly;
