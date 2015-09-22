define(['backbone.marionette', 'views/settings/legend-item', 'config', 'tpl!template/settings/legend.html'],
  function(Marionette, LegendItemView, Config, SettingsTemplate) {

    return Marionette.CompositeView.extend({

      childView: LegendItemView,

      childViewContainer: "#legend-container",

      events: {
        'click .add': 'addItem'
      },

      state: null,

      template: SettingsTemplate,

      initialize: function(o) {
        this.state = o.state;

        this.collection = new Backbone.Collection( o.state.get( 'mapSettings' ).legend );

        this.addItem();

        this.collection.on( 'change', this.save, this );
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
        var mapSettings = this.state.get( 'mapSettings' ),
          override = {
            legend: (new Backbone.Collection( this.collection.where({ new: false }) )).toJSON()
          };

        mapSettings = _.extend( mapSettings, override );

        this.state.set( 'mapSettings', mapSettings );
        this.state.save();
      }

    });

  });