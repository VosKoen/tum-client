import * as React from "react";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";

class NavContainer extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Navbar classes={classes} />
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
