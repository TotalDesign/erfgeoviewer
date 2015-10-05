define(['plugin/abstract', './collections/feature_collection', 'underscore'], function(Plugin, FeatureCollection, _) {
  return Plugin.extend({

    collection: null,

    initialize: function(options) {
      this.collection = new FeatureCollection();
      this.collection.on('add', this.bindFeatureChangeHandler, this);
      this.collection.on('reset', this.bindFeatureCollectionResetHandler, this);
      this.collection.on('add remove', this.save, this);

      options.state.set('geojson_features', this.collection);
    },

    bindFeatureChangeHandler: function (feature) {
      feature.on('change', this.save, this);
    },

    bindFeatureCollectionResetHandler: function (featureCollection) {
      featureCollection.each(this.bindFeatureChangeHandler, this);
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
