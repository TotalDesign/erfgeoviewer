/**
 * Provides functionality to place a view inside of a flyout-pane.
 */
define([
    'backbone.marionette', 'communicator', 'underscore'
  ],

  function( Marionette, Communicator, _ ) {
    'use strict';

    return Marionette.Region.extend({

      // Element to which this view's containing region is attached.
      $container: null,

      onShow: function() {
        this.$el.addClass('visible');
        this.$container = this.$el;
      },

      hideFlyout: function() {
        if (this.$container)
          this.$container.removeClass('visible');
      },

      isVisible: function() {
        if (!this.$el) return false;
        return this.$container.hasClass('visible');
      }


    })

  }
);
