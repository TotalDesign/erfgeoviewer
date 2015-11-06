define(['backbone.marionette', 'materialize.modal', 'tpl!template/layout/intro.html'],
  function(Marionette, MaterializeModal, Template) {

    var IntroLayout =  Marionette.LayoutView.extend({

      className: 'modal',

      template: Template,

      regions: {
        header: "#intro-header",
        content: "#intro-content",
        footer: "#intro-footer"
      },

      onShow: function() {
        this.$el.openModal();
      },

      closeModal: function() {
        this.$el.closeModal();
      }

    });

    return new IntroLayout();

  });