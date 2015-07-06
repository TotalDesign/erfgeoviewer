define([
	'backbone', 'backbone.marionette', 'communicator',
  'models/routes',
	'views/map', 'views/route-selector'
],

function( Backbone, Marionette, Communicator,
          RoutesCollection,
					MapView, RouteSelector ) {
    'use strict';

	var App = new Marionette.Application();
	var container = new Marionette.Region({
		el: "#application"
	});
	App.addInitializer( function () {

		var AppLayoutView = Marionette.LayoutView.extend({
			template: "#template-layout",
			regions: {
				header: "#header",
				content: "#content",
        tooltip: "#tooltip"
			}
		});

		var layout = new AppLayoutView();
		layout.render();
		container.show(layout);

    layout.getRegion( 'content' ).show( new MapView( {layout: layout} ) );

    var routes_collection = new RoutesCollection();
    routes_collection.fetch({
      success: function(c) {
        layout.getRegion( 'header' ).show( new RouteSelector( {
          collection: c
        }) );
      }
    });

	});

	return App;
});
