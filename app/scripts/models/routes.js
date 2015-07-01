define(["backbone", "config"],
  function(Backbone, Config) {

    return Backbone.Model.extend({

      urlRoot: Config.routeyou_proxy.uri + '/routeyou/api',
      url: function() {
        return this.urlRoot + '/get_routes_by_owner/' + this.get('owner_id')
      },

      initialize: function() {
        this.set('owner_id', Config.routeyou_proxy.owner_id);
      }

    });

  });