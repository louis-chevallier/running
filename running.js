const dd  = document.getElementById('d1');
const startButton = document.getElementById('start');

/*
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});
*/

var map = L.map('map').fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;
    console.log(e.latlng)
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    
    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);


function latlong_km(llat, llong) {
    var llat_rd = llat / 360 * 2 * Math.PI
    var [x,y] =  [110.574 * llat, llong * 111.320 * Math.cos(llat_rd)]
    return [ x, y]
}

function km_latlong(x, y) {
    var llat = x / 110.574
    var llat_rd = llat / 360 * 2 * Math.PI
    var llong = y / (111.320 * Math.cos(llat_rd))
    return [ llat, llong]
}


var [ hlat, hlong] = [ 48.21 , -1.75]

var [x, y] = latlong_km(hlat, hlong)
console.log(x, y)
console.log(km_latlong(x, y))
var polygon = L.polygon([
    km_latlong(x-0.5, y-0.5),
    km_latlong(x-0.5, y+0.5),
    km_latlong(x+0.5, y+0.5),
    km_latlong(x+0.5, y-0.5)]).addTo(map);

async function startRecording() {

}

startButton.addEventListener('click', startRecording);

