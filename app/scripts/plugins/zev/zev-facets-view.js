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
        "click a.facet-reset-link": function(e) {
          var value = $( e.target ).data( 'facet-value' ),
            field = this.model.get( 'key' ),
            facets = searchModel.get( 'facets' ),
            facetToRemove = field + ' exact "' + value + '"';

          e.preventDefault();

          facets = _.reject(facets, function(facet) {
            return facet == facetToRemove;
          });

          searchModel.set( 'facets', facets, { silent: true } );
          searchModel.trigger( 'change:facets' );
        },
        "click a.facet-link": function(e) {
          var value = $( e.target ).data( 'facet-value' ),
            field = this.model.get( 'key' ),
            facets = searchModel.get( 'facets'),
            newFacet = field + ' exact "' + value + '"';

          e.preventDefault();

          // If facet has not been added to the list yet
          if (_.indexOf(facets, newFacet) == -1) {
            facets.push(newFacet);
          }

          searchModel.set( 'facets', facets, { silent: true } );
          searchModel.trigger( 'change:facets' );
        }
      },

      initialize: function() {
        var options = this.model.get( 'options' ),
          field = this.model.get( 'key' ),
          facets = searchModel.get( 'facets'),
          facet, regexp;

        if (this.model.get('name') == 'dc:date.year') {
          // This facet has a special display, and should not be rendered.
          this.model.set('preventRender', true);
        }

        for (var i = 0; i < facets.length; i++) {
          facet = facets[i];

          for (var j = 0; j < options.length; j++) {
            regexp = new RegExp('^' + field + '.*"' + options[j].value + '"$');

            if (facet.match(regexp)) {
              options[j].selected = true;
              break;
            }
          }
        }
      },

      render: function() {
        if (this.model.get('preventRender')) {
          // The view will not be rendered.
          return;
        }
        Marionette.ItemView.prototype.render.apply(this, arguments);
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