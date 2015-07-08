/**
 * CollectionView for displaying search results.
 */
define( ['backbone.marionette', "materialize.cards",
         "tpl!modules/delving/templates/results.html"],
  function(Marionette, Materialize,
           ResultItemTemplate) {

    var ResultItemView = Marionette.ItemView.extend({
      template: ResultItemTemplate
    });

    return Marionette.CollectionView.extend({

      childView: ResultItemView,
      initialize: function() {
        console.log('collection view initialized');
      }

    });

  }
);