define( ["backbone", "backbone.marionette", 'leaflet', "communicator",
    "medium.editor", "jquery", "underscore", "config",
    "tpl!template/detail-settings.html"],
  function( Backbone, Marionette, L, Communicator, MediumEditor, $, _, Config,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,

      events: {
        // Prevent the dropdown from closing by stopping event propagation
        'click .dropdown-content': function(e) {
          e.stopPropagation();
        },
        'click .delete': function(e) {
          e.preventDefault();

          Communicator.mediator.trigger( "marker:removeModelByCid", this.model.cid);
        },
        'change select': 'change',
        'keyup': 'closeOnEnter'
      },

      initialize: function( o ) {
        this.model = o.model;

        this.model.on( 'change:userColor change:icon', this.changeIcon, this );
      },

      change: function(e) {
        var $input = $(e.currentTarget);

        this.model.set( $input.data('property'), $input.val() == '' ? null : $input.val() );
      },

      changeIcon: function() {
        $('.color-box', this.$el).html('<img src="'+ this.getIconUrl() + '" />');
      },

      closeOnEnter: function(e) {
        if (e.keyCode == 13) {
          $('.dropdown-button', this.$el).trigger('close');
        }
      },

      onShow: function() {
        $('.dropdown-button', this.$el).dropdown({
            inDuration: 200,
            outDuration: 200,
            constrain_width: false,
            hover: false,
            belowOrigin: true,
            alignment: 'left'
          }
        );
      },

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          iconUrl: this.getIconUrl(),
          availableColors: _.extend( { "-- Standaard --": null }, Config.availableColors),
          availableIcons: Config.makiCollection.getAvailableIcons(),
          cid: this.model.cid
        });
      },

      getIconUrl: function() {
        var icon = new L.mapbox.marker.icon({
          "marker-size": "small",
          "marker-color": this.model.get('color'),
          "marker-symbol": this.model.get('icon')
        }, {
          "accessToken": Config.mapbox.accessToken
        });

        return icon._getIconUrl('icon');
      }

    } );

  } );