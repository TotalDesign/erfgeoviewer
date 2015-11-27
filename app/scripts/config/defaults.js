define("config", function () {
  return {
    "controls": {
      "newMap": false,
      "openMap": false
    },
    "colors": {
      "primary": "#673ab7",
      "secondary": "#009688"
    },
    "availableColors": {
      "Rood": "#f44336",
      "Roze": "#e91e63",
      "Paars": "#9c27b0",
      "Diep-paars": "#673ab7",
      "Indigo": "#3f51b5",
      "Blauw": "#2196f3",
      "Lichtblauw": "#03a9f4",
      "Turquoise": "#00bcd4",
      "Blauwgroen": "#009688",
      "Groen": "#4caf50",
      "Lichtgroen": "#8bc34a",
      "Limoen": "#cddc39",
      "Geel": "#ffeb3b",
      "Amber": "#ffc107",
      "Oranje": "#ff9800",
      "Diep-oranje": "#ff5722",
      "Bruin": "#795548",
      "Grijs": "#9e9e9e",
      "Blauw-grijs": "#607d8b",
      "Zwart": "#000000",
      "Wit": "#ffffff"
    },
    "delving": {
      "uri": "http://onh-prod.delving.org/api"
    },
    "mapbox": {
      "accessToken": "",
      "baseLayerId": ""
    },
    "routeyou_proxy": {
      "uri": "http://routes.dev",
      "owner_id": 120432
    },
    "tiles": [
      {
        "id": "CartoDB Positron",
        "previewImage": "http://a.basemaps.cartocdn.com/light_all/16/33630/21569.png",
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          "attribution": '&copy; <a href="http://www.openstreetmap.org/copyright" tabindex="-1">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions" tabindex="-1">CartoDB</a>'
        }
      },
      {
        "id": "CartoDB Dark Matter",
        "previewImage": 'http://a.basemaps.cartocdn.com/dark_all/16/33630/21569.png',
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          "attribution": '&copy; <a href="http://www.openstreetmap.org/copyright" tabindex="-1">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions" tabindex="-1">CartoDB</a>'
        }
      },
      {
        "id": "osm",
        "label": "Open Street Maps",
        "previewImage": "http://b.tile.openstreetmap.org/15/16793/10814.png",
        "tilejson": {
          "tilejson": "1.0.0",
          "name": "OpenStreetMap",
          "description": "A free editable map of the whole world.",
          "version": "1.0.0",
          "attribution": "(c) OpenStreetMap contributors, CC-BY-SA",
          "scheme": "xyz",
          "tiles": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "minZoom": 0,
          "maxZoom": 18,
          "bounds": [ -180, -85, 180, 85 ],
          "autoscale": false
        }
      },
      {
        "id": "StamenToner",
        "previewImage": "http://a.tile.stamen.com/toner/14/8413/5385.png",
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
          "attribution": 'Map tiles by <a href="http://stamen.com" tabindex="-1">Stamen Design</a>, under' +
          ' <a href="http://creativecommons.org/licenses/by/3.0" tabindex="-1">CC BY 3.0</a>.' +
          ' Data by <a href="http://openstreetmap.org" tabindex="-1">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0"> tabindex="-1"CC BY SA</a>.'
        }
      },
      {
        "id": "OpenCycleMap",
        "previewImage": "http://a.tile.thunderforest.com/cycle/17/67350/43162.png",
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
          "attribution": '&copy; <a href="http://openstreetmap.org" tabindex="-1">OpenStreetMap</a>, ' + 'Contributors <a href="http://thunderforest.com/" tabindex="-1">Thunderforest</a>'
        }
      }
    ],
    "zoek_en_vind": {
      "uri": "http://erfgeo.data.digitalecollectie.nl",
//      "facets": {
//        "type": 'OR',
//        "values": [
//          'edm:dataProvider exact "Rijksmuseum"',
//          'edm:dataProvider exact "Zeeuwse Bibliotheek"'
//        ]
//      }
      "requestedFacets": [
        "dc:subject",
        "dc:type",
        "edm:dataProvider",
        "dc:date.year:250"
      ],
      "facetLabels": {
        "dc:subject": "Onderwerp",
        "dc:dataProvider": "Collectie",
        "edm:dataProvider": "Collectie",
        "dc:type": "Type"
      }
    },
    "fields": [
      {
        "key": "title",
        "label": ""
      },
      {
        "key": "image",
        "label": ""
      },
      {
        "key": "description",
        "label": ""
      },
      {
        "key": "youtubeid",
        "label": ""
      },
      {
        "key": "externalUrl",
        "label": ""
      }
    ],

    "ui": {
      "moreInfo" : "Lees meer"
    }
  };
});
