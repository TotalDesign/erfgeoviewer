define(["backbone", "backbone.marionette", "tpl!template/publish.html", "jquery", "materialize.modal"],
  function(Backbone, Marionette, PublishTemplate, $, MaterializeModal) {

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
        this.state = o.state;
      },

      onShow: function() {
        $('.modal', this.$el).openModal();
        this.state.save();
        $download = $('.download', this.$el);
        var serialized = JSON.stringify(this.state.toJSON());
        var link = "data:text/json;charset=utf-8," + encodeURIComponent(serialized);
        $download.prop('href', link);
        $download.prop('download', 'erfgeoviewer.json');
      }
    });

  }
);