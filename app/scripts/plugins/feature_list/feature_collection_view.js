define( ['backbone.marionette', 'fuse', 'jquery', 'communicator', 'leaflet', 'config', 'erfgeoviewer.common', 'materialize.modal',
    'tpl!./templates/list.html', 'tpl!./templates/list-item.html', 'tpl!./templates/confirm.html'],
  function( Marionette, Fuse, $, Communicator, L, Config, App, MaterializeModal,
            ListTemplate, ListItemTemplate, ConfirmTemplate ) {


    /**
     * Modal window to confirm the user wants to bulk delete.
     */
    var ConfirmDeleteView = Marionette.ItemView.extend( {

      template: ConfirmTemplate,

      events: {
        // The cancel button has a modal-close class, which will close with window without any action.
        // The delete button also has modal-close, but will also trigger deletion of the selected features.
        'click .delete': 'delete'
      },

      onShow: function() {
        $( '.modal', this.$el ).openModal( {
          complete: _.bind( function() {
            this.destroy();
          }, this )
        } );
      },

      delete: function() {
        $('input:checked').each(function() {
          Communicator.mediator.trigger( "marker:removeModelByCid", $(this).data('model-id'));
        });
      }

    } );


    /**
     * A single item in the list.
     */
    var ChildView = Marionette.ItemView.extend( {

      template: ListItemTemplate,

      tagName: 'li',

      events: {
        'click .edit': 'onClickEdit'
      },

      initialize: function() {
        this.model.on( "change:title", this.render );
      },

      onClickEdit: function( e ) {
        e.stopPropagation();
        e.preventDefault();

        Communicator.mediator.trigger( "marker:click", this.model );
      },

      onDestroy: function() {
        this.model.off( "change:title", this.render );
      },

      serializeModel: function( model ) {
        var plain = model.get( 'title' ).replace( /<(?:.|\n)*?>/gm, '' );
        model.set( 'title', plain );
        return _.extend( model.toJSON.apply( model, _.rest( arguments ) ), {
          mode: App.mode
        } );
      }

    } );

    /**
     * Composite view for list.
     */
    return Marionette.CompositeView.extend( {

      childView: ChildView,

      childViewContainer: "ul.features",

      className: 'feature-list-wrapper',

      // A copy of the feature collection, which will be mutated based upon keyword search and is
      // NOT tied to the collection used to show features on the map.
      collection: null,

      events: {
        "change input[type='checkbox']": 'updateSelectedCount',
        "click a.bulk-edit": function( e ) {
          e.preventDefault();
        },
        "click a.bulk-delete": function( e ) {
          e.preventDefault();
          App.layout.getRegion( 'modal' ).show(new ConfirmDeleteView());
        },
        "mouseover li": function( e ) {
          var cid = $( e.currentTarget ).find( 'input' ).data( 'model-id' );
          var model = _.clone( this.unfilteredCollection.findWhere( {cid: cid} ) );
          if ( model && this.map ) {
            var geojson = model.convertToGeoJSON();
            if ( !geojson ) return;
            geojson.properties['marker-color'] = Config.colors.secondary;
            var f = L.mapbox.featureLayer();
            f.setGeoJSON(geojson);
            this.featureGroup.addLayer( f );
          }
        },
        "mouseout li": function( e ) {
          this.featureGroup.clearLayers();
        }
      },

      map: null,
      featureGroup: null,
      searchableFields: ['title', 'description'],
      template: ListTemplate,

      // This is the collection used to render features on the map.
      unfilteredCollection: null,

      initialize: function( o ) {

        this.unfilteredCollection = o.collection;
        this.unfilteredCollection.on("remove add", function(e) {
          this.reset(o.collection);
          this.render();
        }, this);
        this.reset( o.collection );

      },

      /**
       * Creates a new Fuse index based upon a copy of the geofeature collection (unfiltered).
       * @param o
       */
      buildSearchIndex: function( o ) {
        o = (typeof options !== 'undefined') ? o : {};
        var fuseOptions = _.defaults( o, {
          keys: this.searchableFields,
          id: 'cid'
        } );
        this.fuse = new Fuse( _.pluck( this.unfilteredCollection.models, 'attributes' ), fuseOptions );
      },

      onRender: function() {
        this.$search = $( '#feature-filter', this.$el );
        this.$search.keyup( function( e ) {
          //if (e.keyCode == 13) {
          e.preventDefault();
          _.bind( function() {
            this.search( this.$search.val() );
          }, self )();
          //}
        } );
      },

      onShow: function() {

        var self = this;
        this.map = Communicator.reqres.request( "getMap" );
        this.featureGroup = L.featureGroup().addTo( this.map );

      },

      onDestroy: function() {
        if ( !this.map ) return;
        this.map.removeLayer( this.featureGroup );
      },

      reset: function( collection ) {

        // The collection is reflected in the display.
        // The unfilteredCollection is used as the source collection when searching.
        this.collection = collection.clone();
        this.model = new Backbone.Model( {
          'featureCount': this.collection.length
        } );
        this.buildSearchIndex();

      },

      search: function( query ) {

        var self = this;
        this.collection.reset( this.unfilteredCollection.models );

        // Provide a way to reset the filter.
        if ( query == '' || query == '*' ) {
          console.log( 'reset collection.' );
          return;
        }

        var matches = this.fuse.search( query );
        var deathrow = [];

        // Remove anything from the collection that doesn't have a match.
        this.collection.each( function( model ) {
          if ( !_.contains( matches, model.get( 'cid' ) ) ) {
            deathrow.push( model.get( 'cid' ) );
          }
        } );
        _.each( deathrow, function( cid ) {
          var model = self.collection.findWhere( {cid: cid} );
          self.collection.remove( model );
        } );

      },

      updateSelectedCount: function() {
        console.log('usc', this.$el);
        var selected = $( "input:checked", this.$el ).length;
        $( '.selected-counter', this.$el ).html( selected );
      }

    } );

  } );