/**
 * Functions as an adaptor for field names from results to what the ErfGeoviewer expects
 */
define( ["backbone"], function( Backbone ) {

  return Backbone.Model.extend( {

    defaults: {
      title: "Geen titel",
      image: false,
      description: false,
      youtube: false,
      youtubeid: false,
      externalUrl: false,
      longitude: null,
      latitude: null
    },

    initialize: function() {
      this.set('cid', this.cid );
    }

  } );

});

