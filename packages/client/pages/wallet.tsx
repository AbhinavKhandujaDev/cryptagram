import type { NextPage } from "next";
import Image from "next/image";
import { Button } from "../components";
import { useEffect, useState } from "react";
// import * as wallet from "../helper/EthereumWallet";
import Script from "next/script";
import { wallet } from "../hooks";
import Web3 from "web3";

interface WalletState {
  accountAdd: string;
  balance: string;
}

const Wallet: NextPage = (props: any) => {
  const [state, setState] = useState<WalletState>();
  const { accounts, loadWallet, getEthBalance } = wallet();

  useEffect(() => {
    (async () => {
      await loadWallet();
      let accs = await accounts();
      let balance = await getEthBalance(accs[0]);
      setState({ ...state, accountAdd: accs[0], balance });
    })();
  }, []);

  return (
    <div className="page flex-center-c">
      <div className="flex-center-c col-11">
        <Image height="60px" width="60px" src="/images/metamask.svg" />
        {state?.accountAdd && (
          <div className="bg-success px-3 py-1 rounded-pill fw-bold my-3 text-center text-white">
            connected to metamask
          </div>
        )}
        {state?.accountAdd ? (
          <div className="flex-center-c">
            <label className="h1">{state?.balance} ETH</label>
            <label
              style={{ wordBreak: "break-all" }}
              className="h6 text-center text-wrap"
            >
              {state?.accountAdd}
            </label>
          </div>
        ) : (
          <Button
            loading={true}
            className="btn bg-prime text-white fw-bold mt-3"
          >
            Connect to Metamask
          </Button>
        )}
      </div>
    </div>
  );
};

export default Wallet;
