/**
 * Controller for Delving search module.
 */
define( ['backbone.marionette', 'communicator', 'modules/prototype',
    'tpl!modules/delving/templates/layout.html',
    'modules/delving/results-view', 'modules/delving/delving-model', 'modules/delving/delving-search-view'],
  function(Marionette, Communicator, ErfGeoviewerModule,
           LayoutTemplate,
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