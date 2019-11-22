
// Creating our initial map object with center locale of Los Angelas
const myMap = L.map("map", {
    center: [34.05, -118.24],
    zoom: 4
});


// Adding a tile layer (the background map image) to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);

// URL for the week's earthquake data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function circleColor(magnitude) {
    if (magnitude <= 1) {
        return "rgb(84, 149, 134)";
    }
    else if (magnitude <= 2) {
        return "rgb(171, 217, 169)";
    }
    else if (magnitude <= 3) {
        return "rgb(255, 255, 227)";
    }
    else if (magnitude <= 4) {
        return "rgb(241, 165, 173)";
    }
    else if(magnitude <= 5)
    {
        return "rgb(200, 82, 103)";
    }
    else {
        return "rgb(128, 23, 14)";
    }
    
}

// Create a legend to display information about our map
var legend = L.control({ position: "bottomright" });


// When the layer control is added, insert a div with the class of "legend"

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    // div.innerHtml += '<i style="background: rgb(84, 149, 134)></i><span>0-1</span><br>';
    div.innerHTML += "<h3>Magnitude</h3><hr>";
    div.innerHTML += '<p style="background-color: rgb(84, 149, 134); text-align:center"><span>0-1</span></p>';
    div.innerHTML += '<p style="background-color: rgb(171, 217, 169); text-align:center"><span>1-2</span></p>';
    div.innerHTML += '<p style="background-color: rgb(255, 255, 227); text-align:center"><span>2-3</span></p>';
    div.innerHTML += '<p style="background-color: rgb(241, 165, 173); text-align:center"><span>3-4</span></p>';
    div.innerHTML += '<p style="background-color: rgb(200, 82, 103); text-align:center"><span>4-5</span></p>';
    div.innerHTML += '<p style="background-color: rgb(128, 23, 14); text-align:center"><span>5+</span></p>';

    return div;
};

// Add the info legend to the map
legend.addTo(myMap);

// Grab the data with d3
(async function () {
    const response = await d3.json(url);
    console.log(response.features[0])

    const earthquakeData = response.features;

    //loop through the earthquake data and create a cirlce marker for each location
    earthquakeData.forEach(data => {
        // console.log(data)

        const location = data.geometry
        if (location) {
            // need to swap around to get lat and long
            const coordinates = [location.coordinates[1], location.coordinates[0]];
            const properties = data.properties;

            // console.log(properties);
            // return L.marker(coord).addTo(myMap);

            // Create circles for each point and place on map
            L.circle(coordinates, {
                color: circleColor(+properties.mag),
                fillColor: circleColor(+properties.mag),
                fillOpacity: 0.75,
                radius: (properties.mag * 15000) // let's multiple the magnatude to make it big enough to see
            }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitude: " + properties.mag + "</h3>").addTo(myMap);

        }
    })

})()
