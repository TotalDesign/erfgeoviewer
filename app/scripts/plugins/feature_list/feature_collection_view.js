define( ['backbone.marionette', 'fuse', 'jquery', 'communicator', 'leaflet', 'config', 'erfgeoviewer.common', 'materialize.modal', 'models/state',
    'tpl!./templates/list.html', 'tpl!./templates/list-item.html', 'tpl!./templates/confirm.html', 'tpl!./templates/edit.html'],
  function( Marionette, Fuse, $, Communicator, L, Config, App, MaterializeModal, State,
            ListTemplate, ListItemTemplate, ConfirmTemplate, EditTemplate ) {


    /**
     * Modal window to bulk edit.
     */
    var BulkEditView = Marionette.ItemView.extend( {

      parentView: null,
      template: EditTemplate,

      initialize: function(options) {
        this.parentView = options.parentView;
        this.model = new Backbone.Model({
          availableColors: _.extend({"-- Standaard --": null}, Config.availableColors),
          availableIcons: Config.makiCollection.getAvailableIcons(),
          icon: options.icon,
          userColor: options.userColor
        });
      },

      events: {
        'change #legend-setting-color-bulk': 'changeColor',
        'change #legend-setting-icon-bulk': 'changeIcon',
        'blur #legend-setting-color-bulk': 'changeColor',
        'blur #legend-setting-icon-bulk': 'changeIcon'
      },

      onShow: function() {
        $( '.modal', this.$el ).openModal( {
          complete: _.bind( function() {
            this.destroy();
          }, this )
        } );
      },

      changeColor: function(e) {
        var $input = $(e.currentTarget);
        this.parentView.setUserColorBulk($input.val());
      },

      changeIcon: function(e) {
        var $input = $(e.currentTarget);
        this.parentView.setIconBulk($input.val());
      }

    } );

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
        'click .edit': 'onClickEdit',
        'click .open-detail': 'onClickEdit',
        'click .zoomin': function(e) {
          e.preventDefault();
          var layer = Communicator.reqres.request("getMapLayerByCid", this.model.cid);
          Communicator.mediator.trigger('map:fitAll', layer.getBounds());
        }
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

          var checkedInputs = $( "input:checked", this.$el);
          if (checkedInputs.length > 0) {
            var firstColor;
            var firstIcon;
            var firstInput = checkedInputs.first();
            if (firstInput) {
              var cid = firstInput.data('model-id');
              var model = this.collection.findWhere( {cid: cid} );
              if (model) {
                firstColor = model.get("userColor");
                firstIcon = model.get("icon");
              }

              App.layout.getRegion( 'modal' ).show(new BulkEditView({
                parentView: this,
                userColor: firstColor,
                icon: firstIcon
              }));
            }
          }

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
            // https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
            geojson.properties['marker-color'] = State.getPlugin('map_settings').model.get('secondaryColor');
            geojson.properties['fill'] = State.getPlugin('map_settings').model.get('secondaryColor');
            geojson.properties['fill-opacity'] = 1;

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
        this.unfilteredCollection.on("remove add", this.refresh, this);
        this.reset( o.collection );

      },

      serializeModel: function( model ) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          mode: App.mode
        });
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
        var self = this;
        this.$search = $( '#feature-filter', this.$el );
        this.$search.keyup( function( e ) {
          //if (e.keyCode == 13) {
          e.preventDefault();
          _.bind( function() {
            self.search( self.$search.val() );
          }, self )();
          //}
        } );
      },

      onShow: function() {

        var self = this;
        this.map = Communicator.reqres.request( "getMap" );
        this.featureGroup = L.featureGroup().addTo( this.map );

        _.delay(function() {
          self.$search.focus();
        }, 100 );
      },

      onBeforeDestroy: function() {
        this.unfilteredCollection.off("remove add", this.refresh);
      },

      onDestroy: function() {
        if ( !this.map ) return;

        this.map.removeLayer( this.featureGroup );
      },

      refresh: function(e) {
        this.reset(this.unfilteredCollection);
        this.render();
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
      },

      setUserColorBulk: function(color) {
        var self = this;
        $( "input:checked", this.$el).each(function(index, element) {
          var cid = $(this).data('model-id');
          var model = self.collection.findWhere( {cid: cid} );
          model.set("userColor", color);
        });
      },

      setIconBulk: function(icon) {
        var self = this;
        $( "input:checked", this.$el).each(function(index, element) {
          var cid = $(this).data('model-id');
          var model = self.collection.findWhere( {cid: cid} );
          model.set("icon", icon);
        });
      }

    } );

  } );