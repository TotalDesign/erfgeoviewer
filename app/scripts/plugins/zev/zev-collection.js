define(['backbone', 'backbone.pageable.collection', 'config', 'communicator', 'plugin/geojson_features/models/feature', 'erfgeoviewer.common'],
  function(Backbone, PageableCollection, Config, Communicator, ResultModel, App) {

    var ResultModel = ResultModel.extend({
      parse: function(fields) {

        var f = {
          title: fields['dc:title'],
          description: fields['dc:description'],
          creator: fields['dc:creator'],
          __id__: fields['@id'],
          subject: fields['subject'],
          source: fields['edm:dataProvider'],
          externalUrl: fields['edm:isShownAt'],
          isShownBy: fields['edm:isShownBy'],
          objectType: fields['dc:type'],
          spatial: this.parseDctermsSpatial(fields),
          year: Math.floor(Math.random() * (2015 - 1600)) + 1600    //TODO: get real data from the API
        };

        if (_.isArray(f.title)) f.title = f.title.join(', ');

        // Image
        var img, ext;
        if (_.isArray(fields['edm:object'])) {
          ext = fields['edm:object'][0].match(/\.[0-9a-z]+$/i);
          if (ext && _.contains(['.jpg', '.jpeg', '.png', '.gif'], ext[0]) || (_.isArray(fields['edm:type']) && fields['edm:type'][0] == "IMAGE"))
            img = fields['edm:object'][0];
        }
        if (img) f.image = img;

        // Title defaults to a shortened description if need be
        if (!fields['dc:title'] && fields['dc:description']) {
          var words = fields['dc:description'][0].split(/\s+/);
          var max = 120;
          var newtitle;
          for (var i = words.length; i >= 0; i--) {
            newtitle = words.slice(0, i).join(" ");
            if (newtitle.length < max) break;
          }
          f.title = newtitle;
        }

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

    var MODE_ADVANCED = 'advanced',
      MODE_SIMPLE = 'simple';

    return PageableCollection.extend({

      model: ResultModel,

      searchMode: 'simple',

      queryParams: {
        currentPage: null,
        pageSize: null,
        totalPages: null,
        totalRecords: null,
        facets: function() {
          return _.isArray(Config.zoek_en_vind.requestedFacets) ?
            Config.zoek_en_vind.requestedFacets.join(',') : 'dc:subject,edm:dataProvider,dc:date.year';
        },
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
              '"' + this.state.terms + '"'
            ]
          };

          if (_.isEmpty(this.state.facets) && _.isObject(Config.zoek_en_vind.facets)) {
            query.values.push(Config.zoek_en_vind.facets);
          }
          else if (!_.isEmpty(this.state.facets) && this.searchMode == MODE_ADVANCED) {
            query.values.push({
              type: 'AND',
              values: this.state.facets
            });
          }

          if (!_.isEmpty(this.state.date.from) && this.searchMode == MODE_ADVANCED) {
            query.values.push({
              type: 'AND',
              values: ['dc:date.year >= ' + this.state.date.from]
            });
          }

          if (!_.isEmpty(this.state.date.to) && this.searchMode == MODE_ADVANCED) {
            query.values.push({
              type: 'AND',
              values: ['dc:date.year <= ' + this.state.date.to]
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
        date: {
          from: '',
          to: ''
        },
        facets: [], // Always AND
        facetConfig: null,
        geoFence: null
      },
      url: Config.zoek_en_vind.uri + '/search',

      initialize: function() {
        Communicator.mediator.on('search:toggleAdvancedSearch', this.toggleSearchMode, this);
      },

      toggleSearchMode: function() {
        this.searchMode = this.searchMode == MODE_SIMPLE ? MODE_ADVANCED : MODE_SIMPLE;
      },

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
        var facetName, facetKey;

        _.each(resp.result.facets, function(options, name) {
          if (!_.isUndefined(Config.zoek_en_vind.facetLabels)
          && !_.isUndefined(Config.zoek_en_vind.facetLabels[name])) {
            facetKey = name;
            facetName = Config.zoek_en_vind.facetLabels[name];
          } else {
            facetKey = name;
            facetName = name;
          }
          facetConfig.push({
            name: facetName,
            key: facetKey,
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