import * as React from "react";
import { connect } from "react-redux";
import MyRecipesView from "./MyRecipesView";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

import { getMyRecipes } from "../../actions/recipes";

class MyRecipesViewContainer extends React.PureComponent {
  componentDidMount() {
    this.props.getMyRecipes(userId);
  }

  render() {
    const { classes, myRecipes } = this.props;
    if (!this.props.user) return <Redirect to="/logon" />;

    return (
      <div>
        <MyRecipesView myRecipes={myRecipes} classes={classes} />
      </div>
    );
  }
}

const styles = theme => ({});

const mapStateToProps = state => ({
  myRecipes: state.myRecipes,
  user: state.user
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getMyRecipes }
  )(MyRecipesContainer)
);
