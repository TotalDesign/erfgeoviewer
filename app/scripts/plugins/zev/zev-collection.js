define(['backbone', 'backbone.pageable.collection', 'config', 'models/marker'],
  function(Backbone, PageableCollection, Config, ResultModel) {

    var DelvingResultModel = ResultModel.extend({
      parse: function(fields) {

        var f = {
          title: fields['dc:title'],
          description: fields['dc:description']
          //latitude: fields['dcterms:spactial:']delving_locationLat,
          //longitude: fields.delving_locationLong
        };

        // Image
        var img;
        if (fields['dc:type'] == "Foto" && _.isArray(fields['edm:object'])) {
          img = fields['edm:object'][0];
        }
        if (img) f.image = img;

        return f;
      }
    });

    return PageableCollection.extend({

      model: DelvingResultModel,
      queryParams: {
        currentPage: null,
        pageSize: null,
        totalPages: null,
        totalRecords: null,
        maximumRecords: function() {
          return this.state.maxRecords;
        },
        startRecord: function() {
          return (this.state.currentPage -1) * this.state.pageSize +1;
        },
        query: function() {
          var query = [this.state.terms].concat(this.state.facets);
          return query.join(' AND ');
        }
      },
      state: {
        d: 100,
        firstPage: 1,
        pageSize: 10,
        maxRecords: 10,
        terms: "*",
        facets: []
      },
      url: Config.zoek_en_vind.uri + '/search',

      getFacetConfig: function() {
        return new Backbone.Collection(this.state.facetConfig);
      },
      getFacetState: function(resp) {
        var facetConfig = [];

        _.each(resp.result.facets, function(options, name) {
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