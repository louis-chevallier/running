const plot_div  = document.getElementById('plot');
const map_div  = document.getElementById('map');
const controls_div  = document.getElementById('controls');
const toggle_button = document.getElementById('toggleButton');
const clear_button = document.getElementById('clearButton');
const next_button = document.getElementById('nextButton');
const record_button = document.getElementById('recordButton');
//const loggin_ta = document.getElementById('loggin');
const loggin_ta = document.getElementById('loggin');
const text = document.getElementById('text');

var i_run = 0;

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

//map.on('locationfound', onLocationFound);


function toggle() {
    console.log(controls_div.style.display)
    var cc = controls_div.style.display == "none" ? "block" : "none";
    console.log(cc)
    controls_div.style.display = cc;
}        


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


var [ hlat, hlong] = [ 48.217015, -1.750584];
var [x, y] = latlong_km(hlat, hlong);


console.log(x, y)
console.log(km_latlong(x, y))

var side = 0.01;



function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function get_runner() {
    const runner1 = getCookie("runner");
    return runner1 
}


function zero_running_data()  {
    return {
        name : get_runner(),
        runs : []
    }
}

var running_data = zero_running_data()

function clear() {
    var running_data_s = encodeURIComponent(JSON.stringify(zero_running_data()));
    
    console.log(document.cookie.length);
    document.cookie = "running=" + running_data_s + ";SameSite=Strict";
    console.log(document.cookie.length);    
    cook(4000)
    console.log("cleared")
    var aaa = getCookie("running");    
    aaa = decodeURIComponent(aaa);
    //console.log(aaa);
    running_data = JSON.parse(aaa)
    console.log("rd1", running_data);             
}


var popup = L.popup();

function onMapClick(e) {
    /*
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    */
    
    var popup = L.popup(e.latlng, {content: '<p>Hello.</p> ' + "You clicked the map at " + e.latlng.toString()})
        .openOn(map);

    popup.on('dblclick',  (e) => console.log(e));
    
}

map.on('click', onMapClick);

toggle_button.addEventListener('click', toggle);
clear_button.addEventListener('click', clear);
next_button.addEventListener('click', next);
record_button.addEventListener('click', record);


function format(s) {
    const out = s.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "_");
    return out;
}

loggin_ta.addEventListener('input', function (k) {
    const runner = format(loggin_ta.value)
    document.cookie = "runner=" + runner + ";SameSite=Strict";
    console.log(runner);
    loggin_ta.value = runner
    const runner1 = getCookie("runner");
    console.log(runner1);    
});

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter'

};
var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter'

};


function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

function cook(l) { 
    var duration_sec = l; //3600; 

    var dates = range(duration_sec, 0)
    var [xs, ys, as] = [ [], [], []]
    var [ x0, y0 ] = [x, y]
    var [ vx, vy] = [0, 0]
    const vmax = 10/3600;

    const clamp = (min, x, max) => x < min ? min : (x > max ? max : x)
    for (const t of dates) {
        vx = clamp(-vmax, vx + (Math.random() - 0.5)/1000, vmax)
        vy = clamp(-vmax, vy + (Math.random() - 0.5)/1000, vmax)
        x0 += vx
        y0 += vy
        xs.push(x0)
        ys.push(y0)
        as.push(10)
    }

    const moonLanding = new Date('July 20, 69 20:17:40 GMT+00:00');
    
    // Milliseconds since Jan 1, 1970, 00:00:00.000 GMT
    console.log(moonLanding.getTime());
    console.log(moonLanding)
    // Expected output: -14182940000
    
    const now = new Date()
    console.log(now)
    const milliseconds = 10 * 1000;
    dates = dates.map(  (d, i) => (new Date(now.getTime() + i * 1000)))
    
    return  { name : name, t : dates, x : xs, y : ys, a : as}
}

const zip = (a, b) => a.map((k, i) => [k, b[i]])

var polygon = 0;


function location_latlong(d) {
    const xs = d.x
    const dates = d.dates
    const ys = d.y
    const pol = zip(xs, ys);
    const pol2 = pol.map(  ([x,y], i) => km_latlong(x, y))
    return pol2[0]
}

function length(d) {
    var l = 0.;
    const xs = d.x
    const dates = d.dates
    const ys = d.y
    const pol = zip(xs, ys);
    var [x, y] = pol[0]
    for (const p of pol) {
        const [ xx, yy] = p
        v = [ xx - x, yy - y]
        ll = Math.sqrt(v[0] ** 2 + v[1] ** 2)
        l = l + ll;
        [x, y] = [ xx, yy]
    }
    console.log(l)
    return l
}

