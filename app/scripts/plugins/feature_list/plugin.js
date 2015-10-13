define(['plugin/abstract', 'erfgeoviewer.common', 'communicator',
    'models/state', './feature_collection_view'],
  function(Plugin, App, Communicator,
           State, FeatureCollectionView) {

  return Plugin.extend({

    features: null,
    listView: null,
    $menuitem: null,
    router: null,

    initialize: function() {
      Communicator.mediator.on("map:ready", this.initializeList, this);
      Communicator.mediator.on("header:shown", this.updateCounter, this);
    },

    initializeList: function() {

      this.router = App.router;
      this.router.route("features", "features");
      this.router.on('route:features', this.showList, this);

      this.features = State.getPlugin('geojson_features').collection;
      this.features.bind( "reset add remove", this.updateCounter, this);

    },

    showList: function() {

      if (this.listView) this.listView.destroy();

      this.listView = new FeatureCollectionView({
        collection: this.features.clone()
      });
      App.flyouts.getRegion( 'right' ).show( this.listView );

    },

    updateCounter: function() {
      if (!this.$menuitem) this.$menuitem = $('#primary-actions').find('.features');
      this.$menuitem.html(this.features.length);
    }

  });
});
