import Web3 from "web3";
import { useRef, useEffect, useState } from "react";
import { ReduxState, ABI } from "../redux/types";
import { useSelector } from "react-redux";

function wallet() {
  const reduxState = useSelector((state: ReduxState) => state);
  const tcontract = useRef<any>();
  const accountsRef = useRef<any>();
  const [primaryAddress, setPrimaryAddress] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      await loadWallet();
      await loadContract();
      let accounts = await window.ethereum.request({ method: "eth_accounts" });
      accountsRef.current = accounts;
      setPrimaryAddress(accounts[0]);
      window.ethereum?.on("accountsChanged", function (accs: any) {
        let acc = accs[0] ? accs[0] : accounts[0];
        setPrimaryAddress(acc);
      });
    })();
  }, []);

  const accounts = async () => {
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    accountsRef.current = accounts;
    return accounts;
  };

  const loadContract = async () => {
    if (tcontract.current !== undefined) return;
    const networkId = await window.web3.eth.net.getId();
    const transfer = reduxState.abi.transfer;
    const networkData = transfer.networks[networkId];
    if (networkData) {
      const contrct = new window.web3.eth.Contract(
        transfer.abi,
        networkData.address
      );
      tcontract.current = contrct;
    }
  };

  const getEthBalance = async (address: string) => {
    let bal = await window.web3.eth.getBalance(address);
    let ethBal = Number(bal) / 10 ** 18;
    return ethBal.toFixed(6);
  };
  const loadWallet = async () => {
    const ethWin = window.ethereum;
    if (ethWin) {
      window.web3 = new Web3(ethWin);
      await ethWin.enable();
      // await loadContract();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // await loadContract();
    } else {
      window.alert("No ethereum browser detected checkout MetaMask!");
    }
  };

  // const transfer = async (from: string, to: string, postId: string) => {
  //   try {
  //     // let amount = (1e14).toString();
  //     let amount = window.web3.utils.toWei("0.01", "ether");
  //     // tcontract.current.methods
  //     //   .approve(to, amount)
  //     //   .send({ from })
  //     //   .on("transactionHash", async (hash: any) => {
  //     //   });
  //     let res = await tcontract.current.methods
  //       .transfer(to, from, postId)
  //       .send({ from: from, value: amount });
  //     // let res = await window.web3.eth.sendTransaction({
  //     //   to: to,
  //     //   from: from,
  //     //   value: amount,
  //     // });
  //     console.log("RESULT => ", res);
  //   } catch (error) {
  //     console.log("Eth transfer error => ", JSON.stringify(error, null, 4));
  //     return false;
  //   }
  // };
  const transfer = async (
    from: string,
    to: string,
    postId: string,
    userId: string
  ) => {
    try {
      let amount = window.web3.utils.toWei("0.01", "ether");

      let res = await tcontract.current.methods
        .transfer(to, userId, postId)
        .send({ from: from, value: amount });

      console.log("RESULT => ", res);
    } catch (error) {
      console.log("Eth transfer error => ", JSON.stringify(error, null, 4));
      return false;
    }
  };
  return {
    primaryAddress,
    accounts,
    accs: accountsRef.current,
    loadWallet,
    getEthBalance,
    transfer,
    contract: tcontract,
  };
}

export default wallet;
