import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function RecipeForm(props) {
  const { classes, handleSubmit, handleChange, state, myRecipe } = props;
  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <TextField
          id="recipe-title"
          name="recipeTitle"
          label="Recipe title"
          className={classes.textField}
          value={state.recipeTitle}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          id="recipe-description"
          name="recipeDescription"
          label="Description"
          multiline
          rowsMax="8"
          value={state.recipeDescription}
          onChange={handleChange}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          required
        />

        <Typography variant="h6">Ingredients</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          Add new ingredient
        </Button>
        <List>
          {myRecipe.ingredients.map(ingredient => (
            <ListItem key={ingredient.id} disableGutters={true}>
              <ListItemText>{ingredient.name}</ListItemText>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6">Steps</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          Add new step
        </Button>
        <List>
          {myRecipe.steps.map(step => (
            <ListItem key={step.id} disableGutters={true}>
              <ListItemText>{step.description}</ListItemText>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Submit recipe
        </Button>
      </form>
    </Paper>
  );
}
