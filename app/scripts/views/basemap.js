define(['backbone', 'backbone.marionette', 'jquery', 'config', 'communicator',
    'models/state', 'tpl!template/base-map.html'],
function(Backbone, Marionette, $, Config, Communicator,
         State, BaseMapTemplate) {

  return Marionette.ItemView.extend({

    template: BaseMapTemplate,

    events: {
      'click img': function(e) {
        Communicator.mediator.trigger('map:changeBase', $(e.target).data('id'));
      }
    },

    initialize: function(o) {
      this.model = new Backbone.Model();
      this.model.set('tiles', Config.tiles);
    },

    changeBaseTo: function(id) {
      console.log(id);
    }

  });

});