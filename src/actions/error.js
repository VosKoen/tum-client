export const RESET_ERROR = "RESET_ERROR";
export const SET_ERROR = "SET_ERROR";

export const resetError = () => {
  return { type: RESET_ERROR, payload: null };
};

export const setError = error => {
  return { type: SET_ERROR, payload: error };
};

export const handleError = (dispatch, err) => {
    const errorInformation = {
        statusCode: null,
        statusText: null,
        message: null
    }

    try {
        errorInformation.statusCode = err.response.statusCode;
        errorInformation.statusText = err.response.statusText;
        errorInformation.message = err.response.body.message;
    } catch (e) {
        errorInformation.message = err.message;
    } finally {
        dispatch(setError(errorInformation));
    }
};
