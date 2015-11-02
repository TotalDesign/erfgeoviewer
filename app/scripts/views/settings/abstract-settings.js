define(["backbone.marionette", "jquery", 'models/state'],
  function(Marionette, $, State) {

    return Marionette.ItemView.extend({

      events: {
        'keypress input[type=text]': 'keypress',
        'blur input[type=text]': 'change',
        'change input[type=checkbox]': 'change',
        'change select': 'change'
      },

      model: null,

//      state: null,
//
//      initialize: function(o) {
//        this.state = o.state;
//      },

//      change: function(e) {
//        var mapSettings = this.state.get( 'mapSettings' ),
//          $input = $(e.currentTarget),
//          override = {};
//
//        if ($input.is(':checkbox')) {
//          override[$input.data('property')] = $input.is(":checked");
//        }
//        else {
//          override[$input.data('property')] = $input.val();
//        }
//
//        mapSettings = _.extend( mapSettings, override );
//
//        this.state.set( 'mapSettings', mapSettings );
//        this.state.save();
//      }

      keypress: function(e) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
          this.change(e);
        }
      },

      change: function(e) {
        var $input = $(e.currentTarget),
          setting = {};

        if ($input.is(':checkbox')) {
          setting[$input.data('property')] = $input.is(":checked");
        }
        else {
          setting[$input.data('property')] = $input.val();
        }

        State.getPlugin('map_settings').model.set(setting);
      }

    });

  });