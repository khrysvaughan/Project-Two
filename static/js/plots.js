// Submit Button handler- the name of the state is already in the dropdown or in the menu, 
// when we enter plot state button in the webpage
//it automatically calls that state.
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#stateInput");

    // Use the list of sample names to populate the select options
    d3.csv("/static/combinedData.csv").then(function (rows) {
            for (var i = 1; i < 51; i++) {

                selector
                    .append("option")
                    .text(rows[i].Label)
                    .property("value", rows[i].Label);
            }
        });
    }


    function handleSubmit() {
        // Prevent the page from refreshing
        d3.event.preventDefault();

        // Select the input value from the form
        var state = d3.select("#stateInput").node().value;
        console.log(state);

        // clear the input value
        d3.select("#stateInput").node().value = "";

        // Build the plot with the new state
        buildPlot(state);
    }

    // Add event listener for submit button
    d3.select("#submit").on("click", handleSubmit);


    //function buildplot expects an input value, which is an input parameter
    function buildPlot(state) {
        //original was ("combinedDummyData.csv")--only var and =var must be changed.
        d3.csv("/static/combinedData.csv").then(function (data) {
            // d3.json(url).then(function(data) {
            //we are getting the data from CSV and want to plot the dates in x axis , all other info in Y axis.
            var dates = getData(data, 'Dates');
            //it gets data for the state we have selected in function buildplot(state),where we are sending the paramenter.
            //we are getting the parameter from the function handlesubmit.
            var stateData = getData(data, state);
            var startDate = '1996';
            var endDate = '2018';
            var openingPrices = getData(data, 'Open');
            var highPrices = getData(data, 'High');
            var lowPrices = getData(data, 'Low');
            var closingPrices = getData(data, 'Close');
            var mortgageRate = getData(data, 'MortgageRate');

            var trace1 = {
                type: "scatter",
                mode: "lines",
                name: "MortgageRates",
                yaxis: 'y1',
                x: dates,
                y: mortgageRate,
                line: {
                    color: "#1f77b4"
                }
            };

            // Candlestick Trace
            var trace2 = {
                type: "candlestick",
                name: "DJI prices",
                x: dates,
                yaxis: 'y2',
                high: highPrices,
                low: lowPrices,
                open: openingPrices,
                close: closingPrices,
                line: {
                    color: "#ff7f0e"
                }
            };

            var trace3 = {
                type: "scatter",
                mode: "lines",
                name: "SinglefamilyHousepriceInfo",
                x: dates,
                y: stateData,
                yaxis: 'y3',
                line: {
                    color: "#d62728"
                }
            };

            // var data = [trace1, trace2];

            var chartData = [trace1, trace2, trace3];
            // var layout = {
            //     title: `${state} Mortage Interest & DJI & Single Family House price info`,
            //     xaxis: {
            //         domain: [startDate, endDate],
            //         type: "date"
            //     },
            //     yaxis1: {
            //         autorange: true,
            //         type: "linear",
            //         anchor: 'free',
            //         overlaying: 'y',
            //         side: 'left',
            //         position: 0.00
            //     },
            //     yaxis2: {
            //         autorange: true,
            //         type: "linear",
            //         anchor: 'free',
            //         overlaying: 'y',
            //         side: 'left',
            //         position: 0.85
            //     },
            //     yaxis3: {
            //         autorange: true,
            //         type: "linear",
            //         anchor: 'x',
            //         overlaying: 'y',
            //         side: 'right'
            //     }
            // };
            var layout = {
                title: `${state} Mortage Interest & DJI & Single Family House price info`,
                xaxis: {
                    domain: [0.3, 0.7]
                },
                yaxis: {
                    title: 'yaxis1 -Mortgage Rates',
                    titlefont: {
                        color: '#1f77b4'
                    },
                    tickfont: {
                        color: '#1f77b4'
                    }
                },
                yaxis2: {
                    title: 'yaxis2-DJI Prices',
                    titlefont: {
                        color: '#ff7f0e'
                    },
                    tickfont: {
                        color: '#ff7f0e'
                    },
                    anchor: 'free',
                    overlaying: 'y',
                    side: 'left',
                    position: 0.15
                },
                yaxis3: {
                    title: 'yaxis3 - Single Family House Price Info',
                    titlefont: {
                        color: '#d62728'
                    },
                    tickfont: {
                        color: '#d62728'
                    },
                    anchor: 'x',
                    overlaying: 'y',
                    side: 'right'
                }
            };
            Plotly.newPlot("plot", chartData, layout);
        });
    }

    function getData(rows, label) {
        var colData = [];
        for (var i = 0; i < rows.length; i++) {

            var object = rows[i];

            if (object.Label === label) {

                for (property in object) {
                    var value = object[property];
                    if (value !== label) {
                        colData.push(object[property]);
                    }

                }
            }
        }
        return colData;
    }
// Initialize the dashboard
init();
    ///see what is the concludingnotes: when mortgage rate goes up, usually stock market rate goes up. Housing values go down, when the interest rates go up.
    ///if the interest rate is high, peoples affordability goes down. So, they cannot afford to buy high value houses, because they need to pay huge interest every month.
    //Timeslider which is located at the bottom of the map- we can see intensively for different years.