define( ["backbone"], function( Backbone ) {

  return Backbone.Model.extend( {

    defaults: {
      image: false
    },

    initialize: function() {

      var img = _.find( this.get( 'item' ).fields.delving_resourceUri, function( resource ) {
        var imageRegex = /.*\.(jpg|jpeg)$/;
        return imageRegex.test(resource);
      });
      if (img) this.set('image', img);

      var youtube = _.find( this.get( 'item' ).fields.delving_resourceUri, function( resource ) {
        var reg = /youtube\.com/;
        return reg.test(resource);
      });
      if (youtube) {
        console.log(youtube);
        var reg = /v=([^&]*)/;
        if ( youtube.match(reg ) ) {
          this.set('image', "http://img.youtube.com/vi/" + youtube.match(reg)[1] + "/0.jpg");
        }
        this.set('youtube', youtube);
      }

    }

  } );

});