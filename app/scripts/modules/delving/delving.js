/**
 * Controller for Delving search module.
 */
define( ['backbone.marionette', 'communicator', 'modules/prototype', 'config', //'backgrid', 'backgrid.paginator',
    'backbone.pageable.collection',
    'tpl!modules/delving/templates/layout.html', 'views/results-view', 'views/search-view',
    'modules/delving/delving-result-model'],
  function(Marionette, Communicator, ErfGeoviewerModule, Config, //Backgrid, PaginatorView,
           BackbonePageableCollection,
           LayoutTemplate, ResultsView, DelvingSearchView,
           ResultModel) {

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
          search: "#delving-search",
          facets: "#delving-facets",
          pagination: "#delving-pagination",
          results: "#delving-results"
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
        var PageableCollection = BackbonePageableCollection.extend({
          model: ResultModel,
          state: {
            d: 100,
            firstPage: 1,
            terms: "*"
          },
          url: Config.delving.uri + '/search',
          queryParams: {
            currentPage: null,
            pageSize: null,
            format: 'json',
            pt: function() {
              return this.state.lat + ',' + this.state.lng;
            },
            d: function() {
              return Math.round(this.state.searchDistance);
            },
            sfield: "delving_locationLatLong_location",
            query: function() {
              return this.state.terms;
            },
            start: function() {
              return (this.state.currentPage - this.state.firstPage) * this.state.pageSize;
            }
          },
          parseRecords: function(resp) {
            this.state.facets = resp.result.facets;
            this.state.pagination = resp.result.pagination;
            return resp.result.items;
          }
        });

        this.results = new PageableCollection();
        var SearchModel = Backbone.Model.extend( {
          defaults: {
            terms: '*',
            numfound: 0
          }
        });
        this.model = new SearchModel();

        // Event triggered by "VOEG TOE" action on search result card.
        Communicator.mediator.on( "marker:addModelId", function(cid) {
          var result = self.results.find( {cid: cid} );

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
              //self.layout.getRegion( 'pagination' ).show( new PaginatorView( {collection: collection} ) );
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