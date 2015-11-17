define( ['backbone', 'backbone.marionette', 'models/state', 'models/sidenav', 'materialize.sidenav',
  'views/header/nav-item', 'tpl!template/header/sidenav.html'],
  function( Backbone, Marionette, State, SideNav, SideNavLib, ItemView, Template ) {

    return Marionette.CompositeView.extend({

      childView: ItemView,

      childViewContainer: "#slide-out",

      collection: SideNav,

      template: Template,

      initialize: function() {
        this.collection.on('change add remove', this.render, this);

        //event handlers to update tabindex on main menu close
        $(document).on("click", "#menu-button", this.updateTabindices);
        $(document).on("click", "drag-target", this.updateTabindices);
        $(document).on("click", "#sidenav-overlay", this.updateTabindices);
      },

      events: {
        "click #menu-button": function(e) {
          console.log("menu open");
        }
      },

      onShow: function() {
        var menuButton = $("#menu-button");
        menuButton.sideNav( {
          edge: 'left',
          menuWidth: 300,
          closeOnClick: true
        } );
        //event handler to update tabindex on main menu close
        $("#"+ menuButton.attr('data-activates')).on("click.itemclick", "a:not(.collapsible-header)", this.updateTabindices);
      },

      updateTabindices: function() {
        if ($('body').css('overflow') === "hidden") {
          //menu is open, enable tabbing into the menu items
          $(".side-nav li a").attr("tabindex", 0);
        } else {
          //menu is closed, disable tabbing into the menu items
          $(".side-nav li a").attr("tabindex", -1);
        }
      },

      serializeData: function() {
        var data = {
          count: this.collection.length
        };

        if (this.model) {
          data = _.partial(this.serializeModel, this.model).apply(this, arguments);
        }

        return data;
      }

    });

  });