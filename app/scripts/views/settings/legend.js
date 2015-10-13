define(['backbone', 'backbone.marionette', 'models/state', 'views/settings/legend-item', 'config', 'tpl!template/settings/legend.html'],
  function(Backbone, Marionette, State, LegendItemView, Config, SettingsTemplate) {

    return Marionette.CompositeView.extend({

      childView: LegendItemView,

      childViewContainer: "#legend-container",

      events: {
        'click .add': 'addItem'
      },

      template: SettingsTemplate,

      initialize: function(o) {
        this.collection = new Backbone.Collection( State.getPlugin('map_settings').model.get('legend') );

        this.addItem();

        this.collection.on( 'change remove', this.save, this );
      },

      addItem: function() {
        this.collection.add({
          new: true,
          color: Config.colors.primary,
          icon: '',
          label: 'Label'
        });
      },

      save: function() {
        var setting = {
          legend: (new Backbone.Collection( this.collection.where({ new: false }) )).toJSON()
        };

        State.getPlugin('map_settings').model.set(setting);
      }

    });

  });