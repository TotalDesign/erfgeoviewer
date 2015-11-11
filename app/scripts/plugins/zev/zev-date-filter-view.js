/**
 * ItemView for displaying date filter.
 */
define( ["backbone", 'backbone.marionette', "underscore", 'materialize.forms', "d3",
    "tpl!template/search/date-filter.html"],
  function(Backbone, Marionette, _, MaterializeForms, d3,
           DateFilterTemplate) {

    return Marionette.ItemView.extend({

      template: DateFilterTemplate,

      yearFacet: false,

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
        this.model.set('yearFacet', false);
        if (o.results && _.isArray(o.results.state.facetConfig)) {
          this.yearFacet = _.findWhere( o.results.state.facetConfig, {key: "dc:date.year"} );
          //this.model.set( 'yearFacet', this.yearFacet );
        }
      },

      onShow: function() {

        if (this.yearFacet) {

          var o = this.yearFacet.options;

          var hits = _.pluck(o, 'count'),
              years = o.map(function (d) {
                return Number(d.value);
              }),
              yearRange = d3.range(d3.min(years), d3.max(years));

          var margin = {top: 0, right: 20, bottom: 15, left: 20},
              height = 40 - margin.top - margin.bottom,
              width = 215 - margin.left - margin.right;

          var brush = d3.svg.brush()
              .extent(d3.extent(yearRange))
              .on("brush", function () {

              });

          var x = d3.scale.linear()
              .domain(d3.extent(years))
              .range([0, width]);

          var y = d3.scale.linear()
              .domain([d3.min(hits), d3.max(hits)])
              .range([0, height]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .tickValues(function () {
                var a = x.domain();
                return [a[0], Math.round((a[1] - a[0]) / 2 + a[0]), a[1]];
              })
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
                var facet = _.find(o, function (d) {
                      return Number(d.value) == year;
                    }) || {count: 0};

                el.attr('height', y(facet.count) < 0 ? 0 : y(facet.count));
                el.attr('y', height - y(facet.count));

              });

            // TODO: add brush
            // https://github.com/square/crossfilter/blob/gh-pages/index.html

        }

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
