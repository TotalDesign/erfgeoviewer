require.config( {

  baseUrl: "/scripts",

  /* starting point for application */
  deps: ["backbone.marionette", "boot"],

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
    "backbone.marionette": "../bower_components/backbone.marionette/lib/core/backbone.marionette",
    "backbone.wreqr": "../bower_components/backbone.wreqr/lib/backbone.wreqr",
    "backbone.babysitter": "../bower_components/backbone.babysitter/lib/backbone.babysitter",
    "backbone.react.component": "../bower_components/backbone-react-component/lib/component",
    "bootstrap": "vendor/bootstrap",
    "config": "config/dev",
    "d3": "../bower_components/d3/d3",
    "hammerjs": "../bower_components/hammerjs/hammer",
    "jquery": "../bower_components/jquery/dist/jquery",
    "jquery.hammer": "../bower_components/materialize/js/jquery.hammer",
    "jsx": "../bower_components/requirejs-react-jsx/jsx",
    "JSXTransformer": "../bower_components/react/JSXTransformer",
    "mapbox": "../bower_components/mapbox.js/mapbox.uncompressed",
    "materialize.cards": "../bower_components/materialize/js/cards",
    "materialize.tabs": "../bower_components/materialize/js/tabs",
    "materialize.sidenav": "../bower_components/materialize/js/sideNav",
    "polyline": "../bower_components/polyline/src/polyline",
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

    "backbone.marionette": {
      "deps": [
        "backbone"
      ]
    },

    "bootstrap": {
      "deps": ["jquery"],
      "exports": "jquery"
    },

    "polyline": {
      "exports": "polyline"
    },

    // jquery plugins
    "velocity": ["jquery"],

    "jquery.hammer": {
      "deps": ["jquery", "hammerjs"],
      "exports": "jquery"
    }

  }

} );
