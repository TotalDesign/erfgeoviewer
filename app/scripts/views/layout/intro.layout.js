define(['backbone.marionette', 'erfgeoviewer.common', 'communicator',
  'materialize.modal', 'tpl!template/layout/intro.html'],
  function(Marionette, App, Communicator,
           MaterializeModal, Template) {

    var IntroLayout =  Marionette.LayoutView.extend({

      className: 'modal',

      template: Template,

      regions: {
        header: "#intro-header",
        content: "#intro-content",
        footer: "#intro-footer"
      },

      initialize: function() {
        Communicator.mediator.on("introduction:close", this.closeModal, this);
      },

      onShow: function() {
        this.$el.openModal({
          complete: function() {
            App.router.navigate("");
          }
        });
      },

      onClose: function() {
        Communicator.mediator.off("introduction:close", this.closeModal)
      },

      closeModal: function() {
        this.$el.closeModal();
      }

    });

    return IntroLayout;

  });