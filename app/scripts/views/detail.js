define( ["backbone", "backbone.marionette", "communicator", "medium.editor", "config", "jquery", "erfgeoviewer.common",
    "tpl!template/detail.html"],
  function( Backbone, Marionette, Communicator, MediumEditor, Config, $, App,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,
      dom: {},

      events: {
        "click .change-style": function(e) {
          e.preventDefault();
        }
      },

      initialize: function( o ) {
        this.model = o.model;
        Communicator.mediator.on( "map:tile-layer-clicked", this.hideFlyout, this);
      },

      onShow: function() {

        var singleLiners = [],
            multiLiners = [],
            self = this,
            timeout;

        // Change configuration based on whether properties found in DOM.
        _.each( $(".editable", this.$el).get(), function( e ) {
          if ( $( e ).data( 'multiline' ) ) {
            multiLiners.push(e);
          } else {
            singleLiners.push(e);
          }
        } );

        if (this.singleLineEditor) this.singleLineEditor.destroy();
        if (this.multiLineEditor) this.multiLineEditor.destroy();

        if (App.mode == "mapmaker") {

          this.singleLineEditor = new MediumEditor(singleLiners, {
            buttons: ['bold', 'italic', 'underline', 'anchor'],
            disableReturn: true,
            imageDragging: false
          });

          this.multiLineEditor = new MediumEditor(multiLiners, {
            buttons: ['bold', 'italic', 'underline', 'anchor'],
            disableReturn: false
          });

          var f = function (event, editable) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              var field = $(editable).attr('id').substr(5);
              self.model.set(field, $(editable).html());
            }, 1000);
          };
          this.singleLineEditor.subscribe( 'editableInput', f );
          this.multiLineEditor.subscribe( 'editableInput', f );

        }

      },

      serializeModel: function(model) {

        if (false && model.get('externalUrl')) {
          return _.extend({
            fields: Config.fields
          }, model.toJSON.apply(model, _.rest(arguments)));
        }
        else {
          return _.extend({
            fields: Config.fields
          }, model.toJSON.apply(model, _.rest(arguments)), {
            externalUrl: 'url'
          });
        }
      }

    } );

  } );
