/**
 * Header view which is used in "reader" mode.
 */
define( ["backbone", "backbone.marionette", 'models/state'],
  function( Backbone, Marionette, State ) {

    return Marionette.ItemView.extend( {

      template: _.template('<h1><%= title %></h1>'),
      initialize: function(o) {
        this.model = new Backbone.Model();
        this.model.set('title', State.get('title'));
      }

    } );

  } );