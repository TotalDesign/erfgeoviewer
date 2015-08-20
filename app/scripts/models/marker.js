/**
 * Functions as an adaptor for field names from results to what the ErfGeoviewer expects
 */
define( ["backbone"], function( Backbone ) {

  return Backbone.Model.extend( {

    defaults: {
      description: false,
      externalUrl: false,
      image: false,
      longitude: null,
      latitude: null,
      layerGroup: "default",
      title: "Geen titel",
      youtube: false,
      youtubeid: false
    },

    initialize: function() {
      this.set('cid', this.cid );
    }

  } );

});

