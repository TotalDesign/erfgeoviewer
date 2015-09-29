define(['backbone.marionette', 'tpl!template/legend-item.html'],
  function(Marionette, Template) {

    return Marionette.ItemView.extend({

      template: Template

    });

  });