require.config( {

  baseUrl: "/scripts",

  /* starting point for application */
  deps: ["backbone.marionette", "bootstrap", "boot"],


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

  },

  paths: {

    /* Libraries */
    "backbone": "../bower_components/backbone/backbone",
    "backbone.marionette": "../bower_components/backbone.marionette/lib/core/backbone.marionette",
    "backbone.wreqr": "../bower_components/backbone.wreqr/lib/backbone.wreqr",
    "backbone.babysitter": "../bower_components/backbone.babysitter/lib/backbone.babysitter",
    "bootstrap": "vendor/bootstrap",
    "config": "config/dev",
    "d3": "../bower_components/d3/d3",
    "hammerjs": "../bower_components/hammerjs/hammer",
    "jquery": "../bower_components/jquery/dist/jquery",
    "jquery.hammer": "../bower_components/materialize/js/jquery.hammer",
    "mapbox": "../bower_components/mapbox.js/mapbox.uncompressed",
    "materialize.cards": "../bower_components/materialize/js/cards",
    "materialize.tabs": "../bower_components/materialize/js/tabs",
    "materialize.sidenav": "../bower_components/materialize/js/sideNav",
    "polyline": "../bower_components/polyline/src/polyline",
    "react": "../bower_components/react/react",
    "underscore": "../bower_components/underscore/underscore",
    "velocity": "../bower_components/velocity/velocity",

    /* Shortcut paths */
    "template": "../templates",
    "geo": "../geo",

    /* Pre-processors: tpl!template/filename.html */
    "text": "../bower_components/requirejs-text/text",
    "tpl": "../bower_components/requirejs-tpl/tpl"

    // I tried this in many different ways, without success; I don't know what's not properly configured
    //"draggabilly": "../bower_components/draggabilly/dist/draggabilly.pkgd",

  }

} );
