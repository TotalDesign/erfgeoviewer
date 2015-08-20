define(["backbone.marionette", "underscore"], function(Marionette, _) {

  // Gets the value at any depth in a nested object based on the
  // path described by the keys given. Keys may be given as an array
  // or as a dot-separated string.
  // Credit: lodash contrib:
  // https://github.com/TheNodeILs/lodash-contrib/blob/master/common-js/_.object.selectors.js
  _.getPath = function getPath(obj, ks) {
    if (typeof ks == "string") ks = ks.split(".");

    // If we have reached an undefined property
    // then stop executing and return undefined
    if (obj === undefined) return void 0;

    // If the path array has no more elements, we've reached
    // the intended property and return its value
    if (ks.length === 0) return obj;

    // If we still have elements in the path array and the current
    // value is null, stop executing and return undefined
    if (obj === null) return void 0;

    return getPath(obj[_.first(ks)], _.rest(ks));
  };

  return Marionette.Object.extend({

    // Module must override this with a LayoutView
    layoutView: Marionette.LayoutView,

    // Defines module
    module: {
      'type': ''
    },

    // Instantiated layout view
    layout: null,

    render: function() {
      console.log('Your module should override this.')
    },

    /**
     * Creates layout, renders module.
     */
    showModule: function(region) {

      this.container = region;
      this.layout = new this.layoutView();
      this.container.show( this.layout );
      this.render();

    }

  });

});