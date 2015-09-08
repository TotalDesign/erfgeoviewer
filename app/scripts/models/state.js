define(["backbone", "models/markers", 'backbone.localstorage', 'communicator', 'underscore'],
  function(Backbone, MarkersCollection, LS, Communicator, _) {

  return Backbone.Model.extend({

    localStorage: new Backbone.LocalStorage("state"),

    // These aren't really plugins, but core components that operate the same way.
    // Additions will be added by actual plugins via registerPlugin(),
    plugins: ['mapSettings', 'markers', 'baseMap'],

    initialize: function() {
      this.set('markers', new MarkersCollection());
      _.bindAll(this, 'parse');
    },

    /**
     * Called when initializing data.
     */
    parse: function(response) {
      var data = {};

      if (!response) return;
      _.each(this.plugins, function(p) {
        data[p] = Communicator.reqres.request('restoring:' + p, response);
      });

      return data;
    },

    /**
     * Register a property that can persist beyond this session.
     * The implementing plugin can then provide functions to maintain state.
     * @param p
     */
    registerPlugin: function(p) {
      this.plugins.push(p);
    },

    /**
     * Override Backbone.Model.save().
     *
     */
    save: function() {
      var self = this;
      _.each(this.plugins, function(p) {
        var data = Communicator.reqres.request('saving:' + p);
        if (data) {
          //console.log('setting ' + p, data);
          self.set( p, _.extend( self.get( p ), data) );
        }
      });
      Backbone.Model.prototype.save.apply(this, arguments);
    }

  });

});