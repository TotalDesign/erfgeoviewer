define(["underscore", "backbone.marionette", "jquery", "jquery.hammer", "communicator",
    "erfgeoviewer.common", "models/state", "tpl!template/open.html",
    "materialize.modal", "materialize.toasts"],
  function(_, Marionette, $, jqueryHammer, Communicator, App,
           State, PublishTemplate, MaterializeModal, MaterializeToasts) {

    return Marionette.ItemView.extend({

      // Replacement model taken from JSON file
      newState: null,

      template: PublishTemplate,

      events: {
        "click .btn span": function() {
          $(this).find('input[type="file"]').click();
        },
        "click .open": function(e) {
          e.preventDefault();
          $('#modal-save').closeModal();
          var self = this;
          this.restoreFile();
          _.delay(function() {
            // Inspector gadget received his secret msg
            self.destroy();
          }, 100);
        }
      },

      initialize: function(o) {
        _.bindAll(this, 'restoreFile');
      },

      onShow: function() {
        var self = this;
        $('.modal', this.$el).openModal({
          complete: function() {
            App.router.navigate("");
          }
        });

        // File Input Path
        function readSingleFile(e) {
          var file = e.target.files[0];
          if (!file) {
            return;
          }
          var reader = new FileReader();
          reader.onload = function(e) {
            self.newState = JSON.parse(e.target.result);
          };
          reader.readAsText(file);
        }

        $('.file-field').each(function() {
          var path_input = $(this).find('input.file-path');
          var $fileField = $(this).find('input[type="file"]');

          $fileField.on('change', readSingleFile);

          $fileField.change(function () {
            path_input.val($(this)[0].files[0].name);
            path_input.trigger('change');
          });
        });
      },

      restoreFile: function() {
        if (!this.newState) {
          console.log('no map file uploaded, or it was invalid.');
          return;
        }

        State.set(State.parse(this.newState));
        State.save();
      }

    });

  }
);