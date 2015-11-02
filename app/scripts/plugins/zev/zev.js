/**
 * Controller for Delving search module.
 */
define( ['backbone', 'backbone.marionette', 'communicator', 'plugins/module-search', 'backgrid', 'backgrid.paginator',
    'plugins/zev/zev-collection', 'models/state',
    'views/search/search-wait', 'views/results-view', 'views/search/search-field', 'plugins/zev/zev-facets-view', 'plugins/zev/zev-date-filter-view'],
  function(Backbone, Marionette, Communicator, SearchModule, Backgrid, PaginatorView,
           DelvingCollection, State,
           WaitView, ResultsView, DelvingSearchView, ZevFacetsView, ZevDateFilterView) {

    return SearchModule.extend({

      module: {
        'type': 'search',
        'title': 'Zoek ONH'
      },

      markers: null,
      facets: null,
      items: null,
      query: null,

      initialize: function(o) {

        var self = this;

        this.markers = o.markers_collection;
        this.facets = new Backbone.Collection();
        this.results = new DelvingCollection();
        var SearchModel = Backbone.Model.extend( {
          defaults: {
            terms: '',
            date: {
              from: '',
              to: ''
            },
            facets: [],
            viewportFilter: false,
            numfound: 0
          }
        });
        this.model = new SearchModel();

        // Event triggered by "VOEG TOE" action on search result card.
        Communicator.mediator.on( "marker:addModelId", function(cid) {
          var result = self.results.findWhere( {cid: cid} );
          if (!result) return;

          // The record model contains a lot of extract information that the marker doesn't need,
          // and the essential info (a unique ID) is not available. Here we extra the useful info
          // so the result model can be destroyed with pagination, etc.
          var attrs = ['title', 'image', 'description', 'youtube', 'externalUrl', 'spatial'];
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

        this.listenTo(this.model, "change:facets", function() {
          self.results.state.facets = self.model.get('facets');
          self.getResults();
        });

        this.listenTo(this.model, "change:date", function() {
          self.results.state.date = self.model.get('date');
          self.getResults();
        });

        this.listenTo(this.model, "change:viewportFilter", function() {
          if (self.model.get('viewportFilter')) {
            // Update model with current map location before executing the search.
            var map = Communicator.reqres.request( 'getMap'),
              bounds = map.getBounds(),
              sw = bounds.getSouthWest(),
              ne = bounds.getNorthEast();

            self.results.state.geoFence = {
              type: 'AND',
              values: [
                'minGeoLat=' + sw.lat,
                'minGeoLong=' + sw.lng,
                'maxGeoLat=' + ne.lat,
                'maxGeoLong=' + ne.lng
              ]
            };
          }
          else {
            self.results.state.geoFence = null;
          }

          self.getResults();
        });
      },

      // Overrides parent to implement facets (a bit overkill)
      getResults: function() {

        var self = this;
        if (this.resultsView) this.resultsView.destroy();
        if (this.facetsView) this.facetsView.remove();
        if (this.paginationView) this.paginationView.remove();
        this.layout.getRegion( 'progress' ).show( new WaitView() );

        self.results.fetch({
          success: function(collection) {

            self.facetsView = new ZevFacetsView({ collection: collection.getFacetConfig(), searchModel: self.model });
            self.resultsView = new ResultsView( {collection: collection} );
            self.paginationView = new Backgrid.Extension.Paginator( {
              collection: collection,
              windowSize: 5
            } );

            self.layout.getRegion( 'facets' ).show( self.facetsView );
            self.layout.getRegion( 'results' ).show( self.resultsView );
            self.layout.getRegion( 'pagination' ).show( self.paginationView );
            self.layout.getRegion( 'progress' ).reset();
          }
        });

      },

      render: function() {
        this.layout.getRegion('search').show(new DelvingSearchView({
          model: this.model
        }) );

        this.layout.getRegion( 'filters' ).show( new ZevDateFilterView({ model: this.model }) );
      },

      onRender: function() {
        this.layout.render();
      }

    });

  }
);