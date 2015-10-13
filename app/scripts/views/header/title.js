define( ['backbone', 'backbone.marionette', 'models/state'],
  function( Backbone, Marionette, State ) {

    return Marionette.ItemView.extend({

      template: _.template('<h1><%= title %></h1>'),

      initialize: function() {
        this.model = new Backbone.Model();
        this.model.set('title', State.getPlugin('map_settings').model.get('title'));
      }

    });

  });