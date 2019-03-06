import * as React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";

export default function MyRecipesView(props) {
  const {
    classes,
    myRecipes,
    handleClickRecipe,
    handleClickNewRecipe,
    recipeHistory,
    handleClickRecipeHistory,
    convertTimestampToDate
  } = props;

  if (!myRecipes) return <div>Loading...</div>;
  return (
    <Paper className={classes.myRecipes}>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <Grid container className={classes.myRecipesHeader} spacing={16}>
            <Grid item xs={9}>
              <Typography variant="h6">My recipes</Typography>
            </Grid>
            <Grid item xs={3} className={classes.buttonAddRecipeContainer}>
              <Fab
                color="primary"
                aria-label="Add"
                onClick={handleClickNewRecipe}
                size="small"
              >
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
          {myRecipes ? (
            <List>
              {myRecipes.map((recipe, index) => (
                <ListItem
                  key={index}
                  disableGutters={true}
                  divider
                  button
                  onClick={() => handleClickRecipe(recipe.id)}
                >
                  <ListItemText primary={recipe.title} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>You have not submitted any recipes yet</Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Cooked recipes history</Typography>
          {recipeHistory ? (
            <List>
              {recipeHistory.map((recipe, index) => (
                <ListItem
                  key={index}
                  disableGutters={true}
                  divider
                  button
                  onClick={() => handleClickRecipeHistory(recipe.recipeId)}
                >
                  <ListItemText primary={recipe.title} secondary={convertTimestampToDate(recipe.timeSelected)}/>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>You have not cooked anything yet</Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
