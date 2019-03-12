import * as React from "react";
import { connect } from "react-redux";
import PaginationBar from "./paginationBar";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

class PaginationBarContainer extends React.PureComponent {
  state = {
    limit: this.props.startLimit,
    selectedLimit: this.props.startLimit,
    offset: this.props.startOffset
  };

  handleClickFirstPage = () => {
    const newLimit = this.state.selectedLimit;
    const newOffset = 0;

    this.setState({
      limit: newLimit,
      offset: newOffset
    });

    this.props.functionToCallWithLimitAndOffset(newLimit, newOffset);
  };

  handleClickPreviousPage = () => {
    const newLimit = this.state.selectedLimit;
    const newOffset = Math.max(this.state.offset - newLimit, 0);

    this.setState({
      limit: newLimit,
      offset: newOffset
    });
    this.props.functionToCallWithLimitAndOffset(newLimit, newOffset);
  };

  handleClickNextPage = () => {
    const newLimit = Math.min(
      this.state.selectedLimit,
      this.props.itemsTotal - (this.state.offset + this.state.selectedLimit) > 0
        ? this.props.itemsTotal - (this.state.offset + this.state.selectedLimit)
        : this.state.limit
    );

    const newOffset = Math.max(
      0,
      Math.min(
        this.state.offset + this.state.selectedLimit,
        this.props.itemsTotal - newLimit
      )
    );

    this.setState({
      limit: newLimit,
      offset: newOffset
    });
    this.props.functionToCallWithLimitAndOffset(newLimit, newOffset);
  };

  handleClickLastPage = () => {
    let newLimit = Math.min(
      this.state.selectedLimit,
      this.props.itemsTotal % this.state.selectedLimit
    );
    if (newLimit === 0) newLimit = this.state.selectedLimit;
    const newOffset = Math.max(this.props.itemsTotal - newLimit, 0);

    this.setState({
      limit: newLimit,
      offset: newOffset
    });
    this.props.functionToCallWithLimitAndOffset(newLimit, newOffset);
  };

  render() {
    return (
      <PaginationBar
        classes={this.props.classes}
        handleClickFirstPage={this.handleClickFirstPage}
        handleClickPreviousPage={this.handleClickPreviousPage}
        handleClickNextPage={this.handleClickNextPage}
        handleClickLastPage={this.handleClickLastPage}
        itemsTotal={this.props.itemsTotal}
        limit={this.state.limit}
        offset={this.state.offset}
      />
    );
  }
}

PaginationBarContainer.propTypes = {
  itemsTotal: PropTypes.number.isRequired,
  startLimit: PropTypes.number.isRequired,
  startOffset: PropTypes.number.isRequired,
  functionToCallWithLimitAndOffset: PropTypes.func.isRequired
};

const styles = theme => ({});

const mapStateToProps = state => ({
  user: state.user
});

export default withStyles(styles)(
  connect(mapStateToProps)(PaginationBarContainer)
);
