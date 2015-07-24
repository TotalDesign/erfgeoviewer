/**
 * Controller for Delving search module.
 */
define( ['backbone.marionette', 'communicator', 'modules/prototype', 'backgrid', 'backgrid.paginator',
    'modules/delving/delving-collection',
    'tpl!template/layout-search.html', 'views/results-view', 'views/search-view'],
  function(Marionette, Communicator, ErfGeoviewerModule, Backgrid, PaginatorView,
           DelvingCollection,
           LayoutTemplate, ResultsView, DelvingSearchView) {

    return ErfGeoviewerModule.extend({

      module: {
        'type': 'search',
        'title': 'Zoek ONH'
      },

      layoutView: Marionette.LayoutView.extend({
        initialize: function() {
          console.log('initializing delving layout view');
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
          if ( !self.markers.findWhere({
              longitude: vars.longitude,
              latitude: vars.latitude,
              title: vars.title
            })) {
            self.markers.push( [vars] );
          }
        });

        this.listenTo(this.model, "change:terms", function() {
          // Update model with current map location before executing the search.
          var map = Communicator.reqres.request( 'getMap' );
          var center = map.getCenter();
          var bounds = map.getBounds();
          var distance = bounds.getSouthWest().distanceTo(bounds.getNorthEast()) / 1000 / 2;

          self.results.state.terms = self.model.get('terms');
          self.results.state.lat = center.lat;
          self.results.state.lng = center.lng;
          self.results.state.searchDistance = distance;

          self.results.fetch({
            success: function(collection) {
              self.layout.getRegion( 'results' ).show( new ResultsView( {collection: collection} ) );
              self.layout.getRegion( 'pagination' ).show( new Backgrid.Extension.Paginator( {collection: collection} ) );
            }
          });
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