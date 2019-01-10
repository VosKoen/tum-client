import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';


export default function RecipeView(props) {
    const {classes, recipe} = props
  if (recipe.title)
    return (
      <Card className={classes.card}>
        <CardHeader title={recipe.title}/>
        <CardMedia
          component="img"
          className={classes.recipeImage}
          image={recipe.imageUrl}
          title={recipe.title}
        />
        <CardContent>
        <div className="recipe-description">{recipe.description}</div>
        <div className="recipe-ingredients">
          <ul>
            {recipe.ingredients.map(ingredient => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
        </div>
        <div className="recipe-steps">
          <ul>
            {recipe.steps.map(step => (
              <li key={step.id}>{step.description}</li>
            ))}
          </ul>
        </div>
        </CardContent>
      </Card>
    );

  return <div>Something went wrong.</div>;
}
