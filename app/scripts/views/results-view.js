/**
 * CollectionView for displaying search results.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards", "jquery",
         "tpl!template/results.html"],
  function(Backbone, Marionette, Communicator, Materialize, $,
           ResultItemTemplate) {

    var ResultItemView = Marionette.ItemView.extend({

      template: ResultItemTemplate,

      events: {
        "click .add-marker": function(e) {
          e.preventDefault();

          Communicator.mediator.trigger( "marker:addModelId", this.model.cid );
        }
      }

    });

    return Marionette.CollectionView.extend({

      childView: ResultItemView

    });

  }
);