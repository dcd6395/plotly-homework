function buildMetadata(sample) {

  let url = `/metadata/${sample}`;

  d3.json(url).then(function (sampleData) {
    //console.log(sampleData);

    var sample_metadata = d3.select("#sample-metadata");
    //sample_metadata.html("");
    Object.entries(sampleData).forEach(([key, value]) => {
      sample_metadata.append('p').text(`${key}, ${value}`);
    });

  })
};

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function (data) {
    //console.log(data);
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: 'Earth'
      }
    };
    var data = [trace1]

    var bubbleLayout = [{
      margin: { t: 0 },
      hovermode: 'closest',
    }];

    Plotly.newPlot('bubble', data, bubbleLayout);

    d3.json(`/samples/${sample}`).then(function (Data) {

      var pieData = [{
        values: data.sample_values.slice(0, 10),
        labels: data.otu_ids.slice(0, 10),
        hovertext: data.otu_labels.slice(0, 10),
        type: 'pie'
      }];

      Plotly.newPlot('pie', pieData);
    });
  });

}

function init() {
  let selector = d3.select("#selDataset");
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();