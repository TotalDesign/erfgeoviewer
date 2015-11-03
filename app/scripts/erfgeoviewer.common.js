define( ['backbone', 'backbone.marionette', 'config', 'communicator', 'velocity',
         'views/layout/app.layout', 'views/layout/flyouts.layout', 'models/maki'],

  function( Backbone, Marionette, Config, Communicator, V,
            AppLayout, FlyoutsLayout, MakiCollection ) {
    'use strict';

    // Append maki icon collection to config
    Config.makiCollection = new MakiCollection();

    var App = new Marionette.Application(),
        closeOnClick = true;

    App.container = new Marionette.Region( {
      el: "#erfgeoviewer"
    } );

    App.layout = new AppLayout();
    App.layout.render();
    App.container.show( App.layout );

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
        window.location.assign("#");
      }
      App.flyouts.getRegion('bottom').hideFlyout();
      App.flyouts.getRegion('detail').hideFlyout();
    });

    //browser-update.org check to show a warning message on older browsers
    var $buoop = { c:2 };
    var e = document.createElement("script");
    e.src = "//browser-update.org/update.min.js";
    document.body.appendChild(e);

    App.on( "start", function() {
      Backbone.history.start();
    } );

    return App;
  } );
