/**
 * Provides functionality to place a view inside of a flyout-pane.
 */
define([
    'backbone.marionette', 'jquery', 'jquery.hammer', 'communicator', 'underscore'
  ],

  function( Marionette, $, jQueryHammer, Communicator, _ ) {
    'use strict';

    return Marionette.Region.extend({

      // Element to which this view's containing region is attached.
      $container: null,

      onShownWrapper: null,
      onHiddenWrapper: null,

      initialize: function() {
        this.onShownWrapper = _.bind( this.onShown, this );
        this.onHiddenWrapper = _.bind( this.onHidden, this );
      },

      onShow: function() {
        this.$el.on( 'transitionend', this.onShownWrapper );

        if (this.options.el == '#flyout-detail') {
          this.$el.hammer().bind('swiperight', _.bind(this.hideFlyout, this));
        }

        this.$el.addClass('visible');
        this.$container = this.$el;
        this.$body = $('body');
        this.$body.addClass( this.$container.attr('id') + '-visible' );
      },

      onShown: function() {
        this.$el.off( 'transitionend', this.onShownWrapper );
      },

      hideFlyout: function() {
        if (this.$container && this.currentView) {
          this.currentView.trigger('hide');
          this.$el.on( 'transitionend', this.onHiddenWrapper );

          this.$body.removeClass( this.$container.attr('id') + '-visible' );
          this.$container.removeClass( 'visible' );
        }
      },

      onHidden: function() {
        if (!this.$el) return;
        this.$el.off( 'transitionend', this.onHiddenWrapper );
        this.reset();
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
