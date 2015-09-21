/**
 * Controller for Delving search module.
 */
define( ['backbone', 'backbone.marionette', 'communicator', 'plugins/module-search', 'backgrid', 'backgrid.paginator',
    'plugins/zev/zev-collection',
    'tpl!template/layout-search.html', 'views/results-view', 'views/search-view', 'views/zev-facets-view'],
  function(Backbone, Marionette, Communicator, SearchModule, Backgrid, PaginatorView,
           DelvingCollection,
           LayoutTemplate, ResultsView, DelvingSearchView, ZevFacetsView) {

    return SearchModule.extend({

      module: {
        'type': 'search',
        'title': 'Zoek ONH'
      },

      layoutView: Marionette.LayoutView.extend({
        initialize: function() {
          console.log('initializing zoek en vind layout view');
        },
        template: LayoutTemplate,
        regions: {
          search: "#search-field",
          facets: "#search-facets",
          pagination: "#search-pagination",
          results: "#search-results"
        }
      }),

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
            terms: '*',
            facets: [],
            viewportFilter: false,
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
          var attrs = ['title', 'image', 'description', 'youtube', 'externalUrl', 'spatial'];
          var vars = {};
          _.each(attrs, function(key) {
            vars[key] = result.get(key);
          });
          if ( !self.markers.findWhere({
              longitude: vars.longitude,
              latitude: vars.latitude,
              title: vars.title
            })) {
            self.markers.push( [vars] );
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

      getResults: function() {
        var self = this;

        self.results.fetch({
          success: function(collection) {
            self.layout.getRegion( 'facets' ).show( new ZevFacetsView({ collection: collection.getFacetConfig(), searchModel: self.model }) );
            self.layout.getRegion( 'results' ).show( new ResultsView( {collection: collection} ) );
            self.layout.getRegion( 'pagination' ).show( new Backgrid.Extension.Paginator( {collection: collection} ) );
          }
        });
      },

      render: function() {
        this.layout.getRegion('search').show(new DelvingSearchView({
          model: this.model
        }) );
      },

      onRender: function() {
        this.layout.render();
      }

    });

  }
);