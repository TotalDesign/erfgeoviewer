define(["backbone", "backbone.marionette", "communicator", 'models/state', "plugins/module",
    'views/results-view', "views/search/search-wait",
    'tpl!template/search/layout-search.html'],
  function(Backbone, Marionette, Communicator, State, ErfgeoModule,
           ResultsView, WaitView,
           LayoutTemplate) {

    return ErfgeoModule.extend({

      layoutView: Marionette.LayoutView.extend({
        template: LayoutTemplate,
        regions: {
          search: "#search-field",
          facets: "#search-facets",
          filters: "#search-filters",
          progress: "#search-progress",
          pagination: "#search-pagination",
          results: "#search-results",
          progress: "#search-progress"
        }
      }),

      getResults: function() {
        var self = this;

        this.layout.getRegion( 'progress' ).show( new WaitView() );
        if (this.resultsView) this.resultsView.destroy();
        if (this.paginationView) this.paginationView.remove();

        this.results.fetch({
          success: function(collection) {

            self.resultsView = new ResultsView( {collection: collection} );
            self.layout.getRegion( 'progress' ).reset();
            self.layout.getRegion( 'results' ).show( self.resultsView );
            self.layout.getRegion( 'pagination' ).show( new Backgrid.Extension.Paginator( {collection: collection} ) );

          }
        });
      }

    });

});