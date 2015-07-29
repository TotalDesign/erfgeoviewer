define(["backbone", "config"],
  function(Backbone, Config) {

    return Backbone.Collection.extend({

      comparator: function(item) {
        return item.get('name' ).nl;
      },
      urlRoot: Config.routeyou_proxy.uri + '/routeyou/api',
      url: function() {
        return this.urlRoot + '/get_routes_by_owner/' + Config.routeyou_proxy.owner_id
      }

    });

  });