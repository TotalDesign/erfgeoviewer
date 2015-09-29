define(['backbone.marionette', 'underscore'],
  function(Marionette, _) {

    return Marionette.LayoutView.extend( {

      template: _.template(
        "<div id='detail-container' class='region'></div>" +
        "<div id='detail-footer' class='region'></div>"),

      regions: {
        container: "#detail-container",
        footer: "#detail-footer"
      }

    });

  });