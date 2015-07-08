/**
 * Controller for Delving module.
 */
define( ['backbone.marionette', 'communicator', 'modules/prototype',
    'tpl!modules/delving/templates/layout.html',
    'modules/delving/results-view', 'modules/delving/delving-model', 'modules/delving/delving-search-view'],
  function(Marionette, Communicator, ErfGeoviewerModule,
           LayoutTemplate,
           ResultsView, DelvingSearchModel, DelvingSearchView) {

    return ErfGeoviewerModule.extend({

      module: {
        'type': 'layer',
        'title': 'Zoek ONH'
      },

      layoutView: Marionette.LayoutView.extend({
        template: LayoutTemplate,
        regions: {
          search: "#search",
          facets: "#search-facets",
          pagination: "#search-pagination",
          results: "#search-results"
        }
      }),

      facets: null,
      items: null,
      pagination: null,
      query: null,

      initialize: function() {

        var self = this;

        this.facets = new Backbone.Collection();
        this.items = new Backbone.Collection();
        this.pagination = new Backbone.Model();

        this.model = new DelvingSearchModel({
          terms: this.query
        });

        this.model.on("change:terms", function() {
          // Update model with current map location before executing the search.
          var map = Communicator.reqres.request( 'getMap' );
          var center = map.getCenter();
          var bounds = map.getBounds();
          var distance = bounds.getSouthWest().distanceTo(bounds.getNorthEast()) / 1000 / 2;

          this.set( 'lat', center.lat );
          this.set( 'lng', center.lng );
          this.set( 'searchDistance', distance );

          this.fetch({
            success: function(model) {
              var r = model.get('result');
              model.set( 'breadcrumbs', r.query.breadCrumbs );
              model.set( 'numfound', r.query.numfound );
              self.facets.set( r.facets );
              self.items.set( r.items );
              self.pagination.set( r.pagination );
              self.layout.getRegion( 'results' ).show( new ResultsView({ collection: self.items } ));
            }
          });
        });

      },

      render: function() {
        this.layout.getRegion('search').show(new DelvingSearchView({
          model: search_model
        }) );
      }

    });

  }
);