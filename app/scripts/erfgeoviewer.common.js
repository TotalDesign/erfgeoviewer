define( ['backbone', 'backbone.marionette', 'communicator', 'velocity',
         'views/layout/app.layout', 'views/layout/flyouts.layout'],

  function( Backbone, Marionette, Communicator, V,
            AppLayout, FlyoutsLayout ) {
    'use strict';

    var App = new Marionette.Application();

    var container = new Marionette.Region( {
      el: "#erfgeoviewer"
    } );

    App.layout = new AppLayout();
    App.layout.render();
    container.show( App.layout );

    App.flyouts = new FlyoutsLayout();
    App.flyouts.render();
    App.layout.getRegion('flyout').show( App.flyouts );

    Communicator.mediator.on("map:tile-layer-clicked", function() {
      if (!App.flyouts.getRegion('detail').hasView() || !App.flyouts.getRegion('detail').isVisible() ) {
        App.flyouts.getRegion('right').hideFlyout();
        App.router.navigate("");
      }
      App.flyouts.getRegion('bottom').hideFlyout();
      App.flyouts.getRegion('detail').hideFlyout();
    });

    App.on( "start", function() {
      Backbone.history.start();
    } );

    return App;
  } );
