/**
 * Controller for Delving module.
 */
define( ['backbone.marionette',
    'tpl!modules/delving/templates/layout.html',
    'modules/delving/results-view', 'modules/delving/delving-model', 'modules/delving/delving-search-view'],
  function(Marionette,
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