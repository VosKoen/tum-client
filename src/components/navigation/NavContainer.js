import * as React from "react";
import * as request from "superagent";
import { baseUrl } from "../../constants";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import { withStyles } from "@material-ui/core/styles";
import { logoutUser } from "../../actions/users";
import { getRandomRecipe } from "../../actions/recipes";
import { Redirect } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import { componentRecipeView } from "../../actions/activeComponents";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import ReportDialog from "./ReportDialog";

export const reportSubjectRecipe = "recipe";
export const reportSubjectImage = "image";
//Alert definitions
const alertItemIsReported = "alertItemIsReported";

class NavContainer extends React.PureComponent {
  state = {
    anchorEl: null,
    redirectMyAccount: false,
    redirectRandomRecipe: false,
    redirectMyRecipes: false,
    reportSubject: null,
    alertItemIsReported: false,
    reportDialogOpen: false
  };

  componentDidUpdate() {
    this.setState({
      redirectMyRecipes: false,
      redirectMyAccount: false,
      redirectRandomRecipe: false
    });
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClickLogout = () => {
    this.props.logoutUser();
    this.handleClose();
  };

  handleClickRandomRecipe = () => {
    this.props.getRandomRecipe();
    this.setState({ redirectRandomRecipe: true });
    this.handleClose();
  };

  handleClickMyRecipes = () => {
    this.setState({ redirectMyRecipes: true });
    this.handleClose();
  };

  handleClickMyAccount = () => {
    this.setState({ redirectMyAccount: true });
    this.handleClose();
  };

  closeAlert = alertName => {
    this.setState({
      [alertName]: false
    });
  };

  openAlert = alertName => {
    this.setState({
      [alertName]: true
    });
  };

  handleReportDialogClose = () => {
    this.setState({
      reportDialogOpen: false
    });
  };

  handleReport = () => {
    this.reportItem();
    this.handleReportDialogClose();
    this.openAlert(alertItemIsReported);
  };

  openReportDialog = reportSubject => {
    this.setState({
      reportDialogOpen: true,
      reportSubject
    });
  };

  reportItem = () => {
    const jwt = this.props.user.jwt;

    switch (this.state.reportSubject) {
      case reportSubjectRecipe:
        request
          .post(`${baseUrl}/recipes/${this.props.recipe.id}/reports`)
          .set("Authorization", `Bearer ${jwt}`)
          .catch(err => console.error(err));
        break;
      case reportSubjectImage:
        request
          .post(`${baseUrl}/images/${this.props.recipe.imageId}/reports`)
          .set("Authorization", `Bearer ${jwt}`)
          .catch(err => console.error(err));
        break;
      default:
        break;
    }
  };

  renderReportButtons = () => {
    const { classes } = this.props;
    if (this.props.activeComponents[componentRecipeView])
      return (
        <Grid container justify="flex-end">
          {this.props.recipe.isOpenedRecipe ? (
            ""
          ) : (
            <Button
              className={classes.appBarButton}
              onClick={() => this.openReportDialog(reportSubjectRecipe)}
            >
              Report recipe
            </Button>
          )}
          <Button
            className={classes.appBarButton}
            onClick={() => this.openReportDialog(reportSubjectImage)}
            disabled={
              this.props.recipe.recipeImageFromUser ||
              !this.props.recipe.imageId
            }
          >
            Report image
          </Button>
        </Grid>
      );

    return;
  };

  renderItemIsReportedAlert = () => {
    return (
      <Dialog
        open={this.state.alertItemIsReported}
        onClose={() => this.closeAlert(alertItemIsReported)}
      >
        <DialogContent>
          <DialogContentText>Thank you for reporting!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.closeAlert(alertItemIsReported)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    const { classes } = this.props;

    if (this.props.user)
      return (
        <div>
          <Navbar
            classes={classes}
            handleClick={this.handleClick}
            handleClose={this.handleClose}
            handleClickLogout={this.handleClickLogout}
            anchorEl={this.state.anchorEl}
            handleClickRandomRecipe={this.handleClickRandomRecipe}
            handleClickMyAccount={this.handleClickMyAccount}
            handleClickMyRecipes={this.handleClickMyRecipes}
            renderReportButtons={this.renderReportButtons}
          />
          {this.state.redirectRandomRecipe ? (
            <Redirect to="/" />
          ) : this.state.redirectMyRecipes ? (
            <Redirect to="/my-recipes" />
          ) : this.state.redirectMyAccount ? (
            <Redirect to="/my-account" />
          ) : (
            ""
          )}
          <div className={this.props.activeComponents[componentRecipeView] ? classes.toolbarSpacerRecipeView : classes.toolbarSpacerOther } />
          <ReportDialog
            state={this.state}
            handleReportDialogClose={this.handleReportDialogClose}
            handleReport={this.handleReport}
          />
          {this.renderItemIsReportedAlert()}
        </div>
      );
    return <div />;
  }
}

const styles = theme => ({
  header: {
    fontFamily: ["Indie Flower", "cursive"].join(","),
    fontSize: 80,
    color: "white",
    margin: "auto"
  },
  appBarButton: {
    color: "white"
  },
  toolbarSpacerRecipeView: {
    [theme.breakpoints.up("sm")]: { minHeight: 80 },

    [theme.breakpoints.down("xs")]: {
      minHeight: 116
    }
  },
  toolbarSpacerOther: {
    minHeight: 80
  }
});

const mapStateToProps = state => ({
  user: state.user,
  activeComponents: state.activeComponents,
  recipe: state.recipe
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { getRandomRecipe, logoutUser }
  )(NavContainer)
);
