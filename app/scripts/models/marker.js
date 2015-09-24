/**
 * Functions as an adaptor for field names from results to what the ErfGeoviewer expects
 */
define( ["backbone", "underscore"], function( Backbone, _ ) {

  return Backbone.Model.extend( {

    defaults: {
      description: false,
      externalUrl: false,
      image: false,
      spatial: null,
      longitude: null,
      latitude: null,
      layerGroup: "default",
      title: "Geen titel",
      youtube: false,
      youtubeid: false,
      geometryType: 'POINT'
    },

    initialize: function() {
      this.set('cid', this.cid );
      this.on('change:spatial change:latitude change:longitude', this.onChangeGeometryType, this);
      // Initialize geometry type
      this.onChangeGeometryType();
    },

    onChangeGeometryType: function() {
      var wkt, geometryType;

      // If spatial info is available
      if (!_.isUndefined(this.get('spatial')[0])) {
        wkt = this.get('spatial')[0];
        geometryType = wkt.substr(0, wkt.indexOf("("));
      }

      // Revert to POINT
      if (_.isEmpty(geometryType)) {
        geometryType = 'POINT';
      }

      this.set({ geometryType: geometryType }, { silent: true });
    }

  } );

});

