define([
	'backbone', 'backbone.marionette', 'communicator', 'velocity',
	'views/map', 'views/header', 'views/layer-add',
  'modules/routeyou/routeyou', 'modules/delving/delving'
],

function( Backbone, Marionette, Communicator, $,
					MapView, HeaderView, LayerAddView,
          RouteyouModule, DelvingModule ) {
    'use strict';

	var App = new Marionette.Application();
  var Router = Marionette.AppRouter.extend({
    routes : {
      "layers" : function() {
        console.log('layers');
      },
      "base": function() {
        console.log('base');
      },
      "features": function() {
        console.log('features');
      }
    }
  });

	var container = new Marionette.Region({
		el: "#application"
	});

	App.addInitializer( function () {

		var AppLayoutView = Marionette.LayoutView.extend({
			template: "#template-layout",
			regions: {
				header: "#header",
				content: "#content",
        layerAdd: "#layer-add"
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
    layout.getRegion( 'layerAdd' ).show(
      new LayerAddView( {
        region: layout.getRegion( 'toolbar' ),
        modules: modules
      } )
    );

    new Router();

	});

  App.on("start", function() {
    Backbone.history.start();
  });

	return App;
});
