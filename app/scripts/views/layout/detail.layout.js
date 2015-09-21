define(['backbone.marionette', 'underscore'],
  function(Marionette, _) {

    return Marionette.LayoutView.extend( {

      template: _.template(
        "<div id='detail-container' class='region z-depth-1'></div>" +
        "<div id='detail-footer' class='region z-depth-1'></div>"),

      regions: {
        container: "#detail-container",
        footer: "#detail-footer"
      }

    });

  });