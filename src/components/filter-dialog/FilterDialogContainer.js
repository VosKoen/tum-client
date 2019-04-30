import * as React from "react";

import { connect } from "react-redux";
import FilterDialog from "./FilterDialog";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { applyFilters } from "../../actions/filters";
import { getLabelList } from "../../actions/labels";

class FilterDialogContainer extends React.PureComponent {
  state = {
    preparationTime: this.props.filters.preparationTime,
    vegetarian: this.props.filters.vegetarian,
    filterOnLabels: false,
    
  };

  componentDidMount = async () => {
    await this.props.getLabelList();
    this.props.availableLabels.map( label => this.setState({
      [label.labelName]: this.props.filters[label.labelName] || false
    }))
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

    this.props.availableLabels.map(label =>
      this.setState({
        [label.labelName]: this.props.filters[label.labelName]
      })
    );
  };

  handleApply = () => {
    const filters = {
      preparationTime: this.state.preparationTime,
      vegetarian: this.state.vegetarian
    };
    this.props.availableLabels.map(
      label =>
        (filters[label.labelName] = this.state.filterOnLabels
          ? this.state[label.labelName]
          : false)
    );
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
        availableLabels={this.props.availableLabels}
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
  filters: state.filters,
  availableLabels: state.referenceData.labels
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { applyFilters, getLabelList }
  )(FilterDialogContainer)
);
