/**
 * Responsible for sliding the detail pane in/out, and instantiating views that goes inside of it.
 */
define([
    'backbone', 'backbone.marionette', 'communicator', 'jquery',
    "views/detail"
  ],

  function( Backbone, Marionette, Communicator, $,
            DetailView) {
    'use strict';

    return Marionette.ItemView.extend({

      // Element to which this view's containing region is attached.
      $container: null,

      // Child element where new view could be shown.
      region: null,

      template: _.template("<div id='detail-slideout-child'></div>"),

      initialize: function( o ) {

        var self = this;
        Communicator.mediator.on("marker:click", function(m) {
          self.showFlyout();
          self.region.show( new DetailView( { model: m } ));
        });

        Communicator.mediator.on( "map:tile-layer-clicked", function() {
          self.hideFlyout();
        } );

      },

      onShow: function() {
        this.$container = this.$el.parent();
        var r = Marionette.Region.extend({
          el: '#detail-slideout-child'
        });
        this.region = new r();
      },

      // --

      hideFlyout: function() {
        this.$container.removeClass('visible');
      },

      showFlyout: function() {
        this.$container.addClass('visible');
      }


    })

  }
);
