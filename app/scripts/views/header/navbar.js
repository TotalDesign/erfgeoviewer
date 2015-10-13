define( ['backbone', 'backbone.marionette', 'models/state', 'models/navbar',
  'views/header/nav-item', 'tpl!template/header/navbar.html'],
  function( Backbone, Marionette, State, NavBar, ItemView, Template ) {

    return Marionette.CompositeView.extend({

      childView: ItemView,

      childViewContainer: "#primary-actions",

      collection: NavBar,

      template: Template,

      initialize: function() {
        this.collection.on('change add remove', this.render, this);
      }

    });

  });