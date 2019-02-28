import * as React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Grid } from "@material-ui/core";

export default function RecipeView(props) {
  const {
    classes,
    recipe,
    renderRecipeSelectButtons,
    renderRecipeRating,
    renderEditDeleteButtons
  } = props;

  if (recipe.title)
    return (
      <Card className={classes.card}>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <CardMedia
              component="img"
              src={recipe.imageUrl}
              title={recipe.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          {renderEditDeleteButtons()}
            <Typography variant="h5">{recipe.title}</Typography>
            <CardContent>
              <Typography component="p" align="left">
                {recipe.description}
              </Typography>
            </CardContent>

            {renderRecipeSelectButtons()}
            {renderRecipeRating()}

          </Grid>
        </Grid>
        <CardContent>
          <Typography variant="h6" align="left">
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients.map(ingredient => (
              <ListItem key={ingredient.ingredientId} disableGutters={true}>
                <Typography
                  component="p"
                  align="left"
                >
                  {ingredient.amountNumber} {ingredient.amountTypeUnitName} {ingredient.name} 
                </Typography>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" align="left">
            Steps
          </Typography>
          <List>
            {recipe.steps.map(step => (
              <ListItem key={step.id} disableGutters={true}>
                <Typography
                  component="p"
                  align="left"
                >
                  {step.description}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );

  return <div>Something went wrong.</div>;
}
