// Function to draw your map
var drawMap = function() {

  // Create map and set view
  var map = L.map('container').setView([41.505, -100.09], 4);

  // Create a tile layer variable using the appropriate url
  var tileURL = 'https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmFib2hhbGwiLCJhIjoiY2lmdnVjdzUwMjloZXR4a3IydzFvb2ZqZCJ9.UPAiSQN4Fh4nwr9rx_BI5w';
  var layer = L.tileLayer(tileURL, {attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'});


  // Add the layer to your map
 layer.addTo(map);

  // Execute your function to get data
  getData(map);
 
}

// Function for getting data
var getData = function(map) {
	var data;
  //Execute an AJAX request to get the data in data/response.js
  $.ajax({
  	url:'/data/response.json',
  	type:"get",
  	success:function(dat){
  		customBuild(map, dat);
  	},
  	dataType:"json"
  });

  // When your request is successful, call your customBuild function

console.log("Finished AJAX")
  customBuild1(map);

}


var customBuild = function(map, data) {
	var layers = [];
	var armedCount = {};
	var unarmedCount = {};

	data.forEach(function(d) {
		var race = d["Race"];
		var latitude = d["lat"];
		var longitude = d["lng"];
		var name = d["Victim Name"];
		var age = d["Victim's Age"];
		var summary = d["Summary"];
		var link = d["Source Link"];
		var armed = d["Armed or Unarmed?"];

		if(race == null && jQuery.type(layers[race]) !== "string") {
			race = "Unknown";
		}

		//If the race is does not have a group layer
		if(layers[race] == null) {
			layers[race] = new L.LayerGroup([]);
		} // Do something if there is no race specified.

		//Create a circle based on whether they victim was armed or unarmed
		if( armed == "Armed" ) {
			var circle = new L.circleMarker([latitude, longitude], {
			    color: 'red',
			    fillColor: '#fb0303',
			    fillOpacity: 0.5,
			    radius: 5
			});

			var anchor = $('<a></a>').text("link");
			anchor.attr('href', link);
			var popupInfo = name + '-' + age + "<br>" + summary + "<br>";
			var popup = $('<p></p>').text(popupInfo);
			popup.append(anchor);
			circle.bindPopup(popup);
			console.log(popup);
			circle.addTo(layers[race]);
		} else {
			var circle = new L.circleMarker([latitude, longitude], {
			    color: 'blue',
			    fillColor: '#328eff',
			    fillOpacity: 0.5,
			    radius: 5
			});

			var anchor = $('<a></a>').text("See Source");
			anchor.attr('href', link);

			var popupInfo = name + '-' + age + "<br>" + summary + "<br>";
			var popup = $('<p></p>').text(popupInfo);
			popup.append(anchor);
			circle.bindPopup(popup);
			circle.addTo(layers[race]);
		}

	});

	layers["Unknown"].addTo(map);
	layers["White"].addTo(map);
	console.log(layers["Unknown"]);
	console.log(jQuery.type(layers));
	layers.forEach(function(d) {
		console.log(d);
	})
	
	console.log("I got pass the adding of layers.")
	
};
// Loop through your data and add the appropriate layers and points
var customBuild1 = function(map) {
	// Be sure to add each layer to the map
	console.log("Making other circle.")

	var circle = new L.circleMarker([47.6097, -122.3331], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 5
}).bindPopup('This is Seattle');
	// Once layers are on the map, add a leaflet controller that shows/hides layers
	var testLayer = new L.LayerGroup([circle]);
  
}


