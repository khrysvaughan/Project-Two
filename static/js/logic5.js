

var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);


var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
"35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function getColor(d) {
    
    if (d  > 800000.00) {
         return 'seagreen';
    } else if ( d > 700000.00 ){
        return 'orange';
    } else if (d > 600000.00) {
        return 'red' ;
    } else if (d > 500000.00) {
         return 'brown' ;
    } else if (d > 400000.00) {
        return 'lavender'; 
    } else if (d > 300000.00) {
       return 'yellow'; 
    } else if (d > 150000.00) {
        return 'pink';
    } else if (d > 100000.00) {
        return 'aqua';
    } else if (d > 50000.00) {
        return 'coral';
    } else {
       return 'slategrey';
    }   
}
var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0,50000,100000,150000,300000,400000,500000,600000,700000,800000],
			labels = [],
			from, to;
		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];
			labels.push(
				'<div style="display:inline-block;height:10px;width:10px;background-color:' + getColor(from + 1) + '"> </div> ' +
				from + (to ? '&ndash;' + to : '+'));
		}
		div.innerHTML = labels.join('<br>');
		return div;
	}
	legend.addTo(map);

// var mortgagedata = []; 
// mortgagedata = d3.csv("static/js/year.csv");
// filterdata(mortgagedata);

d3.csv("/static/year.csv",function(mortdata){
//    console.log(mortdata);
    filterdata(mortdata);
});
    //console.log(mortgagedata);
function filterdata(mortgagedata) {
    // processes i/p data - (a) get right year  
    for (var i = 0; i < mortgagedata.length; i++) {
        var yearvalue = mortgagedata[i].Year;
        //console.log(yearvalue);
        if (yearvalue == "2018"){
         var avgincome = mortgagedata[i];
        // console.log(avgincome);
        // Sort mortgagedata by state
         var ordered = {};
         Object.keys(avgincome).sort().forEach(function(key) {
            ordered[key] = avgincome[key];
            //console.log(ordered);
          });
        // (b) get each state's median house price  
         for (var j = 0; j < statesData.features.length; j++) {
            var location = statesData.features[j].properties.name;
            var stateDtls = statesData.features[j];
            var place = statesData.features[j].geometry;
            //console.log(location);
            if (Object.keys(ordered)[j] !=  "DJI_Close" || "DJI_High" || "DJI_Low" || "DJI_Open" || "Year"
                && (location === Object.keys(ordered)[j])) {
                    var medhouseprice = Math.round(Object.values(ordered)[j]);
                    medhouseprice = +medhouseprice;
                    //var fcolor = getColor(medhouseprice);
                //console.log(location + " " + medhouseprice + " " + fcolor);
                
                    //   // Creating a geoJSON layer with the retrieved data
                L.geoJson(stateDtls, {
                    // Style each feature (in this case a neighborhood)
                    style: function(feature) {
                    return {
                        color: "white",
                        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
                        fillColor: getColor(medhouseprice),
                        fillOpacity: 0.5,
                        weight: 1.5
                    };
                    },
                    // Called on each feature
                    onEachFeature: function(feature, layer) {
                    // Set mouse events to change map styling
                    layer.on({
                        // When a user's mouse touches a map feature, the mouseover event calls this function, 
                        //that feature's opacity changes to 90% so that it stands out
                        mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.9
                        });
                        },
                        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                        mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                        },
                        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                        click: function(event) {
                        map.fitBounds(event.target.getBounds());
                        }
                    });
                    // Giving each feature a pop-up with information pertinent to it
                    layer.bindPopup("<h1>" + feature.properties.name + "</h1> <hr> <h2>"+"Average House price" +" </h2> <hr> <h3>" +"$"+ medhouseprice.toLocaleString() + "</h3>");
                    
                    }
                }).addTo(map);
            }
        }
    }
}
}