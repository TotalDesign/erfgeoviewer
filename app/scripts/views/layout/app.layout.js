define(['backbone.marionette'], function(Marionette) {

  return Marionette.LayoutView.extend( {

    template: _.template(
      '<div id="tooltip"></div>' +
      '<div id="flyout"></div>' +
      '<header id="header" class="color-primary"></header>' +
      '<div id="body">' +
      '  <aside id="routeyou"></aside>' +
      '  <article id="content"></article>' +
      '  <aside id="modal"></aside>' +
      '  <div id="map"></div>' +
      '</div>'
    ),

    regions: {
      header: "#header",
      content: "#content",
      modal: "#modal",
      flyout: "#flyout"
    }

  } );

});