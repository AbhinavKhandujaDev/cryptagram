export enum ABI {
  transfer = "Transfer",
  nftStore = "NFTStore",
  cryptNft = "CRYPTNFT",
  crypt = "CRYPT",
}

export interface ABITypes {
  transfer: any;
  nftStore: any;
  cryptNft: any;
  crypt: any;
}

export enum ActionTypes {
  abi = "ABI",
}

export interface Action {
  type: string;
  payload: any;
}

export interface ReduxState {
  abi: ABITypes;
}
