define(['backbone'], function(Backbone) {

  return Backbone.Model.extend({

    defaults: {
      'icon': null,
      'fragment': null,
      'label': null,
      'classes': null
    }

  });

});