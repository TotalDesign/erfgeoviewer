define(['backbone', 'backbone.marionette', 'jquery', 'config', 'communicator',
    'tpl!template/base-map.html'],
function(Backbone, Marionette, $, Config, Communicator,
         BaseMapTemplate) {

  return Marionette.ItemView.extend({

    state: null,

    template: BaseMapTemplate,

    events: {
      'click img': function(e) {
        Communicator.mediator.trigger('map:changeBase', $(e.target).data('id'));
      }
    },

    initialize: function(o) {
      this.state = o.state;
      this.model = new Backbone.Model();
      this.model.set('tiles', Config.tiles);
    },

    changeBaseTo: function(id) {
      console.log(id);
    }

  });

});