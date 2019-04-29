import * as React from "react";

import { connect } from "react-redux";
import FilterDialog from "./FilterDialog";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { applyFilters } from "../../actions/filters";

class FilterDialogContainer extends React.PureComponent {
  state = {
    preparationTime: this.props.filters.preparationTime,
    vegetarian: this.props.filters.vegetarian
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleCheck = event => {
    const { name, checked } = event.target;
    this.setState({
      [name]: checked
    });
  };

  handleClose = () => {
    this.props.close();
    this.setState({
      preparationTime: this.props.filters.preparationTime,
      vegetarian: this.props.filters.vegetarian
    });
  };

  handleApply = () => {
    const filters = {
      preparationTime: this.state.preparationTime,
      vegetarian: this.state.vegetarian
    };
    this.props.applyFilters(filters);
    this.props.close();
  };

  render() {
    return (
      <FilterDialog
        open={this.props.open}
        handleClose={this.handleClose}
        state={this.state}
        handleChange={this.handleChange}
        classes={this.props.classes}
        InputLabelRef={this.InputLabelRef}
        handleApply={this.handleApply}
        handleCheck={this.handleCheck}
      />
    );
  }
}

FilterDialogContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

const styles = theme => ({
  select: {
    margin: theme.spacing.unit,
    minWidth: 180
  }
});

const mapStateToProps = state => ({
  filters: state.filters
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { applyFilters }
  )(FilterDialogContainer)
);
