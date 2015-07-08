define([
	'backbone', 'backbone.marionette', 'communicator', 'velocity',
	'views/map', 'views/header', 'views/toolbar',
  'modules/routeyou/routeyou', 'modules/delving/delving'
],

function( Backbone, Marionette, Communicator, $,
					MapView, HeaderView, ToolbarView,
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
				content: "#content",
        toolbar: "#toolbar"
			}
		});

		var layout = new AppLayoutView();
		layout.render();
		container.show(layout);


    // Initialize modules.

    var modules = [];
    //modules.push(new RouteyouModule());
    modules.push(new DelvingModule());

    // App-wide regions.
    layout.getRegion( 'content' ).show( new MapView( {layout: layout} ) );
    layout.getRegion( 'header' ).show( new HeaderView() );

    //layout.getRegion( 'toolbar' ).show(
    //  new ToolbarView( {
    //    region: layout.getRegion( 'toolbar' ),
    //    modules: modules
    //  } )
    //);

    // Event handlers.
    Communicator.mediator.on( "menu:open", function() {
      console.log('menu open');
    } )

	});

	return App;
});
