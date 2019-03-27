import {SET_COMPONENT, componentRecipeView} from '../actions/activeComponents'

export default (state = {
    [componentRecipeView]: false
}, action = {}) => {
  switch (action.type) {
    case SET_COMPONENT:
      return { ...state, ...action.payload}
    default:
      return state;
  }
};
