define(['plugin/abstract', 'communicator', 'models/state'],
  function(Plugin, Communicator, State) {

  return Plugin.extend({

    features: null,
    $menuitem: null,

    initialize: function() {
      Communicator.mediator.on("map:ready", this.initializeList, this);
      Communicator.mediator.on("header:shown", this.updateCounter, this);
    },

    initializeList: function() {

      var self = this;
      this.features = State.getPlugin('geojson_features').collection;

      this.features.bind( "reset add remove", this.updateCounter, this);
    },

    updateCounter: function() {
      if (!this.$menuitem) this.$menuitem = $('#primary-actions').find('.features');
      this.$menuitem.html(this.features.length);
    }

  });
});