function display(d) {
    const xs = d.x
    const dates = d.dates
    const ys = d.y
    const pol = zip(xs, ys);
    const pol2 = pol.map(  ([x,y], i) => km_latlong(x, y))

    if (polygon != 0) {
        polygon.remove();
    }
    
    polygon = L.polyline(pol2)
    polygon.addTo(map);
    const data = [ { x : dates, y : d.a}]
    Plotly.newPlot('plot', data);
}

function add(d) {
    running_data.runs.unshift(d)
}


function next() {
    console.log(running_data.runs.length)
    console.log("i_run", i_run)
    d = running_data.runs[i_run]
    display(d)
    i_run = (i_run + 1) % running_data.runs.length
    console.log(i_run)
    text.innerHTML = String(i_run+1) + " de " + running_data.runs.length + " traces, longueur=" + length(d);
    loc = location_latlong(d)
    map.setView(loc, 30);
}

function add_rec() {
    t = record_button
    console.log(t.value)
    if (t.value == "Stop") {
        function showPosition(position) {
            var [hlat, hlong, alt] = [position.coords.latitude, position.coords.longitude, position.coords.altitude];
            var [x, y] = latlong_km(hlat, hlong);
            var dd = Date.now();
            
            running_data.runs[0].t.push(dd);
            running_data.runs[0].x.push(x);
            running_data.runs[0].y.push(y);
            running_data.runs[0].a.push(alt);
        }
        navigator.geolocation.getCurrentPosition(showPosition);
        setTimeout(add_rec, 1000 ); // 1 sec
        display(running_data.runs[0])
    } else {
        save()
    }
}

function record() {
    t = record_button
    console.log(t.value)
    if (t.value == "Record") {
        running_data.runs.unshift(cook(1));
        setTimeout(add_rec, 1000 ); // 0.5 sec
    } 
    t.value = t.value == "Record" ? "Stop" : "Record"
    console.log(t.value)    
}

function load() {
    cookies = document.cookies;
    //document.cookie = "runner=" + runner + ";SameSite=Strict";
    const runner = getCookie("runner");
    const xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = () => {
        if (xhr1.readyState === 4) {
            let response = xhr1.response;
            console.log("response", response)
            running_data = response
            console.log(running_data)
            console.log(running_data["name"])
            console.log(running_data.name)
            d = running_data.runs[i_run]
            display(d)
            console.log("loaded", running_data.runs.length)
            
        }
    };
    xhr1.responseType = "json";    
    xhr1.open("POST", "load?runner=" + runner );
    xhr1.send();
}

function save() {
    
    cookies = document.cookies;
    //document.cookie = "runner=" + runner + ";SameSite=Strict";
    const runner = getCookie("runner");
    const xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = () => {
        if (xhr1.readyState === 4) {
            let ss = xhr1.responseText;
            console.log(ss)
        }
    };
    console.log(running_data)
    var running_data_s = encodeURIComponent(JSON.stringify(running_data));
    xhr1.open("POST", "save?runner=" + runner + "&data=" +  running_data_s);
    xhr1.send();
    console.log("saved")
}

loggin_ta.value = get_runner()

d = cook(40)
add(cook(30))
add(cook(50))
add(cook(10))
next()
save()
load()




///////////////////////////////////////////////////////////


async function loggin() {
    runner = "david"
    cookies = document.cookies;
    console.log(cookies);

    
    document.cookie = "runner=" + runner + ";SameSite=Strict";
    cookies = document.cookies;
    console.log(cookies);
    cookies = document.cookie;
    console.log(cookies);
    console.log(getCookie("runner"))
    console.log(loggin_ta.innerHTML)
    var user = getCookie("runner")
    loggin_ta.innerHTML = getCookie("runner")
    console.log(user)
    const xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = () => {
        if (xhr1.readyState === 4) {
            let ss = xhr1.responseText;
            console.log(ss)
        }
    };
    var href = location.href; //returns the entire url
    var host = location.hostname;
    console.log(href)
    xhr1.open("POST", "?user=" + user );
    xhr1.send();
}


    
    /*
    var aaa = getCookie("running");
    if (aaa.length > 0) {
        aaa = decodeURIComponent(aaa);
        //console.log(aaa);
        running_data = JSON.parse(aaa)
        console.log("rd1", running_data);             
        console.log(running_data.name);     
        console.log(running_data.runs);     
    }
    console.log("rd", running_data);
    console.log(running_data.runs);         
    console.log("runs" , running_data.runs.length)
    running_data.runs.push({
        id : "123",
        data : { dates : dates, x : xs, y : ys }})
    console.log("runs" , running_data.runs.length)
    
    var running_data_s = encodeURIComponent(JSON.stringify(running_data));
    console.log(running_data_s.length)
    document.cookie = "running=" + running_data_s + ";SameSite=Strict";
    var aaa = getCookie("running");
    console.log(aaa.length)    
    */
