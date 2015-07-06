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
    "jquery": "../bower_components/jquery/jquery",
    "mapbox": "../bower_components/mapbox.js/mapbox.uncompressed",
    "polyline": "../bower_components/polyline/src/polyline",
    "underscore": "../bower_components/underscore/underscore",

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
