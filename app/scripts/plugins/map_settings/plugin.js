define(['plugin/abstract', './models/settings', 'underscore'], function(Plugin, SettingsModel, _) {
  return Plugin.extend({

    model: null,

    initialize: function(options) {
      this.model = new SettingsModel();

      this.model.on('change', this.save, this);

      options.state.set('map_settings', this.model);
    },

    reset: function() {
      this.model.set(this.model.defaults);
    },

    readData: function(resp) {
      // If there is data, then populate the collection
      if (!_.isUndefined(resp)) {
        this.model.set(resp, { silent: true });
      }
      return this.model;
    },

    writeData: function () {
      return this.model.toJSON();
    }
  });
});
