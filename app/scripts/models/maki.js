define(['backbone', 'underscore', 'q'], function(Backbone, _, Q) {

  return Backbone.Collection.extend({

    url: '/data/maki.json',

    model: Backbone.Model,

    comparator: 'name',

    fetch: function(options) {
      options = _.extend({ parse: true }, options);

      var success = options.success,
        error = options.error,
        d = Q.defer();

      options.success = _.bind(function(resp) {
        if (success) success.call(options.context, collection, resp, options);

        this.add(new Backbone.Model({
          name: '-- Geen --',
          icon: ''
        }));

        d.resolve();
      }, this);

      options.error = function(resp) {
        if (error) error.call(options.context, collection, resp, options);
        d.resolve(); // Also resolve on error to prevent unhandled exceptions on empty state
      };

      Backbone.Collection.prototype.fetch.apply(this, [options]);

      return d.promise;
    },

    getAvailableIcons: function() {
      return this.models;
    },

    getPromise: function() {
      return this.promise;
    }
  });

});