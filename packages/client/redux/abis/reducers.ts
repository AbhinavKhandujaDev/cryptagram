import { Action, ABITypes, ActionTypes } from "../types";

const initialState: ABITypes = {
  transfer: {},
  nftStore: {},
  cryptNft: {},
  crypt: {},
};

function abiReducer(state: ABITypes = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.abi:
      state = { ...state, ...action.payload };
      return state;
    default:
      return state;
  }
}

export default abiReducer;
