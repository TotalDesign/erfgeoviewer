define(["backbone"], function(Backbone) {

  var MarkerModel = Backbone.Model.extend({});

  return Backbone.Collection.extend({

    model: MarkerModel

  });

});