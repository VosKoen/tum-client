import * as React from "react";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";

class NavContainer extends React.PureComponent {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Navbar classes={classes} handleClick={this.handleClick} handleClose={this.handleClose} anchorEl={this.state.anchorEl} />
      </div>
    );
  }
}

const styles = theme => ({
  header: {
    fontFamily: ["Indie Flower", "cursive"].join(","),
    fontSize: 80,
    color: "white",
    margin: 'auto'
  }
});

const mapStateToProps = state => ({});

export default withStyles(styles)(connect(mapStateToProps)(NavContainer));
