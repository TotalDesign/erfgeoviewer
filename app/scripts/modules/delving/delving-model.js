define( ["backbone.marionette", "config"],
  function( Marionette, Config ) {

    return Backbone.Model.extend( {

      defaults: {
        latlongField: "delving_locationLatLong_location",
        numfound: 0,
        searchDistance: 100,
        terms: ''
      },
      urlRoot: Config.delving.uri + '/search',
      url: function() {
        var filters = '';
        if (this.get('lat') && this.get('lng')) {
          filters += '&pt=' + this.get('lat') + ',' + this.get('lng')
            + '&d=' + this.get('searchDistance')
            + '&sfield=' + this.get('latlongField');
        }
        return this.urlRoot + '?format=json&query=' + this.get( 'terms' ) + filters;
      }

    } )

  } );