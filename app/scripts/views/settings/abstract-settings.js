define(["backbone.marionette", "jquery"],
  function(Marionette, $) {

    return Marionette.ItemView.extend({

      events: {
        'change input': 'change',
        'change select': 'change'
      },

      state: null,

      initialize: function(o) {
        this.state = o.state;
      },

      change: function(e) {
        var mapSettings = this.state.get( 'mapSettings' ),
          $input = $(e.currentTarget),
          override = {};

        if ($input.is(':checkbox')) {
          override[$input.data('property')] = $input.is(":checked");
        }
        else {
          override[$input.data('property')] = $input.val();
        }

        mapSettings = _.extend( mapSettings, override );

        this.state.set( 'mapSettings', mapSettings );
        this.state.save();
      }

    });

  });