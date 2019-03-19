export const SET_FILTERS = "SET_FILTERS";

const setFilters = filters => {
    return { type: SET_FILTERS, payload: filters };
  };
  
  export const applyFilters = filters => (dispatch) => {

    dispatch(setFilters(filters))

  };