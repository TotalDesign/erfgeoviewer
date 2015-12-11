/**
 *
 * ItemView for displaying date filter.
 */
define( ["backbone", 'backbone.marionette', "underscore", "communicator", 'materialize.forms', "d3",
    "tpl!template/date-filter.html"],
  function(Backbone, Marionette, _, Communicator, MaterializeForms, d3,
           DateFilterTemplate) {

    return Marionette.ItemView.extend({

      template: DateFilterTemplate,

      collection: null,

      events: {
        'keyup #filter-start-date': 'submitOnEnter',
        'keyup #filter-end-date': 'submitOnEnter'
      },

      ui: {
        fromDate: '#filter-start-date',
        toDate: '#filter-end-date'
      },

      initialize: function(o) {
        o = o || {};
        if (o.collection) {
          this.collection = o.collection;
        }
      },

      onShow: function() {
        if (this.collection && this.collection.models && _.isArray(this.collection.models)) {
          var self = this;
          var models = this.collection.models;
          var hits = [];
          var years = [];
          for (var i = 0; i < models.length; i++) {
            var model = models[i];
            var year = Number(model.get("year"));
            var key = '' + year;
            years.push(year);
            hits[key] = hits[key] ? ++hits[key] : 1;
          }

          var margin = {top: 15, right: 20, bottom: 15, left: 20},
              height = 100 - margin.top - margin.bottom,
              width = this.$el.width() - margin.left - margin.right;

          var minYears = d3.min(years);
          var maxYears = d3.max(years);
          maxYears += width / (maxYears - minYears);    //increase by width of one bar to ensure the last one is visible
          var yearRange = d3.range(minYears, maxYears);

          var x = d3.scale.linear()
              .domain(d3.extent(years))
              .range([0, width]);

          var y = d3.scale.linear()
              .domain([0, d3.max(hits)])
              .range([0, height]);

          var xAxis = d3.svg.axis()
              .scale(x)
              //.tickValues(function () {
              //  var a = x.domain();
              //  return [a[0], Math.round((a[1] - a[0]) / 2 + a[0]), a[1]];
              //})
              .ticks(14)
              .tickFormat(d3.format("4d"))
              .orient("bottom");

          var svg = d3.select("#resultGraph")
              .append("svg")
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.left + margin.right);
          var focus = svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var leftHandle = focus.append("image")
            .attr("width", 15)
            .attr("height", height)
            .attr("display", "none")
            .attr("xlink:href", "images/left-handle.png")
            .attr("x-index", 1100)
            .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")");

          var rightHandle = focus.append("image")
            .attr("width", 15)
            .attr("height", height)
            .attr("display", "none")
            .attr("xlink:href", "images/right-handle.png")
            .attr("x-index", 1100)
            .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")");

          // Render histograph.
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.selectAll("rect")
              .data(yearRange)
              .enter().append("rect")
              .attr('x', x)
              .attr('width', width / yearRange.length)
              .each(function (year) {
                var el = d3.select(this);
                var value = hits[year] ? y(hits[year]) : 0;
                el.attr('height', value < 0 ? 0 : value);
                el.attr('y', height - value);
              });

          //add brush for selections
          var brush = d3.svg.brush().x(x);

          //start
          var startDragging = false;
          brush.on("brushstart", function() {
            var extent = brush.extent();
            startDragging = true;
          });

          //moving
          brush.on("brush", function() {
            if (startDragging) {
              leftHandle.attr("display", "none");
              rightHandle.attr("display", "none");
              startDragging = false;
            } else {
              var extent = brush.extent();

              // if dragging, preserve the width of the extent
              if (d3.event.mode === "move") {
                var dist = Math.abs(extent[0] - extent[1]);
                extent[0] = Math.round(extent[0]);
                extent[1] = extent[0] + dist;
              } else {
                //resizing
                extent[0] = Math.floor(extent[0]);
                extent[1] = Math.ceil(extent[1]);
              }
              d3.select(this).call(brush.extent(extent));

              leftHandle.attr("x", x(extent[0]) - 11);
              rightHandle.attr("x", x(extent[1]) - 4);
              leftHandle.attr("display", "inherit");
              rightHandle.attr("display", "inherit");
            }
          });

          //end
          brush.on("brushend", function () {
              //user selected time frame
              var extent = brush.extent();
              if (extent.length > 1) {
                var clearSelection = extent[0] === extent[1];
                var start = Math.floor(extent[0]);
                var end = Math.ceil(extent[1]);
                if (clearSelection) {
                  console.log("brush: clear selection");
                  leftHandle.attr("display", "none");
                  rightHandle.attr("display", "none");
                } else {
                  console.log("brush: selection start year = " + start + ", end year = " + end);
                }

                //show/hide features based on year
                self.collection.each(function(model) {
                  var year = Number(model.get("year"));
                  if (year && $.isNumeric(year)) {
                    var visible = clearSelection || (year >= start && year <= end);
                    model.set("visible", visible);
                  }
                });

                //zoom map to visible features
                Communicator.mediator.trigger('map:fitAll');
              }
            });

          svg.append("g")
            .attr("class", "x brush")
            .call(brush)  //call the brush function, causing it to create the rectangles
            .selectAll("rect") //select all the just-created rectangles
            .attr("y", -6)
            .attr("height", height + 7); //set their height
        }

        Communicator.mediator.trigger("search:updateTabindices");
      },

      submitOnEnter: function(e) {
        if (e.keyCode == 13) {
          this.model.set( 'date', {
            from: this.ui.fromDate.val(),
            to: this.ui.toDate.val()
          }, { silent: true });
          // This is to trigger change also when nothing actually changed
          this.model.trigger('change:date');
        }
      },

      serializeModel: function(model) {
        var d = new Date();

        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          maxYear: d.getFullYear()
        });
      }

    });

  });
