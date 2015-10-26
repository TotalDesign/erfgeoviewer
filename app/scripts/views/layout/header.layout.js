define(['backbone.marionette', 'tpl!template/layout/header.html',
  'views/header/title', 'views/header/sidenav', 'views/header/navbar'],
  function(Marionette, Template, TitleView, SideNavView, NavBarView) {

    return Marionette.LayoutView.extend({

      template: Template,

      regions: {
        title: "#header-title",
        sidenav: "#header-sidenav",
        navbar: "#header-navbar"
      },

      onShow: function() {
        this.title.show( new TitleView() );
        this.sidenav.show( new SideNavView() );
        this.navbar.show( new NavBarView() );
//        Communicator.mediator.trigger("header:shown");
      }

    });

  });