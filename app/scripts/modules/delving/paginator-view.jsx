define(["backbone.marionette", "react", "react.paginate"], function(Marionette, React, ReactPaginate) {

  Marionette.ItemView.extend({

    initialize: function( o ) {

      this.collection = o.collection;

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

    },

    render: function() {
      React.render(
        <ResultPagination url={'http://localhost:3000/comments'}
          author={'adele'}
          perPage={10} />,
        this.el
      );
    }

  });

});