define( ["backbone", "backbone.marionette", "communicator", "medium.editor", "config", "jquery", "erfgeoviewer.common",
    "tpl!template/detail.html"],
  function( Backbone, Marionette, Communicator, MediumEditor, Config, $, App,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,
      dom: {},

      events: {
        'click .hide-flyout': function(e) {
          Communicator.mediator.trigger('flyouts:hideRegionById', "flyout-detail");
        },
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

        // Move the controls region just after the title, no matter where it has been placed.
        $controls = $('#detail-controls');
        $('.row.title', this.$el).after( $controls );
        $controls.addClass('visible');

        if (this.singleLineEditor) this.singleLineEditor.destroy();
        if (this.multiLineEditor) this.multiLineEditor.destroy();

        if (App.mode == "mapmaker") {

          this.singleLineEditor = new MediumEditor(singleLiners, {
            toolbar: {
              buttons: ['bold', 'italic', 'underline', {
                name: 'anchor',
                aria: 'link',
                customClassOption: 'btn color-secondary',
                customClassOptionText: 'Toon als knopje',
                tagNames: ['a'],
                action: 'createLink',
                contentDefault: '<b>#</b>'
              }]
            },
            disableReturn: true,
            imageDragging: false
          });

          this.multiLineEditor = new MediumEditor(multiLiners, {
            toolbar: {
              buttons: ['anchor', 'h2', 'h3', 'bold', 'italic', 'underline', 'quote']
            },
            disableReturn: false
          });

          var f = function (event, editable) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              var field = $(editable).attr('id').substr(5);
              self.model.set(field, $(editable).html());
            }, 1000);
          };

          if (singleLiners.length > 0) {
            this.singleLineEditor.subscribe( 'editableInput', f );
          }
          if (multiLiners.length > 0) {
            this.multiLineEditor.subscribe( 'editableInput', f );
          }

        }

      },

      serializeModel: function(model) {
        if (App.mode == 'reader' || model.get('externalUrl')) {
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
