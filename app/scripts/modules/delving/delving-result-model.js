/**
 * Functions as an adaptor for field names from results to what the ErfGeoviewer expects
 */
define( ["backbone", "models/search-result"], function( Backbone, SearchResultModel ) {

  return SearchResultModel.extend( {

    initialize: function() {

      this.set('cid', this.cid );

      var fields = this.get( 'item' ).fields;



    }

  } );

});