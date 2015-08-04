define(['backbone.marionette', 'views/layout/flyout.region'], function(Marionette, FlyoutRegion) {

  return Marionette.LayoutView.extend( {

    regionClass: FlyoutRegion,

    template: _.template(
      "<div id='flyout-left' class='z-depth-1'></div>" +
      "<div id='flyout-right' class='z-depth-1'></div>" +
      "<div id='flyout-detail' class='z-depth-2'></div>" +
      "<div id='flyout-bottom' class='z-depth-1'></div>"),
    regions: {
      left: "#flyout-left",
      right: "#flyout-right",
      detail: "#flyout-detail",
      bottom: "#flyout-bottom"
    }

  });

});