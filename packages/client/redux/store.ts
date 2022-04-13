import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import abiReducer from "./abis/reducers";

const store = createStore(
  combineReducers({ abi: abiReducer }),
  composeWithDevTools()
);

export default store;
