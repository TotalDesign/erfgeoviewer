/**
 * CollectionView for displaying search results.
 */
define( ['backbone.marionette', "communicator", "materialize.cards",
         "tpl!modules/delving/templates/results.html"],
  function(Marionette, Communicator, Materialize,
           ResultItemTemplate) {

    var ResultItemView = Marionette.ItemView.extend({
      template: ResultItemTemplate
    });

    return Marionette.CollectionView.extend({

      events: {
        "click .add-marker": function(e) {
          e.preventDefault();
          var modelId = $( e.target ).data( 'model-id' );
          Communicator.mediator.trigger( "marker:addModelId", modelId);
        }
      },

      childView: ResultItemView,
      initialize: function() {
      }

    });

  }
);