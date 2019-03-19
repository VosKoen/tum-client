import {SET_FILTERS} from '../actions/filters'
import {filters} from '../constants'

const initialState = {}
filters.map(filter => initialState[filter.id] = "")


export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_FILTERS:
      return { ...action.payload}
    default:
      return state;
  }
};
