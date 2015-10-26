/**
 * ItemView for displaying date filter.
 */
define( ["backbone", 'backbone.marionette', "underscore", 'materialize.forms', "tpl!template/search/date-filter.html"],
  function(Backbone, Marionette, _, MaterializeForms, DateFilterTemplate) {

    return Marionette.ItemView.extend({

      template: DateFilterTemplate,

      events: {
        'keyup #filter-start-date': 'submitOnEnter',
        'keyup #filter-end-date': 'submitOnEnter'
      },

      ui: {
        fromDate: '#filter-start-date',
        toDate: '#filter-end-date'
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
