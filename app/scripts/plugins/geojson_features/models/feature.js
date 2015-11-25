/**
 * Functions as an adaptor for field names from results to what the ErfGeoviewer expects
 */
define( ["backbone", "backbone.mutators", "underscore", "config", "models/state"],
function( Backbone, BackboneMutators, _, Config, State ) {

  return Backbone.Model.extend( {

    defaults: {
      __id__: 0,
      type: "marker",
      userColor: null,
      icon: '',
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

    mutators: {
      color: {
        get: function() {
          return _.isEmpty(this.get('userColor')) ? State.getPlugin('map_settings').model.get('primaryColor') : this.get('userColor');
        },
        transient: true
      },
      geoJSON: {
        get: function() {
          return this.convertToGeoJSON();
        },
        transient: true
      }
    },

    initialize: function() {
      this.set('cid', this.cid );
      this.on('change:spatial change:latitude change:longitude', this.onChangeGeometryType, this);
      // Initialize geometry type
      this.onChangeGeometryType();
    },

    convertToGeoJSON: function() {

      var defaultProperties, geojson, spatial;

      if (spatial = this.get( 'spatial' )) {

        switch (this.get( 'geometryType' )) {
          case 'POINT':
            defaultProperties = {
              title: this.get('title'),
              'marker-color': this.get('color')
            };
            if (this.get('icon')) defaultProperties['marker-symbol'] = this.get('icon');
            break;

          default:
            defaultProperties = {
              title: this.get('title'),
              fill: this.get('color'),
              stroke: this.get('color'),
              'marker-color': this.get('color'),
              'marker-symbol': this.get('icon')
            };
            break;
        }

        if (_.isEmpty(this.get( 'spatial' )) && (!this.get( 'latitude' ) || !this.get( 'longitude' ))) {
          return false;
        }
        geojson = _.extend(sparqlToGeoJSON(this.get( 'spatial' )[0]), { properties: defaultProperties });

      }
      else {

        geojson = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [this.get( 'longitude' )[0], this.get( 'latitude' )[0]]
          },
          properties: {
            title: this.get('title')
          }
        };
        if (this.get('color')) geojson.properties['marker-color'] = this.get('color');
        if (this.get('icon')) geojson.properties['marker-symbol'] = this.get('icon');

      }

      return geojson;
    },

    onChangeGeometryType: function() {
      var wkt, geometryType;

      // If spatial info is available
      if (_.isArray(this.get('spatial')) && !_.isUndefined(this.get('spatial')[0])) {
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

