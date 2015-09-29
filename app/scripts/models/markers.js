define(['backbone', 'models/marker', 'communicator'], function(Backbone, SearchResult, Communicator) {

  return Backbone.Collection.extend({

    model: SearchResult,

    initialize: function() {
      Communicator.mediator.on( "marker:removeModelByCid", this.removeModelByCid, this );
    },

    removeModelByCid: function(cid) {
      var model = this.findWhere({ cid: cid });
      this.remove(model);
    }

  });

});