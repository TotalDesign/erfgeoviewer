define(['backbone.marionette', 'erfgeoviewer.common', 'materialize.modal', 'tpl!template/layout/intro.html'],
  function(Marionette, App, MaterializeModal, Template) {

    var IntroLayout =  Marionette.LayoutView.extend({

      className: 'modal',

      template: Template,

      regions: {
        header: "#intro-header",
        content: "#intro-content",
        footer: "#intro-footer"
      },

      onShow: function() {
        this.$el.openModal({
          complete: function() {
            App.router.navigate("");
          }
        });
      },

      closeModal: function() {

        this.$el.closeModal();
      }

    });

    return IntroLayout;

  });