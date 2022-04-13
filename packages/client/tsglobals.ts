import type Web3 from "web3";
import { compose } from "redux";
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    dates: { [key: string]: string };
    web3: Web3;
    ethereum: any;
    api: (url: string, data?: any) => Promise<any>;
    ipfs: any;
    urlSource: (
      url: string,
      options?: any
    ) => { path: string; content?: AsyncIterable<Uint8Array> | undefined };
  }
}

export default global;
