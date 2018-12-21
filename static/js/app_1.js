  function displayAlldata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata');
    panel.html("");
    console.log(sample);
    // d3.json(`/metadata/${sample}`).then(function(metadata){
    d3.json(`/yearly`).then(function(metadata){
     
      console.log(metadata);
      console.log(sample);
      //  var sample=[]; 
      // var  wfreq = +metadata.WFREQ;
      // console.log(wfreq)
      //  metadata.forEach(d = {
        var yeardata=[];
        var mortgagedata=[];
        var dijdata=[];
        var housepricingdata=[];
        
        metadata.forEach(d => {          
        // Object.entries(metadata).map(([key,value]) => {
            var year=+d.Year;
            yeardata.push(year);
            var mortgage=+d.mortRate;
            mortgagedata.push(mortgage);
            var dij=+d.DJI_Close;
            dijdata.push(dij);
            //   console.log(sample);
            var housepricing=d[sample];  
            housepricingdata.push(housepricing);

            //   console.log(housepricing);
          
              panel.append('h6').html(``);
              // .text(`${key}:  ${value}`)    
            //   .html(`${year},housepricing:${housepricing},mortRate:${mortgage},dij:${dij}`); 
        // })
             
        })
        buildCharts(sample,yeardata,mortgagedata,housepricingdata,dijdata);
        console.log('hi');
    })
  }

  function displayHousingprice() {
    var panel = d3.select('#sample-metadata');
    panel.html("");
    d3.json(`/housing`).then(function(metadata){     
        // console.log(metadata);
        metadata.forEach(d => {          
            // Object.entries(metadata).map(([key,value]) => {
              var state=d.State;
              panel.append('h6')
              // .text(`${key}:  ${value}`)    
              .html(`${state}`); 

            // })
            })
        })
  }

  function buildCharts(sample,yeardata,mortgagedata,housepricingdata,dijdata) {
    console.log('hi');
    var trace_bubble1={
        x:yeardata,
        y:housepricingdata, 
        xaxis:'x1',   
        // yaxis:"y1",  
        marker: {
          size:mortgagedata,
        //   housepricingdata/dijdata,          
          color:'orange',
        //   colorscale='Viridis',
          sizeref: 1,   
          // https://plot.ly/python/bubble-charts/
        // marker:{
        // color:'pink',
        // size:50,
        opacity:1},     
        mode:'markers'
        // text:
        // text:`housepricing:${housepricingdata},mortRate:${mortgagedata},dij:${dijdata}`
      };
// console.log(housepricingdata);
      var trace_bubble2={
        x:dijdata,
        y:housepricingdata,  
        xaxis:'x2',
        // yaxis:"y2",
        marker: {
          size:dijdata/500,
        //   housepricingdata/dijdata,          
          color:'blue',
        //   colorscale='Viridis',
          sizeref: 1,   
          // https://plot.ly/python/bubble-charts/
        // marker:{
        // color:'pink',
        // size:50,
        opacity:1},     
        mode:'markers'};

        var bubble3={
            x:mortgagedata,
            y:housepricingdata,
            xaxis:'x3',
            // yaxis:'y3'
            name:'housepricing $MortR',
            mode:'markers',
            size:mortgagedata,
            marker:{
                sizeref:0.5}
            };
     

    data_bubble=[trace_bubble1,trace_bubble2,bubble3];
    var layout  ={
        title:`${sample} HousingPricing $ Mortgage rate $ DJI`,
        xaxis1:{
        //  scaleanchor: "y1",
          title:'Year',
          nticks: 10,
          domain: [0, 0.3],
          autorange:true,
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'}
        },
        xaxis2:{
            scaleanchor: "x2",
            title:'DJI',
            nticks: 10,
            domain: [0.33, 0.63],
            autorange:true,
            titlefont: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'}
          },
          xaxis3:{
            scaleanchor: "x3",
            title:'Mortgage Rate',
            nticks: 10,
            domain: [0.64, 1],
            autorange:true,
            titlefont: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'}
          },
        yaxis1:{
        //   scaleanchor: "x1",
          title:'HousingPricing',
          autorange:true,    
          domain: [0, 1],
        // }, 
        //   yaxis2: {
        //     // scaleanchor: "x2",
        //     title:'HousingPricing',
        //     autorange:true, 
        //     // scaleratio: 0.2,
        //     domain: [0.55,1],
         
      },
      showlegend: false
    };
      Plotly.newPlot('bubble',data_bubble,layout,{responsive:true});
} 

  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/housing").then((sampleNames) => {
      // console.log(sampleNames);
      sampleNames.forEach((sample) => {
    //   var selectState=sample.State;
    //   console.log(selectState);
        selector
          .append("option")
          .text(sample.State)
          .property("value", sample.State)
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0].State;
    //   var selectors=d3.event.target;
    //   console.log(selectors);
      displayAlldata(firstSample);
    //   buildCharts(firstSample);
    //   buildMetadata(firstSample);
    });
  };

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    // buildCharts(newSample);
    displayAlldata(newSample);
  }
  init();
//   displayHousingprice()
