import { SET_MY_RECIPES, ADD_NEW_RECIPE_TO_MY_RECIPES} from "../actions/recipes";

export default (state = [], action = []) => {
  switch (action.type) {
    case SET_MY_RECIPES:
      return [...action.payload ];

      case ADD_NEW_RECIPE_TO_MY_RECIPES:
      return [...state, action.payload]

    default:
      return state;
  }
};
