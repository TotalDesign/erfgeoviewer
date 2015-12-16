define(['backbone', 'backbone.marionette', 'jquery', 'models/state', 'communicator',
  'tpl!template/intro/list.html', 'tpl!template/intro/list-item.html'],
  function( Backbone, Marionette, $, State, Communicator,
            ListTemplate, ListItemTemplate ) {

    var ItemView = Marionette.ItemView.extend({

      className: "col s8",

      template: ListItemTemplate,

      events: {
        'click': 'loadPreset'
      },

      loadPreset: function() {
        $.getJSON( this.model.get( 'dataSrc' ) )
          .done(function(data) {
            State.set(State.parse(data));
            State.save();
            Communicator.mediator.trigger("introduction:close");
          })
          .fail(function() {
            alert('Preset niet gevonden');
            Communicator.mediator.trigger("introduction:close");
          });
      }

    });

    return Marionette.CompositeView.extend({

      childView: ItemView,

      childViewContainer: "#intro-list",

      template: ListTemplate,

      initialize: function() {
        var collection = Backbone.Collection.extend({
          url: '/data/intro.json'
        });

        this.collection = new collection();

        this.collection.on('sync', this.render, this);

        this.collection.fetch();
      }

    });

  });