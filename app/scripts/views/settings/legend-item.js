define(['backbone.marionette', 'config', 'underscore', 'jquery', 'materialize.dropdown', 'tpl!template/settings/legend-item.html'],
  function(Marionette, Config, _, $, Materialize, SettingsTemplate) {

    return Marionette.ItemView.extend({

      events: {
        // Prevent the dropdown from closing by stopping event propagation
        'click .dropdown-content': function(e) {
          e.stopPropagation();
        },
        'keyup input[type=text]': 'change',
        'change select': 'change'
      },

      template: SettingsTemplate,

      initialize: function() {
        this.model.on( 'change:label', this.changeLabel, this );
        this.model.on( 'change:color', this.changeColor, this );
      },

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          availableColors: Config.availableColors,
          cid: this.model.cid
        });
      },

      onShow: function() {
        $('.dropdown-button', this.$el).dropdown({
            inDuration: 200,
            outDuration: 200,
            constrain_width: false,
            hover: false,
            belowOrigin: true,
            alignment: 'left'
          }
        );
      },

      change: function(e) {
        var $input = $(e.currentTarget);

        this.model.set($input.data('property'), $input.val());
      },

      changeLabel: function() {
        $('.label', this.$el).text(this.model.get('label'));
      },

      changeColor: function() {
        $('.color-box', this.$el).css({
          backgroundColor: this.model.get('color')
        });
      }

    });

  });