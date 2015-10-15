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

      initialize: function(o) {

        var self = this;

        this.markers = o.markers_collection;
        var SearchModel = Backbone.Model.extend( {
          defaults: {
            terms: '*',
            numfound: 0
          }
        });
        this.model = new SearchModel();

        // Event triggered by "VOEG TOE" action on search result card.
        Communicator.mediator.on( "marker:addModelId", function(cid) {
          var result = self.results.findWhere( {cid: cid} );

          // The record model contains a lot of extract information that the marker doesn't need,
          // and the essential info (a unique ID) is not available. Here we extra the useful info
          // so the result model can be destroyed with pagination, etc.
          var attrs = ['title', 'image', 'description', 'youtube', 'externalUrl', 'longitude', 'latitude'];
          var vars = {};
          _.each(attrs, function(key) {
            vars[key] = result.get(key);
          });
          if ( !State.getPlugin('geojson_features').collection.findWhere({
              longitude: vars.longitude,
              latitude: vars.latitude,
              title: vars.title
            })) {
            State.getPlugin('geojson_features').collection.add( vars );
          }
        });

        this.listenTo(this.model, "change:terms", function() {
          self.results.state.terms = self.model.get('terms');
          self.getResults();
        });

        this.listenTo(this.model, "change:viewportFilter", function() {
          if (self.model.get('viewportFilter')) {
            // Update model with current map location before executing the search.
            var map = Communicator.reqres.request( 'getMap' );
            var center = map.getCenter();
            var bounds = map.getBounds();
            var distance = Math.round(bounds.getSouthWest().distanceTo(bounds.getNorthEast()) / 1000 / 4);

            self.results.state.lat = center.lat;
            self.results.state.lng = center.lng;
            self.results.state.searchDistance = distance;
          }
          else {
            self.results.state.lat = null;
            self.results.state.lng = null;
            self.results.state.searchDistance = null;
          }

          self.results.fetch({
            success: function(collection) {
              self.layout.getRegion( 'results' ).show( new ResultsView( {collection: collection} ) );
              self.layout.getRegion( 'pagination' ).show( new Backgrid.Extension.Paginator( {collection: collection} ) );
            }
          });
        });

      },

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