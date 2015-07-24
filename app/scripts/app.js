define([
	'backbone', 'backbone.marionette', 'communicator', 'velocity',
  'models/layers', 'models/markers',
	'views/map', 'views/header', 'views/markers', "views/detail-slideout",
    'modules/routeyou/routeyou'

    // Search modules
    //,'modules/zev/zev'
    ,'modules/delving/delving'
],

function( Backbone, Marionette, Communicator, $,
          LayerCollection, MarkerCollection,
					MapView, HeaderView, MarkerAddView, DetailSlideoutView,
          RouteyouModule,
          SearchModule ) {
    'use strict';

	var App = new Marionette.Application();

	var container = new Marionette.Region({
		el: "#application"
	});


	App.addInitializer( function () {

   /**
     * Layout
     */
		var AppLayoutView = Marionette.LayoutView.extend({
			template: "#template-layout",
			regions: {
				header: "#header",
				content: "#content",
        layerAdd: "#layer-add",
        details: "#details"
			}
		});

		var layout = new AppLayoutView();
		layout.render();
		container.show(layout);

   var marker_collection = new MarkerCollection();
   var layer_collection = new LayerCollection();

   var map_view = new MapView( {
      layout: layout,
      layers: layer_collection,
      markers: marker_collection
   } );
   layout.getRegion( 'content' ).show( map_view );
   layout.getRegion( 'header' ).show( new HeaderView() );
   layout.getRegion( 'details' ).show( new DetailSlideoutView() );

   Communicator.mediator.on( "all", function(e, a) {
      console.log("event", e);
   });

   /**
     * Modules
     */
   var modules = [];

   //modules.push(new RouteyouModule());
   modules.push(new SearchModule({
      markers_collection: marker_collection
   }));


   /**
     * Routes
     */
   var Router = Marionette.AppRouter.extend({
      routes : {
        "" : function() {
          layout.getRegion( 'layerAdd' ).reset();
        },
        "markers" : function() {
          console.log('route:markers');
          layout.getRegion( 'layerAdd' ).show(
            new MarkerAddView( {
              modules: modules
            } )
          );
        },
        "base": function() {
          console.log('base');
        },
        "features": function() {
          console.log('features');
        }
      }
   });
   new Router();

	});

  App.on("start", function() {
    Backbone.history.start();
  });

	return App;
});
