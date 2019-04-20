// LOAD DATA SETS
let arboladoDataSet;
let localidadesDataSet;

$.getJSON("/data/arbolado.json", function(json) {
  arboladoDataSet = json;
});

$.getJSON("/data/localidades.json", function(json) {
  localidadesDataSet = json;
});

function getName(dataSet, code) {
  return dataSet.filter(entity => entity.codigo == code)[0].nombre;
}

function getCode(dataSet, name) {
  return dataSet.filter(entity => entity.nombre == name)[0].codigo;
}

// MAP RENDERING
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
colors[254] = "#00BF6F";
colors[10] = "#2BC500";
colors[155] = "#CCC600";
colors[8] = "#D22300";
colors[286] = "#D9008A";
colors[89] = "#7C00E0";
colors[110] = "#D7AA08";
colors[5] = "#D8B508";
colors[152] = "#D8BF08";
colors[144] = "#D9CA08";
colors[76] = "#D9D508";
colors[68] = "#D4DA09";
colors[116] = "#CADA09";
colors[217] = "#C0DB09";
colors[142] = "#B6DB09";
colors[37] = "#ACDC0A";
colors[70] = "#A2DC0A";
colors[65] = "#98DD0A";
colors[73] = "#8EDD0A";
colors[117] = "orange";
colors[97] = "#7ADE0B";
colors[51] = "#70DF0B";
colors[95] = "#66DF0B";
colors[20] = "#5CE00B";
colors[277] = "#52E00B";
colors[27] = "#48E10C";
colors[284] = "#3DE10C";
colors[234] = "#33E20C";
colors[74] = "#29E20C";
colors[253] = "#1FE30D";
colors[244] = "white";

map.on("load", function() {
  map.addLayer({
    id: "trees",
    type: "circle",
    source: {
      type: "vector",
      url: "mapbox://jpneirac1.atibkeml"
    },
    "source-layer": "arboladobogotadepuradocodes",
    paint: {
      "circle-radius": {
        stops: [[12, 1.8], [22, 5]]
      },
      "circle-color": [
        "to-string",
        ["at", ["to-number", ["get", "tree-code"]], ["literal", colors]]
      ]
    }
  });

  map.on("click", "trees", function(e) {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        "<b>Especie: </b>" +
          getName(arboladoDataSet, e.features[0].properties["tree-code"]) +
          "</br>" +
          "<b>Altura: </b>" +
          e.features[0].properties["ALTURA_TOT"] +
          " mts"
      )
      .addTo(map);
  });
});

function getFilter(fieldName, fieldValue, dataSet) {
  return fieldValue == "Ver Todos"
    ? ["!in", fieldName, ""]
    : [
        "in",
        fieldName,
        getCode(dataSet, fieldValue)
          .toString()
          .concat(fieldName == "CODIGO_LOC" ? ".0" : "")
      ];
}

function filterByFeatures() {
  let filter1, filter2;
  let especiesMenu = document.getElementById("especiesMenu");
  let especie = especiesMenu.options[especiesMenu.selectedIndex].text;
  filter1 = getFilter("tree-code", especie, arboladoDataSet);

  let localidadMenu = document.getElementById("localidadesMenu");
  let localidad = localidadMenu.options[localidadMenu.selectedIndex].text;
  filter2 = getFilter("CODIGO_LOC", localidad, localidadesDataSet);

  if (especie != "Ver Todos") {
    // Render found features in an overlay.
    overlay.innerHTML = "";
    var title = document.createElement("strong");
    var imagen = document.createElement("img");
    imagen.setAttribute("src", "images/" + especie + ".png");
    imagen.setAttribute("id", "arbolito");
    overlay.appendChild(title);
    overlay.appendChild(imagen);
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }

  map.setFilter("trees", ["all", filter1, filter2]);
}

function changeAltura(value) {
  let alturaLabel = document.getElementById("alturaLabel");
  alturaLabel.innerText = "Altura ( < ".concat(value).concat(" mts)");
  map.setFilter("trees", [
    "<=",
    ["to-number", ["get", "ALTURA_TOT"]],
    Number(value)
  ]);
}
