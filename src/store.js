import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./reducers";
import { storeJwt } from "./middleware";
import ReduxThunk from "redux-thunk";

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const enhancer = compose(
  applyMiddleware(ReduxThunk, storeJwt),
  devTools
);

const store = createStore(reducer, enhancer);

export default store;
