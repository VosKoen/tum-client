export const SET_COMPONENT = "SET_COMPONENT";

export const componentRecipeView = 'RecipeView'

const setComponent = (componentName, isComponentActive) => {
  return {
    type: SET_COMPONENT,
    payload: { [componentName]: isComponentActive }
  };
};

export const setComponentRecipeView = isComponentActive => dispatch => {
  dispatch(setComponent(componentRecipeView, isComponentActive));
};
