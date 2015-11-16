/**
 * Flyout view "Zoeken". A search module is loaded inside of here.
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

        Communicator.mediator.on("search:toggleAdvancedSearch", this.toggleAdvancedSearch, this);
        Communicator.mediator.on("search:updateTabindices", this.updateTabindices, this);
      },

      onRender: function() {
        this.searchModule.showModule( this.search );
      },

      onShow: function() {
        this.$el.parent().addClass( "visible" );
        this.$el.parent().addClass( "search-normal" );
        this.updateTabindices();
      },

      onBeforeDestroy: function() {
        this.$el.parent().removeClass( "visible search-normal search-advanced" );
        Communicator.mediator.trigger( "search:destroyed" );
        Communicator.mediator.off("search:toggleAdvancedSearch", this.toggleAdvancedSearch, this);
      },

      toggleAdvancedSearch: function() {
        var parent = this.$el.parent();
        parent.toggleClass( "search-normal" );
        parent.toggleClass( "search-advanced" );
        this.updateTabindices();
      },

      updateTabindices: function() {
        var parent = this.$el.parent();
        if (parent.hasClass("search-normal")) {
          //normal search visible, remove all advanced search elements from tab order
          $(".advanced :input, .advanced a", parent).attr("tabindex", -1);
        } else {
          //advanced search visible, set default tab order to all advanced search elements
          $(".advanced :input, .advanced a", parent).attr("tabindex", 0);
        }
      }

    });

  }
);