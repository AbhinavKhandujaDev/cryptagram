import type Web3 from "web3";
declare global {
  interface Window {
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
