define(["underscore", "backbone.marionette", "jquery", "jquery.hammer", "communicator",
    "erfgeoviewer.common", "models/state", "tpl!template/new.html",
    "materialize.modal", "materialize.toasts"],
  function(_, Marionette, $, jqueryHammer, Communicator, App,
           State, NewTemplate, MaterializeModal, MaterializeToasts) {

    return Marionette.ItemView.extend({

      template: NewTemplate,

      events: {
        'click .new': 'resetMap'
      },

      onShow: function() {
        $('.modal', this.$el).openModal({
          complete: _.bind(function() {
            App.router.navigate("");
            this.destroy();
          }, this)
        });
      },

      resetMap: function() {
        State.clear();
      }

    });

  }
);