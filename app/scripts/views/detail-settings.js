define( ["backbone", "backbone.marionette", "communicator", "medium.editor", "jquery", "underscore",
    "config", "tpl!template/detail-settings.html"],
  function( Backbone, Marionette, Communicator, MediumEditor, $, _, Config,
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

        this.model.on( 'change:color', this.changeColor, this );
      },

      change: function(e) {
        var $input = $(e.currentTarget);

        this.model.set( $input.data('property'), $input.val() );
      },

      changeColor: function() {
        $('.color-box', this.$el).css({
          backgroundColor: this.model.get('color')
        });
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
        return _.extend({
          color: Config.colors.primary,
          icon: null,
          availableColors: Config.availableColors,
          availableIcons: Config.makiCollection.getAvailableIcons(),
          cid: this.model.cid
        }, model.toJSON.apply(model, _.rest(arguments)));
      }

    } );

  } );