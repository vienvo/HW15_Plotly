// Global sample selection
let sample = document.getElementById('selDataset').value;

// Build Metadata Panel
function buildMetadata(sample) {

    // Retrieve data from selection
    d3.select("#sample-metadata").html("")
    let sample_url = `/metadata/${sample}`;
    d3.json(sample_url).then(function(response) {

      // Select Data
      let data = [response];
      let age = data[0].AGE;
      let bbtype = data[0].BBTYPE;
      let ethnicity = data[0].ETHNICITY;
      let gender = data[0].GENDER;
      let location = data[0].LOCATION;
      let wfreq = data[0].WFREQ;
      let sample_id = data[0].sample;
      
      // Display Data to Sample Metadata Panel
      let tagP = d3.select("#sample-metadata");
      tagP.append("p").text(`AGE: ${age}`);
      tagP.append("p").text(`BBTYPE: ${bbtype}`);
      tagP.append("p").text(`ETHNICITY: ${ethnicity}`);
      tagP.append("p").text(`GENDER: ${gender}`);
      tagP.append("p").text(`LOCATION: ${location}`);
      tagP.append("p").text(`WFREQ: ${wfreq}`);
      tagP.append("p").text(`Sample: ${sample_id}`);
    });
}

// Build Charts
function buildCharts(sample) {

  // Fetch the sample data for the plots
  d3.json(`samples/${sample}`).then(function(d) {

    //Build bubbly chart
    var traceBubble = {
      x: d.otu_ids,
      y: d.sample_values,
      text: d.otu_labels,

      mode: 'markers',
      marker: {
        size: d.sample_values,
        color: d.otu_ids,
        colorscale: [[0, 'green'], [1, 'red']],
        showscale: true,
        colorbar: {
          thickness: 15,
          y: 0.5,
          ypad: 0,
          title: 'OTU ID',
          titleside: 'top'
        },
        sizeref: 0.1,
        sizemode: 'area'
      },
    };

    var layoutBuble = {
      xaxis: {title:'OTU ID'},
      yaxis: {title: 'Number of Sequences Found'}
    };

    var data_bubble = [traceBubble];
    Plotly.newPlot('bubble', data_bubble, layoutBuble);
 
    //Build pie chart
    var tracePie = {
      values: d.sample_values.slice(0,10),
      labels: d.otu_ids.slice(0,10),
      hovertext: d.otu_labels,
      type: 'pie'
    };

    var dataPie = [tracePie];

    Plotly.newPlot('pie', dataPie);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
