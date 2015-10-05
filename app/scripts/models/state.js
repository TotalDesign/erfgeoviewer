define(["backbone", "models/markers", 'backbone.localstorage', 'communicator', 'underscore', 'q'],
  function(Backbone, MarkersCollection, LS, Communicator, _, Q) {

    var State = Backbone.Model.extend({

      localStorage: new Backbone.LocalStorage("state"),

      // These are core plugins
      // Additions will be added by actual plugins via registerPlugin(),
      plugins: ['geojson_features', 'map_settings'],

      pluginRegistry: {},

      pluginsInitialized: null,

      initialize: function() {
        var pluginInitializationPromises = [];

        this.pluginsInitialized = Q.defer();

        _.each(this.plugins, _.bind(function(pluginName) {
          pluginInitializationPromises.push(this.initializePlugin(pluginName));
        }, this));

        Q.all(pluginInitializationPromises)
          .done(_.bind(function() {
            this.pluginsInitialized.resolve();
          }, this));
      },

      initializePlugin: function(pluginName) {
        var deferredPluginLoader = Q.defer();

        require(['plugin/' + pluginName],
          _.bind(function(Plugin) {
            var plugin = new Plugin({ state: this });

            this.pluginRegistry[pluginName] = plugin;

            deferredPluginLoader.resolve();
          }, this));

        return deferredPluginLoader.promise;
      },

      parse: function(resp, options) {
        if (options.parse) {
          _.each(this.pluginRegistry, function(plugin, pluginName) {
            if (_.isFunction(plugin.readData)) {
              resp[pluginName] = plugin.readData(resp[pluginName]);
            }
          });
          return resp;
        }
      },

      /**
       * Register a property that can persist beyond this session.
       * The implementing plugin can then provide functions to maintain state.
       * @param p
       */
      registerPlugin: function(p) {
        this.pluginsInitialized.promise.then(_.bind(function() {
          this.plugins.push(p);
        }, this));
      },

      getPlugin: function(pluginName) {
        return this.pluginRegistry[pluginName];
      },

      /**
       * Override Backbone.Model.save().
       *
       */
      save: function() {
        var data = {};
        _.each(this.pluginRegistry, _.bind(function(plugin, pluginName) {
          if (_.isFunction(plugin.writeData)) {
            data[pluginName] = plugin.writeData();
          }
        }));
        Backbone.Model.prototype.save.apply(this, [data, { parse: false }]);
      }

    });

    return new State({ id: 1 });

  });