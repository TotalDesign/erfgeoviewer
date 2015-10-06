/**
 * Controller for Delving search module.
 */
define( ['backbone.marionette', 'communicator', 'plugins/module-search', 'backgrid', 'backgrid.paginator',
    'plugins/delving/delving-collection',
    'views/search/search-field'],
  function(Marionette, Communicator, ErfGeoSearchModule, Backgrid, PaginatorView,
           DelvingCollection,
           DelvingSearchView) {

    return ErfGeoSearchModule.extend({

      module: {
        'type': 'search',
        'title': 'Zoek ONH'
      },

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