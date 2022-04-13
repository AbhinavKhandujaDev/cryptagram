import { Action, ActionTypes } from "../types";

export function abiAction(payload: any): Action {
  return {
    type: ActionTypes.abi,
    payload: payload,
  };
}
