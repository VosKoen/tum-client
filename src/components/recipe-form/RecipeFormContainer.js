import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import RecipeForm from "./RecipeForm";

class RecipeFormContainer extends React.PureComponent {
  state = {
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleChange = event => {
    console.log(event.target.name)
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };



  render() {
    const { classes } = this.props;
    return <RecipeForm classes={classes} handleSubmit={this.handleSubmit} handleChange={this.handleChange} state={this.state} />;
  }
}

const styles = theme => ({});

const mapStateToProps = state => ({});

export default withStyles(styles)(
  connect(mapStateToProps)(RecipeFormContainer)
);
