define( [ "backbone.marionette", "../communicator"],
  function( Marionette, Communicator ) {

    return Marionette.ItemView.extend( {

      layout: null,
      dom: {},

      initialize: function( o ) {
        this.template = o.template;
        var offset = $( o.event.target ).offset();
        this.top = offset.top;
        this.left = offset.left
      },

      onShow: function() {
        this.top = Math.floor(this.top - this.$el.height() / 2);
        this.left = Math.floor(this.left + 25);
        this.$el.parent().css( 'top', this.top );
        this.$el.parent().css( 'left', this.left );
      }

    } );

  } );