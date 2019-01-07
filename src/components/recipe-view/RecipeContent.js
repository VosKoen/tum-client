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
      <div className='recipe-ingredients' />
      <div className='recipe-steps' />
    </div>
  );

  return <div>Something went wrong.</div>
}
