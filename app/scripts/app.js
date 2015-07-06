define([
	'backbone', 'backbone.marionette', 'communicator',
	'views/map', 'views/header',
  'modules/routeyou/routeyou', 'modules/delving/delving'
],

function( Backbone, Marionette, Communicator,
					MapView, HeaderView,
          RouteyouModule, DelvingModule ) {
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
        routeyou: "#routeyou",
				content: "#content",
        tooltip: "#tooltip",
        flyout: "#flyout"
			}
		});

		var layout = new AppLayoutView();
		layout.render();
		container.show(layout);

    // Initialize modules.
    layout.getRegion( 'content' ).show( new MapView( {layout: layout} ) );
    //layout.getRegion( 'header' ).show( new HeaderView() );

    // All modules are passed this
    var moduleOptions = {
      // If module includes a View, it will be shown in this region
      region: null
    };

    new DelvingModule( {
      region: layout.getRegion( 'flyout' )
    } );
    //new RouteyouModule( {region: layout.getRegion( 'routeyou' )} );

	});

	return App;
});
