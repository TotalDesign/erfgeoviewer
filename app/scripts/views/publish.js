define(["backbone.marionette", "tpl!template/publish.html",
  "materialize.modal", "materialize.waves"],
  function(Marionette, PublishTemplate, MaterializeModal, MaterializeWaves) {

    return Marionette.ItemView.extend({
      template: PublishTemplate,

      event: {
        "click .download": function(e) {
          e.preventDefault();
          $('#modal-save').closeModal();
          var self = this;
          _.delay(function() {
            // Inspector gadget received his secret msg
            self.destroy();
          }, 100);
        }
      },

      initialize: function() {
        console.log('initailize materialize');
      },

      onShow: function() {
        $('.modal', this.$el).openModal();
      }
    });

  }
);