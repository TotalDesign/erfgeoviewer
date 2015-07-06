define( ["backbone.marionette", "config"],
  function( Marionette, Config ) {

    return Backbone.Model.extend( {

      urlRoot: Config.delving.uri + '/search',
      url: function() {
        return this.urlRoot + '?format=json&query=' + this.get( 'terms' )
      }

    } )

  } );