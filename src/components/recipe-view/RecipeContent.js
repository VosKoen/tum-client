import * as React from "react";

export default function RecipeContent(props) {
  if(props.recipe.title)
  return (
    <div>
      <div className="recipe-title">
        {props.recipe.title}
      </div>
      <div className="recipe-description">
        {props.recipe.description}
      </div>
      <div className='recipe-ingredients'>
      <ul>
      {props.recipe.ingredients.map(ingredient => <li key={ingredient.id}>{ingredient.name}</li>)}
        </ul>
      </div>
      <div className='recipe-steps'>
      <ul>
      {props.recipe.steps.map(step => <li key={step.id}>{step.description}</li>)}
        </ul>
      </div>
    </div>
  );

  return <div>Something went wrong.</div>
}
