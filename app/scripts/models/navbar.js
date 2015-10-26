define(['underscore', 'models/abstract-nav'], function(_, NavBase) {

  var navBarCollection = NavBase.extend({

    addItem: function(key, properties) {
      properties = _.extend({
        classes: ''
      }, properties);

      properties.classes +=  ' ' + key + ' waves-effect waves-light btn-flat';

      NavBase.prototype.addItem.apply(this, [key, properties]);
    }

  });

  return new navBarCollection();

});