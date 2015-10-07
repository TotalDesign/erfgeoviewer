define(['backbone.marionette', 'fuse', 'jquery',
    'tpl!./templates/list.html', 'tpl!./templates/list-item.html'],
  function(Marionette, Fuse, $,
           ListTemplate, ListItemTemplate) {

  var ChildView = Marionette.ItemView.extend({

    template: ListItemTemplate

  });

  return Marionette.CompositeView.extend({

    childView: ChildView,
    childViewContainer: "ul.features",
    events: {
    },
    searchableFields: ['title', 'description'],
    template: ListTemplate,

    initialize: function(o) {

      // The collection is reflected in the display.
      // The unfilteredCollection is used as the source collection when searching.
      this.unfilteredCollection = o.collection.clone();

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