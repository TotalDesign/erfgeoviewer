define(['backbone', '../models/feature', 'communicator'], function(Backbone, Feature, Communicator) {

  return Backbone.Collection.extend({

    model: Feature,

    initialize: function() {
      Communicator.mediator.on( 'marker:removeModelByCid', this.removeModelByCid, this );
    },

    removeModelByCid: function(cid) {
      var model = this.findWhere({ cid: cid });
      this.remove(model);
    }

  });

});