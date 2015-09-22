/**
 * Slideout view "Add markers".
 */
define(['backbone', 'backbone.marionette', 'communicator', 'jquery',
    'tpl!template/search/layout-flyout.html'],
  function( Backbone, Marionette, Communicator, $,
            LayoutTemplate ) {

    return Marionette.LayoutView.extend({

      template: LayoutTemplate,

      events: {
        'click .hide-flyout': function(e) {
          Communicator.mediator.trigger('flyouts:hideRegionById', $(e.target).closest('.region').attr('id'));
        }
      },

      regions: {
        search: "#search-region"
      },

      initialize: function(o) {

        this.container = o.region;
        this.searchModule = o.searchModule;
        this.render();

      },

      onRender: function() {
        this.searchModule.showModule( this.search );
      },

      onShow: function() {
        var self = this;
        this.$el.parent().addClass( "visible" );
      },

      onBeforeDestroy: function() {
        this.$el.parent().removeClass( "visible" );
      }

    });

  }
);