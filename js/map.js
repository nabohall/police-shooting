// Function to draw your map
var drawMap = function() {

  // Create map and set view
  var map = L.map('map_area').setView([41.505, -100.09], 5);

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
}

//Creates the map and table after a successful AJAX request
var customBuild = function(map, data) {
	var layers = {}; // Key: Race, Value: Map Layer
	var killCount = {};// Key: armed/unarmed, Value: count
	var hitCount = {};// Key: armed/unarmed, Value: count


	data.forEach(function(d) {
		makeLayers(d, layers);

		var kill = d["Hit or Killed?"];
		var armed = d["Armed or Unarmed?"];

		if (armed == undefined) {
			armed = "Unknown";
		};


		if(kill == "Hit") {
			if(hitCount[armed] == null){
				hitCount[armed] = 0;
			}
			hitCount[armed]++;
		} else {
			if(killCount[armed] == null){
				killCount[armed] = 0;
			}
			killCount[armed]++;
		}

		

	});

	createTable(killCount, hitCount);

	//Add all layers to the map
	for (var key in layers) {
		layers[key].addTo(map);
	}
	
	//A control form.
	L.control.layers(null,layers).addTo(map);
	
};

//Creates the table with armed/unarmed vs. kill/hit
var createTable = function(killCount, hitCount) {
	var table = $('<table></table>').addClass("table");
	var tr = $('<tr></tr>').append($('<td></td>'));

	for (key in killCount) {
		tr.append($('<td></td>').text(key).addClass("header"));
	}
	table.append(tr);

	var tr  = $('<tr></tr>').append($('<td></td>').text("Killed").addClass("header"));
	for (key in killCount) {
		tr.append($('<td></td>').text(killCount[key]));
	}
	table.append(tr);

	var tr  = $('<tr></tr>').append($('<td></td>').text("Hit").addClass("header"));
	for (key in hitCount) {
		tr.append($('<td></td>').text(hitCount[key]));
	}
	table.append(tr);

	$('#table_area').append(table);
}

//Creates the points on the map corresponding to shootings.
var makeLayers = function(d, layers) {
	var race = d["Race"];
	var latitude = d["lat"];
	var longitude = d["lng"];
	var name = d["Victim Name"];
	var age = d["Victim's Age"];
	var summary = d["Summary"];
	var link = d["Source Link"];
	var armed = d["Armed or Unarmed?"];

	//Cleanse data if race is not specified.
	if(race == null && jQuery.type(layers[race]) !== "string") {
		race = "Unknown";
	}

	//If the race does not have a group layer, make one
	if(layers[race] == null) {
		layers[race] = new L.LayerGroup([]);
	}

	//Create a circle based on whether they victim was armed or unarmed, and add it to the appropriate layer
	if( armed == "Armed" ) {
		var circle = new L.circleMarker([latitude, longitude], {
		    color: 'red',
		    fillColor: '#fb0303',
		    fillOpacity: 0.5,
		    radius: 6
		});

		var popupInfo = name + ' - ' + age + ' - ' + armed + "<br>" + summary + "<br>";
		circle.bindPopup("<p>" + popupInfo + "<a href= + " + link + " target='_blank'> (See more) </a> </p>");

		circle.addTo(layers[race]);
	} else {
		var circle = new L.circleMarker([latitude, longitude], {
		    color: 'blue',
		    fillColor: '#328eff',
		    fillOpacity: 0.5,
		    radius: 5
		});

		var popupInfo = name + ' - ' + age +' - ' + armed + "<br>" + summary + "<br>";
		circle.bindPopup("<p>" + popupInfo + "<a href=" + link + " target='_blank'> (See more) </a> </p>");

		circle.addTo(layers[race]);
	}
}


