define([
	'backbone', 'backbone.marionette', 'communicator',
	'views/map', 'views/header'
],

function( Backbone, Marionette, Communicator,
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

    layout.getRegion( 'header' ).show( new HeaderView() );
    layout.getRegion( 'content' ).show( new MapView( {layout: layout} ) );

	});

	return App;
});
