define( ["backbone", "backbone.marionette", "materialize.sidenav", "jquery.hammer", "communicator", "jquery",
    'views/publish', 'views/open', "tpl!template/header.html"],
  function( Backbone, Marionette, Materialize, jQueryHammer, Communicator, $,
            PublishView, OpenView, Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,

      events: {
        'click .open': function(e) {
          e.preventDefault();
          this.modalRegion.show(
            new OpenView()
          );
        }
      },

      initialize: function(o) {
        this.modalRegion = o.modalRegion;
      },

      onShow: function() {
        $( '#menu-button' ).sideNav( {
          edge: 'left',
          menuWidth: 300,
          closeOnClick: true
        } );
      }

    } );

  } );