define(["backbone", "backbone.marionette", "d3", "communicator", 'models/state', "tpl!template/publish.html", "jquery", "materialize.modal"],
  function(Backbone, Marionette, d3, Communicator, State, PublishTemplate, $, MaterializeModal) {

    return Marionette.ItemView.extend({

      template: PublishTemplate,

      crosshair: null,

      event: {
        "click .download": function(e) {
          e.preventDefault();
          $('#modal-save').closeModal();
          var self = this;
          _.delay(function() {
            // Inspector gadget received his secret msg
            self.destroy();
          }, 100);
        }
      },

      initialize: function(o) {
        this.on('hide', this.onHide, this);

        this.crosshair = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'))
          .attr("class", "crosshair")
          .attr("width", 100)
          .attr("height", 100);
        this.crosshair.append("svg:line")
          .attr("x1", 0)
          .attr("y1", 50)
          .attr("x2", 100)
          .attr("y2", 50);
        this.crosshair.append("svg:line")
          .attr("x1", 50)
          .attr("y1", 0)
          .attr("x2", 50)
          .attr("y2", 100);

        this.$borderBox = $('<div class="border-box-container"><div class="border-box"><p>Default center and zoom level</p></div></div>');

        this.onChangePosition = _.bind( this._onChangePosition, this );
        Communicator.mediator.on( 'map:moveend', this.onChangePosition );
      },

      onShow: function() {
        var $download,
          link,
          serialized,
          self = this;

        // Remove close on click behavior from map
        Communicator.mediator.trigger('map:setCloseOnClick', false);
        Communicator.mediator.trigger('map:setUpdateOnPositionChange', false);

        // Position and zoom map to stored export settings if any
        if (State.getPlugin('map_settings').model.get('centerPoint')) {
          Communicator.mediator.trigger( 'map:setPosition', {
            centerPoint: State.getPlugin('map_settings').model.get('centerPoint'),
            zoom: State.getPlugin('map_settings').model.get('zoom')
          });
        }
        else {
          // Store initial center point and zoom level by triggering map move
          Communicator.mediator.trigger( 'map:move' );
        }

        // Append crosshair and border box
        $('.leaflet-control-container')
          .append(this.crosshair.node())
          .append(this.$borderBox);

        $download = $('.download', this.$el)
          .on('click', function() {
            State.save();

            serialized = JSON.stringify(State.toJSON());

            link = "data:text/json;charset=utf-8," + encodeURIComponent(serialized);

            $download.prop('href', link)
              .prop('download', 'erfgeoviewer.json');
          });
      },

      onHide: function() {
        this.reset();
      },

      onDestroy: function() {
        this.reset();
      },

      reset: function() {
        $(this.crosshair.node()).remove();
        this.$borderBox.remove();

        Communicator.mediator.off( 'map:moveend', this.onChangePosition );

        // Attach close on click behavior to map
        Communicator.mediator.trigger('map:setCloseOnClick', true);
        Communicator.mediator.trigger('map:setUpdateOnPositionChange', true);
        Communicator.mediator.trigger('map:resetEditorPosition');
      },

      _onChangePosition: function(map) {
        State.getPlugin('map_settings').model.set({
          centerPoint: map.getCenter(),
          zoom: map.getZoom()
        });
      }

    });
  }
);