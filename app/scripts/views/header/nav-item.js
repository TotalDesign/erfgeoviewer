define( ['backbone.marionette', 'tpl!template/header/nav-item.html'],
  function( Marionette, Template ) {

    return Marionette.ItemView.extend({

      tagName: "li",

      template: Template,

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          icon: model.get('icon') ? 'icon-' + model.get('icon') : null
        });
      }

    });

  });