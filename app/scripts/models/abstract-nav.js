define(['backbone', 'underscore', 'models/nav-item'], function(Backbone, _, NavItem) {

  return  Backbone.Collection.extend({

    model: NavItem,

    comparator: 'weight',

    addItem: function(key, properties) {
      var last = this.last();

      var defaults = {
        weight: last ? last.get('weight') + 10 : 0
      };

      if (this.findWhere({ _key: key })) {
        throw new Error('Item with key "' + key + '" already exists.');
      }

      // Set defaults
      properties = _.extend(defaults, properties);

      // Set _key separately, because _key cannot be set by user directly
      properties = _.extend(properties, { _key: key });

      this.add(properties);
    },

    removeItem: function(key) {
      this.remove( this.findWhere({ _key: key }) );
    }

  });

});