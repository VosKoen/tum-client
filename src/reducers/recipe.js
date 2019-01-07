import { SET_RANDOM_RECIPE } from "../actions/recipes";


export default (state = {
    title: null,
    description: null,
    steps: [],
    ingredients: []
}, action = {}) => {
  switch (action.type) {
    case SET_RANDOM_RECIPE:
    return {...state, ...action.payload}
    default:
      return state;
  }
};
