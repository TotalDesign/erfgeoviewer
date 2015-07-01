define([
	'backbone', 'backbone.marionette', 'communicator',
  'models/routes',
	'views/map', 'views/header'
],

function( Backbone, Marionette, Communicator,
          RoutesModel,
					MapView, HeaderView ) {
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

    var routes_model = new RoutesModel();
    routes_model.fetch({
      success: function() {
        layout.getRegion( 'header' ).show( new HeaderView() );
      }
    });

	});

	return App;
});
