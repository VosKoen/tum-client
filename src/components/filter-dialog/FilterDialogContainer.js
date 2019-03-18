import * as React from "react";

import { connect } from "react-redux";
import FilterDialog from "./FilterDialog";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

class FilterDialogContainer extends React.PureComponent {
  state = {
    preparationTime: "",
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <FilterDialog
        open={this.props.open}
        close={this.props.close}
        state={this.state}
        handleChange={this.handleChange}
        classes={this.props.classes}
        InputLabelRef={this.InputLabelRef}
      />
    );
  }
}

FilterDialogContainer.propTypes = {
  open: PropTypes.bool.isRequired
};

const styles = theme => ({
  select: {
    margin: theme.spacing.unit,
    minWidth: 180
  }
});

const mapStateToProps = state => ({});

export default withStyles(styles)(
  connect(mapStateToProps)(FilterDialogContainer)
);
