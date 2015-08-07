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
        this.$body = $('body');
        this.$body.addClass( this.$container.attr('id') + '-visible' );
      },

      hideFlyout: function() {
        if (this.$container) {
          this.$body.removeClass( this.$container.attr('id') + '-visible' );
          this.$container.removeClass( 'visible' );
        }
      },

      onBeforeDestroy: function() {
        if (this.$container) {
          this.$body.removeClass( this.$container.attr('id') + '-visible' );
        }
      },

      isVisible: function() {
        if (!this.$el) return false;
        return this.$container.hasClass('visible');
      }


    })

  }
);
