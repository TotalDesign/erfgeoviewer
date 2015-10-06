define(['backbone.marionette'], function(Marionette) {

  var ChildView = Marionette.ItemView.extend({

    template: _.template('<li><%= title %></li>')

  });

  return Marionette.CompositeView.extend({

    childView: ChildView,
    childViewContainer: "ul.features",
    template: _.template('<h3>markers</h3><ul class="features"></ul>')

  });

});