define(["backbone", "backbone.marionette", "communicator", "modules/module", 'views/results-view'],
  function(Backbone, Marionette, Communicator, ErfgeoModule, ResultsView) {

    return ErfgeoModule.extend({

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
          if ( !self.markers.findWhere({
              longitude: vars.longitude,
              latitude: vars.latitude,
              title: vars.title
            })) {
            self.markers.push( [vars] );
          } else {
            Communicator.mediator.trigger( "map:panTo", {
              longitude: vars.longitude[0],
              latitude: vars.latitude[0]
            } );
          }
        });

        this.listenTo(this.model, "change:terms", function() {
          // Update model with current map location before executing the search.
          var map = Communicator.reqres.request( 'getMap' );
          var center = map.getCenter();
          var bounds = map.getBounds();
          var distance = Math.round(bounds.getSouthWest().distanceTo(bounds.getNorthEast()) / 1000 / 4);

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

      }

  });

});