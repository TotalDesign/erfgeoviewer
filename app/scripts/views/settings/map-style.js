define(["backbone.marionette", "communicator", "config", "tpl!template/settings/map-style.html"],
  function(Marionette, Communicator, Config, SettingsTemplate) {

    return Marionette.ItemView.extend({

      model: null,

      template: SettingsTemplate,

      events: {
        'click img': function(e) {
          Communicator.mediator.trigger('map:changeBase', $(e.target).data('id'));
        }
      },

      initialize: function(o) {
        this.model = new Backbone.Model();
        this.model.set('tiles', Config.tiles);
      }

    });

  });