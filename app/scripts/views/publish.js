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
        var link = "data:application/octet-stream,field1%2Cfield2%0Afoo%2Cbar%0Agoo%2Cgai%0A";
        $download.prop('href', link);
        $download.prop('download', 'erfgeoviewer.json');
      }
    });

  }
);