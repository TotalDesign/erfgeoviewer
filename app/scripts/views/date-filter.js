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

          var minYears = d3.min(years);
          var maxYears = d3.max(years);
          //var overshoot = Math.ceil((maxYears - minYears) / 10);
          var yearRange = d3.range(minYears, maxYears);

          var margin = {top: 0, right: 20, bottom: 15, left: 20},
              height = 100 - margin.top - margin.bottom,
              width = this.$el.width() - margin.left - margin.right;

          var x = d3.scale.linear()
              .domain(d3.extent(years))
              .range([0, width]);
              //.nice(14);

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
              .attr('height', height + margin.left + margin.right)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
          var brush = d3.svg.brush()
            .x(x)
            .on("brushend", function () {
              //user selected time frame
              var extend = brush.extent();
              if (extend.length > 1) {
                var clearSelection = extend[0] === extend[1];
                var start = Math.floor(extend[0]);
                var end = Math.ceil(extend[1]);
                if (clearSelection) {
                  console.log("brush: clear selection");
                } else {
                  console.log("brush: selection start year = " + start + ", end year = " + end);
                }

                //show/hide features based on year
                self.collection.each(function(model) {
                  var year = Number(model.get("year"));
                  if (year && $.isNumeric(year)) {
                    var visible = clearSelection || (year >= start && year <= end);
                    model.set("visible", visible);
                    console.log(year);
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
