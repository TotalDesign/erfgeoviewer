define( ["backbone", "backbone.marionette", "materialize.sidenav",
        "jquery.hammer", "communicator", "jquery", "tpl!template/header.html"],
  function( Backbone, Marionette, Materialize, jQueryHammer, Communicator, $, Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,

      onShow: function() {
        $( '#menu-button' ).sideNav( {
          edge: 'left',
          menuWidth: 300,
          closeOnClick: true
        } );
        Communicator.mediator.trigger("header:shown");
      }

    } );

  } );