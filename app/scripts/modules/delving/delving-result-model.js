/**
 * Functions as an adaptor for field names from results to what the ErfGeoviewer expects
 */
define( ["backbone", "models/search-result"], function( Backbone, SearchResultModel ) {

  return SearchResultModel.extend( {

    initialize: function() {

      this.set('cid', this.cid );

      var fields = this.get( 'item' ).fields;

      // Title
      this.set('title', fields.dc_title );
      this.set('description', fields.dc_description );

      // Image
      var img = _.find( fields.delving_resourceUri, function( resource ) {
        var imageRegex = /.*\.(jpg|jpeg)$/;
        return imageRegex.test(resource);
      });
      if (img) this.set('image', img);

      // Youtube
      var youtube = _.find( fields.delving_resourceUri, function( resource ) {
        var reg = /youtube\.com/;
        return reg.test(resource);
      });
      if (youtube) {
        var reg = /v=([^&]*)/;
        if ( youtube.match(reg ) ) {
          this.set('image', "http://img.youtube.com/vi/" + youtube.match(reg)[1] + "/0.jpg");
          this.set( 'youtubeid', youtube.match( reg )[1] );
        }
        this.set('youtube', youtube);
      }

      // point
      this.set('latitude', fields.delving_locationLat);
      this.set('longitude', fields.delving_locationLong);

    }

  } );

});