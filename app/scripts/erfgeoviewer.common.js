define( ['backbone', 'backbone.marionette', 'communicator', 'velocity',
         'views/layout/app.layout', 'views/layout/flyouts.layout'],

  function( Backbone, Marionette, Communicator, V,
            AppLayout, FlyoutsLayout ) {
    'use strict';

    var App = new Marionette.Application(),
      container = new Marionette.Region( {
        el: "#erfgeoviewer"
      }),
      closeOnClick = true;

    App.layout = new AppLayout();
    App.layout.render();
    container.show( App.layout );

    App.flyouts = new FlyoutsLayout();
    App.flyouts.render();
    App.layout.getRegion('flyout').show( App.flyouts );

    Communicator.mediator.on('map:setCloseOnClick', function(value) {
      closeOnClick = value;
    });

    Communicator.mediator.on("map:tile-layer-clicked", function() {
      if (!closeOnClick) {
        return;
      }

      if (!App.flyouts.getRegion('detail').hasView() || !App.flyouts.getRegion('detail').isVisible() ) {
        App.flyouts.getRegion('right').hideFlyout();
        var router = Communicator.reqres.request("router:get");
        window.location.assign("#");
      }
      App.flyouts.getRegion('bottom').hideFlyout();
      App.flyouts.getRegion('detail').hideFlyout();
    });

    App.on( "start", function() {
      Backbone.history.start();
    } );

    return App;
  } );
