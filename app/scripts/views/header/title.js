define( ['backbone', 'backbone.marionette', 'models/state'],
  function( Backbone, Marionette, State ) {

    return Marionette.ItemView.extend({

      template: _.template('<h1><%= title %></h1>'),

      initialize: function() {
        this.model = new Backbone.Model();

        State.getPlugin('map_settings').model.on('change:showMapTitle change:title', this.render, this);
      },

      onBeforeRender: function() {
        var title = State.getPlugin('map_settings').model.get('showMapTitle') ? State.getPlugin('map_settings').model.get('title') : '';

        this.model.set('title', title);
      }

    });

  });