import * as React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { Link } from "react-router-dom";

export default function MyRecipesView(props) {
  const { classes, myRecipes, handleClickRecipe, handleClickNewRecipe } = props;
  
  if (!myRecipes) return (<div>Loading...</div>)
  return (
    <Paper className={classes.myRecipes}>
    <div className={classes.myRecipesHeader}>
    <Typography variant="h6">
      Recipes
      </Typography>
      <Link to={"/recipe-form"} style={{ textDecoration: 'none' }}>
      <Fab color="primary" aria-label="Add" onClick={handleClickNewRecipe}>
        <AddIcon />
      </Fab>
      </Link>
      </div>
    <List>
      {myRecipes.map((recipe,index) => (
        <ListItem key={index} disableGutters={true} divider button onClick={() => handleClickRecipe(recipe.id)}>
          <ListItemText primary={recipe.title} />
        </ListItem>
      ))}
      </List>
      </Paper>
  );
}
