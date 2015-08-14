define(["backbone", "models/markers", 'backbone.localstorage', 'communicator'],
  function(Backbone, MarkersCollection, LS, Communicator) {

  return Backbone.Model.extend({

    localStorage: new Backbone.LocalStorage("state"),
    plugins: ['markers', 'baseMap'],

    initialize: function() {
      this.set('markers', new MarkersCollection());
    },

    /**
     * Called when initializing data.
     */
    parse: function(response, options) {
      var self = this;
      _.each(this.plugins, function(p) {
        var parsed = Communicator.reqres.request('restoring:' + p, response);
        if (parsed)
          self.set(p, parsed );
      });
    },

    /**
     * Register a property that can persist beyond this session.
     * The implementing plugin can then provide functions to maintain state.
     * @param p
     */
    registerParser: function(p) {
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
          self.set( p, data );
        }
      });
      Backbone.Model.prototype.save.apply(this, arguments);
    }

  });

});