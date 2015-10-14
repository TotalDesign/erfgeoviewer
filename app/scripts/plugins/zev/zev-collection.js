define(['backbone', 'backbone.pageable.collection', 'config', 'models/marker', 'erfgeoviewer.common'],
  function(Backbone, PageableCollection, Config, ResultModel, App) {

    var DelvingResultModel = ResultModel.extend({
      parse: function(fields) {

        var f = {
          title: fields['dc:title'],
          description: fields['dc:description'],
          spatial: this.parseDctermsSpatial(fields)
        };

        // Image
        var img;
        if (fields['dc:type'] == "Foto" && _.isArray(fields['edm:object'])) {
          img = fields['edm:object'][0];
        }
        if (img) f.image = img;

        return f;
      },

      parseDctermsSpatial: function(fields) {
        var geoJSONStrings = [],
          dcTermsSpatial,
          geosHasGeometry,
          geosAsWKT,
          lat,
          long;

        if ( _.isArray(dcTermsSpatial = _.property('dcterms:spatial')(fields)) ) {
          _.each(dcTermsSpatial, function(term) {
            if ( _.isArray(geosHasGeometry = _.property('geos:hasGeometry')(term)) ) {
              _.each(geosHasGeometry, function(geometry) {
                if ( _.isArray(geosAsWKT = _.property('geos:asWKT')(geometry)) ) {
                  _.each(geosAsWKT, function(wkt) {
                    geoJSONStrings.push(wkt);
                  });
                }
              });
            }
            else if ( (lat = _.property('geo:lat')(term)) && (long = _.property('geo:long')(term)) ) {
              geoJSONStrings.push('POINT(' + long + ' ' + lat + ')');
            }
          });
        }

        return geoJSONStrings;
      }
    });

    return PageableCollection.extend({

      model: DelvingResultModel,
      queryParams: {
        currentPage: null,
        pageSize: null,
        totalPages: null,
        totalRecords: null,
//        facets: 'dc:subject:4,dc:type:4,edm:dataProvider:4',
        maximumRecords: function() {
          return this.state.maxRecords;
        },
        startRecord: function() {
          return (this.state.currentPage -1) * this.state.pageSize +1;
        },
        query: function() {
          var query = {
            type: 'AND',
            values: [
              this.state.terms
            ]
          };

          if (_.isEmpty(this.state.facets) && _.isObject(Config.zoek_en_vind.facets)) {
            query.values.push(Config.zoek_en_vind.facets);
          }
          else if (!_.isEmpty(this.state.facets)) {
            query.values.push({
              type: 'AND',
              values: this.state.facets
            });
          }

          if (App.mode == 'mapmaker' && _.isEmpty(this.state.geoFence)) {
            // Add filter to only return items with geo info #8899
            query.values.push({
              type: 'AND',
              values: [
                'minGeoLat=-90',
                'minGeoLong=-180',
                'maxGeoLat=90',
                'maxGeoLong=180'
              ]
            });
          }

          if (!_.isEmpty(this.state.geoFence)) {
            query.values.push(this.state.geoFence);
          }

          return this.renderQuery(query);
        }
      },
      state: {
        d: 100,
        firstPage: 1,
        pageSize: 30,
        maxRecords: 30,
        terms: "*",
        facets: [], // Always AND
        facetConfig: null,
        geoFence: null
      },
      url: Config.zoek_en_vind.uri + '/search',

      renderQuery: function(query) {
        var self = this;

        _.each(query.values, function(value, key) {
          if (_.isObject(value)) {
            query.values[key] = '(' + self.renderQuery(value) + ')';
          }
        });

        return query.values.join(' ' + query.type + ' ');
      },
      getFacetConfig: function() {
        return new Backbone.Collection(this.state.facetConfig);
      },
      getFacetState: function(resp) {
        var facetConfig = [];

        _.each(resp.result.facets, function(options, name) {
          if (!_.isUndefined(Config.zoek_en_vind.facetLabels)
          && !_.isUndefined(Config.zoek_en_vind.facetLabels[name])) {
            name = Config.zoek_en_vind.facetLabels[name];
          }
          facetConfig.push({
            name: name,
            options: options
          });
        });

        return facetConfig;
      },
      hasNext: function() {
        return this.hasNextPage();
      },
      hasPrevious: function() {
        return this.hasPreviousPage();
      },
      parseRecords: function(resp) {
        return resp.result.items;
      },
      parseState: function(resp) {
        return {
          facetConfig: this.getFacetState(resp),
          totalRecords: resp.result.total
        }
      }

    });

  });