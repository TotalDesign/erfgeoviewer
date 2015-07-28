define(["backbone", "models/markers"], function(Backbone, MarkersCollection) {

  return Backbone.Model.extend({

    initialize: function(o) {
      var o = o || {};
      var markers = o.markers || {};
      this.set('markers', new MarkersCollection(markers));
    }

  });

});