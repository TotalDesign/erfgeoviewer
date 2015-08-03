define(["underscore", "backbone.marionette", "jquery",
    "models/state", "tpl!template/open.html", "materialize.modal"],
  function(_, Marionette, $,
           StateModel, PublishTemplate, MaterializeModal) {

    return Marionette.ItemView.extend({

      // Model used to store map state in entire application
      state: null,

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
        this.state = o.state;
        _.bindAll(this, 'restoreFile');
      },

      onShow: function() {
        var self = this;
        $('.modal', this.$el).openModal();

        // File Input Path
        function readSingleFile(e) {
          var file = e.target.files[0];
          if (!file) {
            return;
          }
          var reader = new FileReader();
          reader.onload = function(e) {
            self.newState = JSON.parse(e.target.result)
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
        this.state.get('markers').reset();
        this.state.get('markers').add(this.newState.markers);
        this.state.set('baseMap', this.newState.baseMap);
      }

    });

  }
);