define( ["backbone", "backbone.marionette", "views/detail-navigation-item", "models/state"],
  function( Backbone, Marionette, ItemView, State ) {

    return Marionette.CollectionView.extend( {

      childView: ItemView,

      className: "detail-navigation",

      initialize: function( o ) {
        this.model = o.model;

        var data = [],
          collection = State.getPlugin('geojson_features').collection,
          currentIndex = collection.indexOf(this.model);

        if (currentIndex > 0) {
          var previousModel = collection.at(currentIndex -1);
          previousModel.set({ nav: 'previous' }, { silent: true });
          data.push(previousModel);
        }

        if (currentIndex < collection.length -1) {
          var nextModel = collection.at(currentIndex +1);
          nextModel.set({ nav: 'next' }, { silent: true });
          data.push(nextModel);
        }

        this.collection = new Backbone.Collection(data);
      }

    } );

  } );