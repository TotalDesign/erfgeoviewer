define(["backbone", "models/marker"], function(Backbone, SearchResult) {

  return Backbone.Collection.extend({

    model: SearchResult

  });

});