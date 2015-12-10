require.config( {

  baseUrl: "/scripts",

  /* starting point for application */
  deps: ["backbone.marionette", "jquery", "erfgeoviewer.mapmaker"],
  //deps: ["backbone.marionette", "jquery", "erfgeoviewer.reader"],

  enforceDefine: false,

  jsx: {
    fileExtension: ".jsx",
    transformOptions: {
      harmony: true,
      stripTypes: false,
      inlineSourceMap: true
    },
    usePragma: false
  },

  "packages": [
    {
      "name": "plugin/abstract",
      "location": "plugins/_abstract",
      "main": "plugin.js"
    },
    {
      "name": "plugin/geojson_features",
      "location": "plugins/geojson_features",
      "main": "plugin.js"
    },
    {
      "name": "plugin/map_settings",
      "location": "plugins/map_settings",
      "main": "plugin.js"
    },
    {
      "name": "plugin/draw",
      "location": "plugins/draw",
      "main": "plugin.js"
    },
    {
      "name": "plugin/feature_list",
      "location": "plugins/feature_list",
      "main": "plugin.js"
    }
  ],

  paths: {

    /* Libraries */
    "backbone": "../bower_components/backbone/backbone",
    "backbone.localstorage": "../bower_components/backbone.localstorage/backbone.localStorage",
    "backbone.marionette": "../bower_components/backbone.marionette/lib/core/backbone.marionette",
    "backbone.mutators": "../bower_components/Backbone.Mutators/backbone.mutators",
    "backbone.wreqr": "../bower_components/backbone.wreqr/lib/backbone.wreqr",
    "backbone.babysitter": "../bower_components/backbone.babysitter/lib/backbone.babysitter",
    "backbone.pageable.collection": "../bower_components/backbone.paginator/lib/backbone.paginator",
    "backbone.react.component": "../bower_components/backbone-react-component/lib/component",
    "backgrid": "../bower_components/backgrid/lib/backgrid",
    "backgrid.paginator": "../bower_components/backgrid-paginator/backgrid-paginator",
    "bootstrap": "vendor/bootstrap",
    "config": "config/dev",
    "d3": "../bower_components/d3/d3",
    "erfgeoviewer.search": "plugins/zev/zev",
    //"erfgeoviewer.search": "plugins/delving/delving",
    "fuse": "../bower_components/fuse.js/src/fuse",
    "hammerjs": "../bower_components/hammerjs/hammer",
    "jquery": "../bower_components/jquery/dist/jquery",
    "jquery.easing": "../bower_components/materialize/js/jquery.easing.1.3",
    "jquery.hammer": "../bower_components/materialize/js/jquery.hammer",
    "jsx": "../bower_components/requirejs-react-jsx/jsx",
    "JSXTransformer": "../bower_components/react/JSXTransformer",
    "leaflet.draw": "../bower_components/leaflet.draw/dist/leaflet.draw",
    "leaflet.fullscreen": "../bower_components/leaflet.fullscreen/Control.FullScreen",
    "leaflet.markercluster": "../bower_components/leaflet.markercluster/dist/leaflet.markercluster",
    "leaflet.proj": "../bower_components/proj4leaflet/src/proj4leaflet",
    "leaflet.smoothmarkerbouncing": "../bower_components/Leaflet.SmoothMarkerBouncing/leaflet.smoothmarkerbouncing",
    "leaflet-toolbar": "../bower_components/leaflet-toolbar/dist/leaflet.toolbar-src",
    "leaflet.distortableimage": "../bower_components/Leaflet.DistortableImage/dist/leaflet.distortableimage",
    "leaflet.easybutton": "../bower_components/Leaflet.EasyButton/src/easy-button",
    "leaflet": "../bower_components/mapbox.js/mapbox.uncompressed",
    "materialize": "../bower_components/materialize/js/global",
    "materialize.animation": "../bower_components/materialize/js/animation",
    "materialize.cards": "../bower_components/materialize/js/cards",
    "materialize.collapsible": "../bower_components/materialize/js/collapsible",
    "materialize.dropdown": "../bower_components/materialize/js/dropdown",
    "materialize.forms": "../bower_components/materialize/js/forms",
    "materialize.modal": "../bower_components/materialize/js/leanModal",
    "materialize.sidenav": "../bower_components/materialize/js/sideNav",
    // "materialize.tabs": "../bower_components/materialize/js/tabs",
    "materialize.toasts": "../bower_components/materialize/js/toasts",
    "materialize.waves": "../bower_components/materialize/js/waves",
    "medium.editor": "../bower_components/medium-editor/dist/js/medium-editor",
    "polyline": "../bower_components/polyline/src/polyline",
    "proj4": "../bower_components/proj4/dist/proj4",
    "q": "../bower_components/q/q.min",
    "react": "../bower_components/react/react",
    "react.paginate": "../bower_components/react-paginate/index",
    "share.button": "../scripts/vendor/share-button",
    "underscore": "../bower_components/underscore/underscore",
    "velocity": "../bower_components/velocity/velocity",

    /* Shortcut paths */
    "template": "../templates",
    "geo": "../geo",
    "URIjs": "../bower_components/uri.js/src",

    /* Pre-processors: tpl!template/filename.html */
    "text": "../bower_components/requirejs-text/text",
    "tpl": "../bower_components/requirejs-tpl/tpl"

  },

  shim: {

    "backbone": {
      "deps": [
        "underscore",
        "jquery"
      ],
      "exports": "Backbone"
    },

    "backbone.localstorage": {
      "deps": ["backbone"]
    },

    "backbone.marionette": {
      "deps": [
        "backbone"
      ]
    },

    "backgrid": {
      deps: ["backbone"],
      exports: "Backgrid"
    },

    "backgrid.paginator": { deps: ["backgrid"] },

    "jquery.easing": {
      "deps": ["jquery"]
    },

    "jquery.hammer": {
      "deps": ["jquery", "hammerjs"]
    },

    "leaflet": {
      "exports": "L"
    },

    "leaflet.draw": { deps: ["leaflet"] },
    "leaflet.fullscreen": { deps: ["leaflet"] },
    "leaflet.markercluster": { deps: ["leaflet"] },
    "leaflet.proj": { deps: ["leaflet", "proj4"] },
    "leaflet.smoothmarkerbouncing": { deps: ["leaflet"] },
    "leaflet-toolbar": { deps: ["leaflet"] },
    "leaflet.distortableimage": { deps: ["leaflet"] },
    "leaflet.easybutton": { deps: ["leaflet"] },

    "materialize.collapsible": {
      deps: ["jquery.easing", "materialize.animation"]
    },

    "materialize.modal": {
      deps: ["jquery"]
    },

    "materialize.forms": {
      deps: ["materialize", "materialize.dropdown"],
      exports: "Materialize"
    },

    "materialize.toasts": {
      deps: ["materialize", "jquery.hammer"]
    },

    "polyline": {
      "exports": "polyline"
    },

    "proj4": {
      deps: ["leaflet"]
    },

    "velocity": ["jquery"],

    "underscore": {
      "exports": "_"
    }

  },

  wrapShim: true

} );
