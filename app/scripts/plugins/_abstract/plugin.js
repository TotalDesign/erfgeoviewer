define(['backbone', 'underscore'], function(Backbone, _) {
  var Plugin = function(options) {
    options || (options = {});
    if (options.state) this.state = options.state;
    this.initialize.apply(this, arguments);
  };

  _.extend(Plugin.prototype, {
    initialize: function() {},

    save: function () {
      this.state.save();
    }
  });

  // Inherit extensibility from Backbone
  Plugin.extend = Backbone.View.extend;

  return Plugin;
});
