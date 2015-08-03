define(["backbone", "models/markers", 'backbone.localstorage'],
  function(Backbone, MarkersCollection, LS) {

  return Backbone.Model.extend({

    localStorage: new Backbone.LocalStorage("state"),

    initialize: function(o) {
      var self = this;
      var o = o || {};
      var markers = o.markers || {};
      this.set('markers', new MarkersCollection(markers));
    },

    parse: function(response, options) {
      this.set('markers', new MarkersCollection(response.markers));
      console.log(response);
      this.set('baseMap', response.baseMap);
    }

  });

});