define(['backbone', 'underscore', 'models/nav-item'], function(Backbone, _, NavItem) {

  return  Backbone.Collection.extend({

    model: NavItem,

    addItem: function(key, properties) {
      if (this.findWhere({ _key: key })) {
        throw new Error('Item with key "' + key + '" already exists.');
      }

      properties = _.extend(properties, { _key: key });
      this.add(properties);
    },

    removeItem: function(key) {
      this.remove( this.findWhere({ _key: key }) );
    }

  });

});