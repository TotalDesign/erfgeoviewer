define( ['backbone', 'backbone.marionette'], function(Backbone, Marionette) {
  return Marionette.ItemView.extend({
    template: _.template('<i class="wait icon-spin6 animate-spin"></i>')
  });
});