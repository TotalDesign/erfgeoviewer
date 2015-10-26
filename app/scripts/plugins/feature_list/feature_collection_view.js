define(['backbone.marionette', 'fuse', 'jquery', 'communicator', 'leaflet', 'config',
    'erfgeoviewer.common', 'tpl!./templates/list.html', 'tpl!./templates/list-item.html'],
  function(Marionette, Fuse, $, Communicator, L, Config, App,
           ListTemplate, ListItemTemplate) {

  var ChildView = Marionette.ItemView.extend({

    template: ListItemTemplate,

    tagName: 'li',

    events: {
      'click .edit': 'onClickEdit'
    },

    initialize: function() {
      this.model.on( "change:title", this.render );
    },

    onClickEdit: function(e) {
      e.stopPropagation();
      e.preventDefault();

      Communicator.mediator.trigger( "marker:click", this.model);
    },

    onDestroy: function() {
      this.model.off( "change:title", this.render );
    },

    serializeModel: function(model) {
      var plain = model.get('title').replace(/<(?:.|\n)*?>/gm, '');
      model.set('title', plain);
      return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
        mode: App.mode
      });
    }

  });

  return Marionette.CompositeView.extend({

    childView: ChildView,

    childViewContainer: "ul.features",

    className: 'feature-list-wrapper',

    events: {
      "mouseover li": function(e) {
        var cid = $(e.currentTarget).find('input').data('model-id');
        var model = _.clone(this.unfilteredCollection.findWhere({ cid: cid }));
        if (model && this.map) {
          var geojson = model.convertToGeoJSON();
          if (!geojson) return;
          var feature = L.geoJson(geojson, {
            style: Config.colors.secondary
          });
          this.featureGroup.addLayer(feature);
        }
      },
      "mouseout li": function(e) {
        this.featureGroup.clearLayers();
      }
    },
    map: null,
    featureGroup: null,
    searchableFields: ['title', 'description'],
    template: ListTemplate,

    initialize: function(o) {

      var self = this;
      // The collection is reflected in the display.
      // The unfilteredCollection is used as the source collection when searching.
      this.unfilteredCollection = o.collection.clone();
      this.model = new Backbone.Model({
        'featureCount': this.unfilteredCollection.length
      });
    },

    /**
     * Creates a new Fuse index based upon a copy of the geofeature collection (unfiltered).
     * @param o
     */
    buildSearchIndex: function(o) {
      o = (typeof options !== 'undefined') ? o : {};
      var fuseOptions = _.defaults(o, {
        keys: this.searchableFields,
        id: 'cid'
      });
      this.fuse = new Fuse(_.pluck(this.unfilteredCollection.models, 'attributes'), fuseOptions);
    },

    onShow: function() {

      var self = this;
      this.map = Communicator.reqres.request( "getMap" );
      this.featureGroup = L.featureGroup().addTo(this.map);
      this.buildSearchIndex();
      this.$search = $('#feature-filter', this.$el);
      this.$search.keyup( function( e ) {
        //if (e.keyCode == 13) {
          e.preventDefault();
          _.bind( function() {
            this.search( this.$search.val() );
          }, self )();
        //}
      });

    },

    onDestroy: function() {
      if (!this.map) return;
      this.map.removeLayer(this.featureGroup);
    },

    search: function(query) {

      var self = this;
      this.collection.reset(this.unfilteredCollection.models);

      // Provide a way to reset the filter.
      if (query == '' || query == '*') {
        console.log('reset collection.');
        return;
      }

      var matches = this.fuse.search(query);
      var deathrow = [];

      // Remove anything from the collection that doesn't have a match.
      this.collection.each(function(model) {
        if (!_.contains(matches, model.get('cid'))) {
          deathrow.push(model.get('cid'));
        }
      });
      _.each(deathrow, function(cid) {
        var model = self.collection.findWhere({ cid: cid });
        self.collection.remove(model);
      });

    }

  });

});