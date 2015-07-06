/**
 * CollectionView for displaying search results.
 */
define( ['backbone.marionette',
         "tpl!modules/delving/templates/results.html"],
  function(Marionette,
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