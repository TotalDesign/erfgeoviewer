define([
    'backbone', 'backbone.marionette', 'communicator', 'react', 'react.paginate', 'sandbox/react-view'
  ],

  function( Backbone, Marionette, Communicator, React, ReactPaginate, ReactView ) {
    'use strict';

    var App = new Marionette.Application();

    var container = new Marionette.Region({
      el: "#application"
    });

    App.addInitializer( function () {

      function App() {
        this.AppView = React.createClass({
          render: function () {
            return (
              <div>
                <p>Hello, React!</p>
              </div>
            );
          }
        });
      }

      var ResultPagination = React.createClass({

        handlePageClick: function(data) {
          var selected = data.selected;
          var offset = Math.ceil(selected * this.props.perPage);

          this.setState({offset: offset}, function() {
            //this.loadCommentsFromServer();
          }.bind(this));

          //this.loadCommentsFromServer();
        },

        getInitialState: function() {
          return {data: [], offset: 0};
        },

        componentDidMount: function() {
          //this.loadCommentsFromServer();
        },

        render: function () {
          return (
            <div className="commentBox">
              <ReactPaginate previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={<li className="break"><a href="">...</a></li>}
                pageNum={this.state.pageNum}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                clickCallback={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClass={"active"} />
            </div>
          );
        }
      });


      /**
       * Layout
       */
      var AppLayoutView = Marionette.LayoutView.extend({
        template: "#template-layout",
        regions: {
          header: "#header",
          content: "#content",
          layerAdd: "#layer-add",
          details: "#details"
        }
      });

      var layout = new AppLayoutView();
      layout.render();
      container.show(layout);



      //layout.getRegion( 'content' ).show( new ReactView() );
      React.render(
        <ResultPagination url={'http://localhost:3000/comments'}
          author={'adele'}
          perPage={10} />,
        $('#content')[0]
      );



      Communicator.mediator.on( "all", function(e, a) {
        console.log("event", e);
      });

  });

  App.on("start", function() {
    Backbone.history.start();
  });

  return App;


});