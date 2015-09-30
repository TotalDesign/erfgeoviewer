define(['plugin/plugin', './collections/feature_collection', 'underscore'], function(Plugin, FeatureCollection, _) {
  return Plugin.extend({

    collection: null,

    initialize: function() {
      this.collection = new FeatureCollection();
      this.collection.on('add', this.bindFeatureChangeHandler, this);
      this.collection.on('add remove', this.save, this);
    },

    bindFeatureChangeHandler: function (feature) {
      feature.on('change', this.save, this);
    },

    readData: function(resp) {
      // If there is data, then populate the collection
      if (!_.isUndefined(resp)) {
        this.collection.reset(resp);
      }
      return this.collection;
    },

    writeData: function () {
      return this.collection.toJSON();
    }
  });
});
