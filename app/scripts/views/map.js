define(["backbone.marionette", "mapbox", "d3", "communicator",
        "views/popup", "tpl!template/map.html"],
  function(Marionette, Mapbox, d3, Communicator,
           PopupView, Template) {

  return Marionette.ItemView.extend({

    // Marionette properties.
    events: {},
    template: Template,

    // ID of dom element where Leaflet will be rendered.
    mapboxContainer: "map",

    // Marionette layout instance.
    layout: null,

    // Instance of a PopupView.
    popup: null,

    initialize: function(o) {
      var self = this;
      this.layout = o.layout;

      Communicator.mediator.on("MAP:ZOOM_IN_REQUESTED", function() {
        this.map.setZoom(this.map.getZoom() + 1);
      }, this);
      Communicator.mediator.on("MAP:ZOOM_OUT_REQUESTED", function() {
        this.map.setZoom(this.map.getZoom() - 1);
      }, this);

      this.registerAutoWidthMarker();
      this.registerLeafletZoomThrottle(200);

    },

    /**
     * Create an alternative to the L.divIcon marker, which does not support variable widths
     */
    registerAutoWidthMarker: function() {
      var self = this;
      L.DivIconAutosize = L.Icon.extend({
        options: {
          iconSize: [12, 12], // also can be set through CSS
          /*
           iconAnchor: (Point)
           popupAnchor: (Point)
           html: (String)
           bgPos: (Point)
           */
          iconHeight: 30,
          iconAnchorHeight: 44,
          className: 'leaflet-div-icon',
          html: false
        },

        createIcon: function (oldIcon) {
          var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

          div.innerHTML = options.html !== false ? options.html : '';
          this.options.iconSize = [undefined, this.options.iconHeight];
          this.options.iconAnchor = [105, this.options.iconAnchorHeight];

          if (options.bgPos) {
            div.style.backgroundPosition = (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
          }

          this._setIconStyles(div, 'icon');

          // Temporarily attach div to the dom so we can calculate the width.
          var $temp = $(div).clone().appendTo( '#' + self.mapboxContainer );
          $temp.width('auto');
          var w = $temp.outerWidth();
          $temp.remove();

          this.options.iconSize = [w, this.options.iconHeight];
          this.options.iconAnchor = [w / 2, this.options.iconAnchorHeight];

          // Necessary to set this twice, limitation of Leaflet
          this._setIconStyles(div, 'icon');

          return div;
        },

        createShadow: function () {
          return null;
        }
      });

      L.divIconAutosize = function (options) {
        return new L.DivIconAutosize(options);
      };
    },

    /**
     * Reduces the speed of Leaflet's mouse zooming.
     */
    registerLeafletZoomThrottle: function(throttle) {
      var lastScroll = new Date().getTime();
      L.Map.ScrollWheelZoom.prototype._onWheelScroll = function (e) {
        if (new Date().getTime() - lastScroll < throttle) { return; }
        var delta = L.DomEvent.getWheelDelta(e);
        var debounce = this._map.options.wheelDebounceTime;

        this._delta += delta;
        this._lastMousePos = this._map.mouseEventToContainerPoint(e);

        if (!this._startTime) {
          this._startTime = +new Date();
        }

        var left = Math.max(debounce - (+new Date() - this._startTime), 0);

        clearTimeout(this._timer);
        lastScroll = new Date().getTime();
        this._timer = setTimeout(L.bind(this._performZoom, this), left);

        L.DomEvent.stop(e);
      }
    },

    onShow: function() {

      // Load map.
      this.height = $( window ).height();
      this.width = $( window ).width();
      $( '#' + this.mapboxContainer ).css( 'height', this.height );
      L.mapbox.accessToken = "pk.eyJ1IjoidG90YWxhY3RpdmVtZWRpYSIsImEiOiJTMl95V3Y0In0.qAmXxIKEnUpX6D6YvAvu2g";
      this.map = L.mapbox.map(this.mapboxContainer, 'totalactivemedia.c9ff1169', { zoomControl: false })
      //  .setView([52.052074, 5.108049], 17);
        .setView([52.121580, 5.6304], 8);
      //this.map.scrollWheelZoom.disable();

      // SVG from Leaflet.
      this.map._initPathRoot();
      this.svg = d3.select('#' + this.mapboxContainer).select("svg");
      this.g = this.svg.append("g");

      this.showMarkers();

    },

    showMarkers: function() {

    }

  });

});