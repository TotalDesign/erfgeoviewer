require.config( {

  baseUrl: "/scripts",

  /* starting point for application */
  deps: ["backbone.marionette", "jquery"],

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

  paths: {

    /* Libraries */
    "backbone": "../bower_components/backbone/backbone",
    "backbone.localstorage": "../bower_components/backbone.localstorage/backbone.localStorage",
    "backbone.marionette": "../bower_components/backbone.marionette/lib/core/backbone.marionette",
    "backbone.wreqr": "../bower_components/backbone.wreqr/lib/backbone.wreqr",
    "backbone.babysitter": "../bower_components/backbone.babysitter/lib/backbone.babysitter",
    "backbone.pageable.collection": "../bower_components/backbone.paginator/lib/backbone.paginator",
    "backbone.react.component": "../bower_components/backbone-react-component/lib/component",
    "backgrid": "../bower_components/backgrid/lib/backgrid",
    "backgrid.paginator": "../bower_components/backgrid-paginator/backgrid-paginator",
    "bootstrap": "vendor/bootstrap",
    "config": "config/dev",
    "d3": "../bower_components/d3/d3",
    "erfgeoviewer.search": "modules/delving/delving",
    "hammerjs": "../bower_components/hammerjs/hammer",
    "jquery": "../bower_components/jquery/dist/jquery",
    "jquery.hammer": "../bower_components/materialize/js/jquery.hammer",
    "jsx": "../bower_components/requirejs-react-jsx/jsx",
    "JSXTransformer": "../bower_components/react/JSXTransformer",
    "leaflet.markercluster": "../bower_components/leaflet.markercluster/dist/leaflet.markercluster",
    "leaflet.proj": "../bower_components/proj4leaflet/src/proj4leaflet",
    "leaflet.smoothmarkerbouncing": "../bower_components/Leaflet.SmoothMarkerBouncing/leaflet.smoothmarkerbouncing",
    "leaflet": "../bower_components/mapbox.js/mapbox.uncompressed",
    "materialize": "../bower_components/materialize/js/global",
    "materialize.cards": "../bower_components/materialize/js/cards",
    "materialize.modal": "../bower_components/materialize/js/leanModal",
    "materialize.forms": "../bower_components/materialize/js/forms",
    "materialize.sidenav": "../bower_components/materialize/js/sideNav",
    "materialize.tabs": "../bower_components/materialize/js/tabs",
    "materialize.toasts": "../bower_components/materialize/js/toasts",
    "materialize.waves": "../bower_components/materialize/js/waves",
    "medium.editor": "../bower_components/medium-editor/dist/js/medium-editor",
    "polyline": "../bower_components/polyline/src/polyline",
    "proj4": "../bower_components/proj4/dist/proj4",
    "react": "../bower_components/react/react",
    "react.paginate": "../bower_components/react-paginate/index",
    "underscore": "../bower_components/underscore/underscore",
    "velocity": "../bower_components/velocity/velocity",

    /* Shortcut paths */
    "template": "../templates",
    "geo": "../geo",

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

    'backgrid': {
      deps: ['backbone'],
      exports: 'Backgrid'
    },

    'backgrid.paginator': { deps: ['backgrid'] },

    "leaflet": {
      deps: ["leaflet"],
      exports: "L"
    },

    "leaflet.markercluster": {
      deps: ["leaflet"]
    },

    "leaflet.proj": {
      deps: ["leaflet", "proj4"]
    },

    "leaflet.smoothmarkerbouncing": {
      deps: ["leaflet"]
    },

    "leaflet": {
      "exports": "L"
    },

    "materialize.modal": {
      deps: ["jquery"]
    },

    "materialize.forms": {
      deps: ["materialize"],
      exports: "Materialize"
    },

    "materialize.toasts": {
      deps: ["materialize", "jquery.hammer"]
      //exports: "Materialize"
    },

    "polyline": {
      "exports": "polyline"
    },

    "proj4": { deps: ["leaflet"] },

    // jquery plugins
    "velocity": ["jquery"],

    "underscore": {
      "exports": "_"
    },

    "jquery.hammer": {
      "deps": ["jquery", "hammerjs"]
    }

  },

  wrapShim: true

} );
