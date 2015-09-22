define(['backbone.marionette', 'config', 'underscore', 'jquery', 'materialize.dropdown', 'tpl!template/settings/legend-item.html'],
  function(Marionette, Config, _, $, Materialize, SettingsTemplate) {

    return Marionette.ItemView.extend({

      events: {
        // Prevent the dropdown from closing by stopping event propagation
        'click .dropdown-content': function(e) {
          e.stopPropagation();
        },
        'keyup input[type=text]': 'change',
        'change select': 'change',
        'keyup': 'closeOnEnter'
      },

      template: SettingsTemplate,

      initialize: function() {
        this.model.on( 'change:label', this.changeLabel, this );
        this.model.on( 'change:color', this.changeColor, this );
      },

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          availableColors: Config.availableColors,
          availableIcons: Config.makiCollection.getAvailableIcons(),
          cid: this.model.cid,
          isNew: this.model.get('new')
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

      closeOnEnter: function(e) {
        if (e.keyCode == 13) {
          $('.dropdown-button', this.$el).trigger('close');
        }
      },

      change: function(e) {
        var $input = $(e.currentTarget);

        this.model.set( { new: false }, { silent: true } );
        this.model.set( $input.data('property'), $input.val() );
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