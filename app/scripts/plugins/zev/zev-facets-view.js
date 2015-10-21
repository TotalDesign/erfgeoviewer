/**
 * CollectionView for displaying search facets.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards", "jquery", "underscore", "URIjs/URI",
  "tpl!template/search/facet-box.html"],
  function(Backbone, Marionette, Communicator, Materialize, $, _, URI,
           FacetItemTemplate) {

    var searchModel;

    var FacetItemView = Marionette.ItemView.extend({

      template: FacetItemTemplate,

      events: {
        "click a.facet-link": function(e) {
          var href = $( e.target ).data( 'facet-href'),
            uri = new URI(href),
            dataMap = uri.search(true),
            facetString, facetArray;

          e.preventDefault();

          if (!_.isString(dataMap['query'])) {
            return;
          }

          facetString = dataMap['query'].split(/AND(.+)?/)[1].trim();

          facetArray = facetString.split(/ AND /);

          searchModel.set( 'facets', facetArray, { silent: true } );
          searchModel.trigger( 'change:facets' );
        }
      }
    });

    return Marionette.CollectionView.extend({

      childView: FacetItemView,

      initialize: function(o) {
        searchModel = o.searchModel;
      }

    });

  }
);