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

      initialize: function(o) {
        this.model = o.state;
      },

      onShow: function() {
        $('.modal', this.$el).openModal();
        $download = $('.download', this.$el);
        var serialized = JSON.stringify(this.model.toJSON());
        var link = "data:text/json;charset=utf-8," + encodeURIComponent(serialized);
        $download.prop('href', link);
        $download.prop('download', 'erfgeoviewer.json');
      }
    });

  }
);