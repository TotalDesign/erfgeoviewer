define(["backbone.marionette", "tpl!template/settings/color.html"],
  function(Marionette, SettingsTemplate) {

    return Marionette.ItemView.extend({

//      model: null,

      template: SettingsTemplate,

//      events: {},

      initialize: function(o) {
//        this.model = o.model;
      },

      onShow: function() {

      }

    });

  });