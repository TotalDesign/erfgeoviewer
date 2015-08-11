/**
 * Controller for Delving search module.
 */
define( ['backbone.marionette', 'communicator', 'plugins/module-search', 'backgrid', 'backgrid.paginator',
    'plugins/delving/delving-collection',
    'tpl!template/layout-search.html', 'views/search-view'],
  function(Marionette, Communicator, ErfGeoSearchModule, Backgrid, PaginatorView,
           DelvingCollection,
           LayoutTemplate, DelvingSearchView) {

    return ErfGeoSearchModule.extend({

      module: {
        'type': 'search',
        'title': 'Zoek ONH'
      },

      layoutView: Marionette.LayoutView.extend({
        template: LayoutTemplate,
        regions: {
          search: "#search-field",
          facets: "#search-facets",
          pagination: "#search-pagination",
          results: "#search-results"
        }
      }),

      initialize: function() {
        this.results = new DelvingCollection();
        ErfGeoSearchModule.prototype.initialize.apply(this, arguments);
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