var token = "pk.eyJ1IjoiYmp2b25nIiwiYSI6ImNsZDRpZDk5OTBzazgzb3FoOXdiNjFkYjEifQ.-GvfLSbYcjWCahbIb5Bb6Q";
mapboxgl.accessToken = token;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104081, 42.365554],
    zoom: 12
});

var newBusses = [];
var currentBusses = [];
async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	console.log(locations);
    console.log(currentBusses);

    currentBusses.forEach((marker) => {marker.remove()});
    currentBusses = [];

    var busses = [];
    if (typeof locations === 'undefined'){
        console.log("nodata"); 
    }else {
    locations.forEach((attribute, i) =>{
        var marker = 'marker' + locations[i].id;
        var latlng = [locations[i].attributes.longitude, locations[i].attributes.latitude];
        busses.push({bus:marker, loc:latlng});
    });
    
    newBusses = busses;
    busses = [];	
}

addBusses(newBusses);
}



var counter = 0;
function addBusses(arr1){
if(arr1.length === 0){
    console.log("no busses");
}else{
    arr1.forEach((bus, k) =>{
        var marker = new mapboxgl.Marker()
            .setLngLat(arr1[k].loc)
            .addTo(map);
        currentBusses.push(marker);
        });
    }
}


// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}


run();
setInterval(run, 15000);


