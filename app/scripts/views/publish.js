define(["backbone", "backbone.marionette", "d3", "communicator", "tpl!template/publish.html", "jquery", "materialize.modal"],
  function(Backbone, Marionette, d3, Communicator, PublishTemplate, $, MaterializeModal) {

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
        this.state = o.state;

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
      },

      onShow: function() {
        var $download,
          link,
          serialized,
          self = this;

        $('.leaflet-control-container')
          .append(this.crosshair.node())
          .append(this.$borderBox);

        // Remove close on click behavior from map
        Communicator.mediator.trigger('map:setCloseOnClick', false);

        $download = $('.download', this.$el);

        $download.on('click', function() {
          self.state.save();

          serialized = JSON.stringify(self.state.toJSON());

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

        // Attach close on click behavior to map
        Communicator.mediator.trigger('map:setCloseOnClick', true);
      }

    });
  }
);