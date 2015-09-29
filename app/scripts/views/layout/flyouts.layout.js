define(['backbone.marionette', 'views/layout/flyout.region', 'underscore', 'communicator'],
  function(Marionette, FlyoutRegion, _, Communicator) {

  return Marionette.LayoutView.extend( {

    regionClass: FlyoutRegion,

    template: _.template(
      "<div id='flyout-left' class='region z-depth-1'></div>" +
      "<div id='flyout-right' class='region z-depth-1'></div>" +
      "<div id='flyout-detail' class='region z-depth-2'></div>" +
      "<div id='flyout-bottom' class='region z-depth-1'></div>"),

    regions: {
      left: "#flyout-left",
      right: "#flyout-right",
      detail: "#flyout-detail",
      bottom: "#flyout-bottom"
    },

    initialize: function() {
      Communicator.mediator.on("flyouts:hideAll", this.hideAll, this);
      Communicator.mediator.on("flyouts:hideRegionById", this.hideRegionById, this);
    },

    hideAll: function() {
      _.each(this.regions, function(r) {
        this[r].hideFlyout();
      })
    },

    hideRegionById: function(id) {
      var selector = '#' + id;
      var region = _.findKey(this.regions, function(v) {
        return v === selector;
      });
      if (region) this[region].hideFlyout();

    }

  });

});