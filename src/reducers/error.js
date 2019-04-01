
import {SET_ERROR, RESET_ERROR} from '../actions/error'

export default (state = null, action = {}) => {
  switch (action.type) {
      case RESET_ERROR:
      return null
      case SET_ERROR:
      return action.payload

    default:
      return state;
  }
};
