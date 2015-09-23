define(['backbone', 'underscore'], function(Backbone, _) {

  return Backbone.Collection.extend({

    url: 'https://raw.githubusercontent.com/mapbox/maki/mb-pages/_includes/maki.json',

    availableIcons: {},

    promise: null,

    initialize: function() {
      var self = this;

      this.promise = this.fetch({
        error: function() {
          alert("Error: Maki icon collection could not be retrieved from Github.");
        },
        success: function() {
          self.each(function(model) {
            self.availableIcons[model.get('name')] = model.get('icon');
          });
        }
      });
    },

    getAvailableIcons: function() {
      return this.availableIcons;
    },

    getPromise: function() {
      return this.promise;
    }
  });

});