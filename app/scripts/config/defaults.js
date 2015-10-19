define("config", function () {
  return {
    "colors": {
      "primary": "#673ab7",
      "secondary": "#009688"
    },
    "availableColors": {
      "Red": "#f44336",
      "Pink": "#e91e63",
      "Purple": "#9c27b0",
      "Deep-purple": "#673ab7",
      "Indigo": "#3f51b5",
      "Blue": "#2196f3",
      "Light-blue": "#03a9f4",
      "Cyan": "#00bcd4",
      "Teal": "#009688",
      "Green": "#4caf50",
      "Light-green": "#8bc34a",
      "Lime": "#cddc39",
      "Yellow": "#ffeb3b",
      "Amber": "#ffc107",
      "Orange": "#ff9800",
      "Deep-orange": "#ff5722",
      "Brown": "#795548",
      "Grey": "#9e9e9e",
      "Blue-grey": "#607d8b",
      "Black": "#000000",
      "White": "#ffffff"
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
          "attribution": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under' +
          ' <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.' +
          ' Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        }
      },
      {
        "id": "OpenCycleMap",
        "previewImage": "http://a.tile.thunderforest.com/cycle/17/67350/43162.png",
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
          "attribution": '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' + 'Contributors <a href="http://thunderforest.com/">Thunderforest</a>'
        }
      },
      {
        "id": "CartoDB Positron",
        "previewImage": "http://a.basemaps.cartocdn.com/light_all/16/33630/21569.png",
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          "attribution": '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }
      },
      {
        "id": "CartoDB Dark Matter",
        "previewImage": 'http://a.basemaps.cartocdn.com/dark_all/16/33630/21569.png',
        "tilejson": {
          "version": '1.0.0',
          "scheme": 'xyz',
          "tiles": 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          "attribution": '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
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
      "facetLabels": {
        "dc:subject": "Onderwerp",
        "dc:dataProvider": "Collectie",
        "edm:dataProvider": "Collectie"
      }
    },
    "fields": [
      {
        "key": "title",
        "label": "Title"
      },
      {
        "key": "image",
        "label": "Image"
      },
      {
        "key": "description",
        "label": ""
      },
      {
        "key": "youtubeid",
        "label": "YouTube"
      },
      {
        "key": "externalUrl",
        "label": "External link"
      }
    ]
  };
});
