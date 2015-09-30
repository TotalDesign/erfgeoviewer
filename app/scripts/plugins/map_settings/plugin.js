define(['plugin/plugin', './models/settings', 'underscore'], function(Plugin, SettingsModel, _) {
  return Plugin.extend({

    model: null,

    initialize: function() {
      this.model = new SettingsModel();

      this.model.on('change', this.save, this);
    },

    readData: function(resp) {
      // If there is data, then populate the collection
      if (!_.isUndefined(resp)) {
        this.model.set(resp);
      }
      return this.model;
    },

    writeData: function () {
      return this.model.toJSON();
    }
  });
});
