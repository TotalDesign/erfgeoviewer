/**
 * CollectionView for displaying search results.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards", "jquery",
         "tpl!template/results.html"],
  function(Backbone, Marionette, Communicator, Materialize, $,
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

      childView: ResultItemView

    });

  }
);