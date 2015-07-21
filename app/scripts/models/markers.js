define(["backbone", "models/search-result"], function(Backbone, SearchResult) {

  return Backbone.Collection.extend({

    model: SearchResult

  });

});