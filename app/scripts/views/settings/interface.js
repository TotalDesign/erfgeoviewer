define(["backbone.marionette", "tpl!template/settings/interface.html"],
  function(Marionette, SettingsTemplate) {

    return Marionette.ItemView.extend({

//      model: null,

      template: SettingsTemplate,

//      events: {},

      initialize: function(o) {
//        this.model = o.model;
      }

    });

  });