define(['backbone', 'backbone.pageable.collection', 'config', 'models/search-result'],
  function(Backbone, PageableCollection, Config, ResultModel) {

    var DelvingResultModel = ResultModel.extend({
      parse: function(res) {

        var fields = res.item.fields;

        var f = {
          title: fields.dc_title,
          description: fields.dc_description,
          latitude: fields.delving_locationLat,
          longitude: fields.delving_locationLong
        };

        // Image
        var img = _.find( fields.delving_resourceUri, function( resource ) {
          var imageRegex = /.*\.(jpg|jpeg)$/;
          return imageRegex.test(resource);
        });
        if (img) f.image = img;

        // Youtube
        var youtube = _.find( fields.delving_resourceUri, function( resource ) {
          var reg = /youtube\.com/;
          return reg.test(resource);
        });
        if (youtube) {
          var reg = /v=([^&]*)/;
          if ( youtube.match(reg ) ) {
            f.image = "http://img.youtube.com/vi/" + youtube.match(reg)[1] + "/0.jpg";
            f.youtubeid = youtube.match( reg )[1];
          }
          f.youtube = youtube;
        }

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
        format: 'json',
        pt: function() {
          return this.state.lat + ',' + this.state.lng;
        },
        d: function() {
          return Math.round(this.state.searchDistance);
        },
        sfield: "delving_locationLatLong_location",
        query: function() {
          return this.state.terms;
        },
        start: function() {
          return (this.state.currentPage - this.state.firstPage) * this.state.pageSize;
        }
      },
      parseRecords: function(resp) {
        this.state.facets = resp.result.facets;
        this.state.pagination = resp.result.pagination;
        return resp.result.items;
      },
      state: {
        d: 100,
        firstPage: 1,
        terms: "*"
      },
      url: Config.delving.uri + '/search'
    });

});