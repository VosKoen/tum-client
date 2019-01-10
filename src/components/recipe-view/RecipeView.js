import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';

export default function RecipeView(props) {
    const {classes, recipe} = props
  if (recipe.title)
    return (
      <Card className={classes.card}>
        <CardHeader title={recipe.title}/>
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
      </Card>
    );

  return <div>Something went wrong.</div>;
}
