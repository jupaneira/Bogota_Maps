mapboxgl.accessToken =
  "pk.eyJ1IjoianBuZWlyYWMxIiwiYSI6ImNpaDR0OXdjeDB6bnY2NW0wMWZ2M2NmdGwifQ.xhT0KEgd7tca3Ris39Yyqw";

var bounds = [
  [-74.407641, 4.341525], // Sur-Occidente
  [-73.751983, 4.996913] // Nor-oriente
];

var overlay = document.getElementById("map-overlay");
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 12,
  center: [-74.13, 4.65],
  maxBounds: bounds // Sets bounds as max
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var colors = [];
while (colors.length < 296) {
  colors.push(getRandomColor());
}
colors[252] = "#00BF6F";
colors[10] = "#2BC500";
colors[153] = "#CCC600";
colors[8] = "#D22300";
colors[284] = "#D9008A";
colors[86] = "#7C00E0";
colors[107] = "#D7AA08";
colors[5] = "#D8B508";
colors[149] = "#D8BF08";
colors[141] = "#D9CA08";
colors[72] = "#D9D508";
colors[64] = "#D4DA09";
colors[113] = "#CADA09";
colors[215] = "#C0DB09";
colors[137] = "#B6DB09";
colors[34] = "#ACDC0A";
colors[66] = "#A2DC0A";
colors[61] = "#98DD0A";
colors[69] = "#8EDD0A";
colors[114] = "orange";
colors[94] = "#7ADE0B";
colors[47] = "#70DF0B";
colors[92] = "#66DF0B";
colors[19] = "#5CE00B";
colors[274] = "#52E00B";
colors[26] = "#48E10C";
colors[281] = "#3DE10C";
colors[232] = "#33E20C";
colors[70] = "#29E20C";
colors[251] = "#1FE30D";
colors[242] = "red";

console.log(colors);

map.on("load", function() {
  map.addLayer({
    id: "trees",
    type: "circle",
    source: {
      type: "vector",
      url: "mapbox://jpneirac1.dzmy3cmz"
    },
    "source-layer": "arboladobogotacodes",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      "circle-radius": {
        stops: [[12, 1.8], [22, 5]]
      },
      // color circles by ethnicity, using a match expression
      // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
      "circle-color": [
        "to-string",
        ["at", ["to-number", ["get", "tree-code"]], ["literal", colors]]
      ]
    }
  });

  map.on("click", "trees", function(e) {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(getName(e.features[0].properties["tree-code"]))
      .addTo(map);
  });
});

let data;
$.getJSON("/data/arbolado.json", function(json) {
  data = json; // this will show the info it in firebug console
});

function getName(code) {
  return data.filter(tree => tree.codigo == code)[0].nombre;
}

function getCode(name) {
  return data.filter(tree => tree.nombre == name)[0].codigo;
}

function olew(name) {
  if (name == "Ver Todos") {
    map.setFilter("trees", ["!in", "tree-code", ""]);
    return;
  }
  let code = getCode(name).toString();

  // Render found features in an overlay.
  overlay.innerHTML = "";

  var title = document.createElement("strong");
  title.textContent = name;

  overlay.appendChild(title);
  overlay.style.display = "block";

  // Add features that share the same county name to the highlighted layer.
  map.setFilter("trees", ["in", "tree-code", code]);
}
