define(["backbone"],
  function(Backbone) {

    return Backbone.Model.extend({

      urlRoot: 'http://onh-prod.delving.org/api/search',
      url: function() {
        return this.urlRoot + '?format=json&query=' + this.get('query')
      }

    });

  });