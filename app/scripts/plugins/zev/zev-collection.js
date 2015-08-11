define(['backbone', 'backbone.pageable.collection', 'config', 'models/search-result'],
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
      hasPrevious: function() {
        return this.hasPreviousPage();
      },
      hasNext: function() {
        return this.hasNextPage();
      },
      model: DelvingResultModel,
      queryParams: {
        currentPage: null,
        pageSize: null,
        totalPages: null,
        totalRecords: null,
        query: function() {
          return this.state.terms;
        }
      },
      parseRecords: function(resp) {
        return resp.result.items;
      },
      parseState: function(resp) {
        return {
          facets: resp.result.facets,
          totalRecords: resp.result.total
        }
      },
      state: {
        d: 100,
        firstPage: 1,
        terms: "*"
      },
      url: Config.zoek_en_vind.uri + '/search'
    });

  });