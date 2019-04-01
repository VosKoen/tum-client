import {
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  SET_USER_PROFILE_DATA,
  SET_NEW_PASSWORD_FAILED,
  SET_NEW_PASSWORD_SUCCESS,
  SET_USER_SAVE_FAIL,
  SET_USER_SAVE_SUCCESS
} from "../actions/users";
import { localStorageJwtKey } from "../constants";

let initialState = null;
try {
  const jwt = localStorage.getItem(localStorageJwtKey);
  if (jwt) {
    initialState = { jwt };
  }
} catch (e) {
  console.log(`Error retrieving data from local storage`, e);
}

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case USER_LOGIN_SUCCESS:
      return payload;

    case USER_LOGOUT:
      return null;

    case SET_USER_PROFILE_DATA:
      return { ...state, ...payload, resetPasswordFailMessage: null , resetPasswordSuccessMessage: null, userSaveMessage: null};

    case SET_NEW_PASSWORD_FAILED:
      return { ...state, resetPasswordFailMessage: payload, resetPasswordSuccessMessage: null, userSaveMessage: null  };

    case SET_NEW_PASSWORD_SUCCESS:
      return { ...state, resetPasswordFailMessage: null, resetPasswordSuccessMessage: "Password changed", userSaveMessage: null  };

    case SET_USER_SAVE_FAIL:
    return { ...state, resetPasswordFailMessage: null, resetPasswordSuccessMessage: null, userSaveMessage: payload };
    
    case SET_USER_SAVE_SUCCESS:
    return { ...state, resetPasswordFailMessage: null, resetPasswordSuccessMessage: null, userSaveMessage: "Changes saved" };


    default:
      return state;
  }
}
