define( ["backbone", "backbone.marionette", "views/legend-item"],
  function( Backbone, Marionette, LegendItemView ) {

    return Marionette.CollectionView.extend( {

      childView: LegendItemView,

      className: "legend",

      initialize: function(o) {
        this.collection = new Backbone.Collection( o.legend );
      }

    } );

  } );