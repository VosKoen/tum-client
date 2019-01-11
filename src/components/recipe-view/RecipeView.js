import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

export default function RecipeView(props) {
  const { classes, recipe } = props;
  if (recipe.title)
    return (
      <Card className={classes.card}>
        <CardHeader title={recipe.title} />
        <CardMedia
          component="img"
          className={classes.recipeImage}
          image={recipe.imageUrl}
          title={recipe.title}
        />
        <CardContent>
          <Typography variant="h6" align="left">
            Description
          </Typography>
          <Typography
            component="p"
            className={classes.recipeDescription}
            align="left"
          >
            {recipe.description}
          </Typography>
          <Typography variant="h6" align="left">
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients.map(ingredient => (
              <ListItem key={ingredient.id} disableGutters={true}>
                <Typography
                  component="p"
                  className={classes.recipeIngredients}
                  align="left"
                >
                  {ingredient.name}
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
                    className={classes.recipeSteps}
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
