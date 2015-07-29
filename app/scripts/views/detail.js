define( ["backbone", "backbone.marionette", "communicator", "medium.editor", "jquery",
    "tpl!template/detail.html"],
  function( Backbone, Marionette, Communicator, MediumEditor, $,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,
      dom: {},

      events: {
      },

      initialize: function( o ) {
        this.model = o.model;
      },

      onShow: function() {
        var editables = $(".editable", this.$el).get();
        var self = this;
        this.editor = new MediumEditor(editables, {
          buttons: ['bold', 'italic', 'underline'],
          disableReturn: true
        });
        this.editor.subscribe('editableInput', function (event, editable) {
          var field = $(editable).attr('id').substr(5);
          self.model.set(field, $(editable).html());
        });
      }

    } );

  } );