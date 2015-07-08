/**
 * Controller for Delving module.
 */
define( ['backbone.marionette', 'communicator',
    'tpl!modules/delving/templates/layout.html',
    'modules/delving/results-view', 'modules/delving/delving-model', 'modules/delving/delving-search-view'],
  function(Marionette, Communicator,
           LayoutTemplate,
           ResultsView, DelvingSearchModel, DelvingSearchView) {

    var LayoutView = Marionette.LayoutView.extend({
      template: LayoutTemplate,
      regions: {
        search: "#search",
        facets: "#search-facets",
        pagination: "#search-pagination",
        results: "#search-results"
      }
    });

    return Marionette.Object.extend({

      facets: null,
      items: null,
      pagination: null,
      query: null,

      // regions
      searchbarRegion: null,
      resultsRegion: null,

      initialize: function(o) {

        var self = this;

        this.container = o.region;

        var layout = new LayoutView();
        layout.render();
        this.container.show( layout );

        this.facets = new Backbone.Collection();
        this.items = new Backbone.Collection();
        this.pagination = new Backbone.Model();

        var search_model = new DelvingSearchModel({
          terms: this.query
        });

        search_model.on("change:terms", function() {
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
              search_model.set( 'breadcrumbs', r.query.breadCrumbs );
              search_model.set( 'numfound', r.query.numfound );
              self.facets.set( r.facets );
              self.items.set( r.items );
              self.pagination.set( r.pagination );
              layout.getRegion( 'results' ).show( new ResultsView({ collection: self.items } ));
            }
          });
        });

        layout.getRegion('search').show(new DelvingSearchView({
          model: search_model
        }) );

      }

    });

  }
);