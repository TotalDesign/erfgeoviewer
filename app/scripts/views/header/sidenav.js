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
      },

      onShow: function() {
        $( '#menu-button' ).sideNav( {
          edge: 'left',
          menuWidth: 300,
          closeOnClick: true
        } );
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