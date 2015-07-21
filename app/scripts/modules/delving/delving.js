/**
 * Controller for Delving search module.
 */
define( ['backbone.marionette', 'communicator', 'modules/prototype',
    'tpl!modules/delving/templates/layout.html', 'modules/delving/delving-result-model',
    'views/results-view', 'modules/delving/delving-model', 'views/search-view'],
  function(Marionette, Communicator, ErfGeoviewerModule,
           LayoutTemplate, ResultModel,
           ResultsView, DelvingSearchModel, DelvingSearchView) {

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
      pagination: null,
      query: null,

      initialize: function(o) {

        var self = this;

        this.markers = o.markers_collection;
        this.facets = new Backbone.Collection();
        var ResultCollection = Backbone.Collection.extend({
          model: ResultModel
        });
        this.items = new ResultCollection();
        this.pagination = new Backbone.Model();

        this.model = new DelvingSearchModel({
          terms: this.query
        });

        // Event triggered by "VOEG TOE" action on search result card.
        Communicator.mediator.on( "marker:addModelId", function(cid) {
          var result = self.items.find( {cid: cid} );

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

          self.model.set( 'lat', center.lat );
          self.model.set( 'lng', center.lng );
          self.model.set( 'searchDistance', distance );

          self.model.fetch({
            success: function(model) {
              var r = model.get('result');
              model.set( 'breadcrumbs', r.query.breadCrumbs );
              model.set( 'numfound', r.query.numfound );
              self.facets.set( r.facets );
              self.items.set( r.items );
              self.pagination.set( r.pagination );
              self.layout.getRegion( 'results' ).show( new ResultsView({ collection: self.items } ));
              if ( r.query.numfound > self.items.length ) {
                //self.layout.getRegion( 'pagination' ).show( new PaginatorView( { model: self.pagination }) );
              } else {
                console.log('no paginator required');
              }
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