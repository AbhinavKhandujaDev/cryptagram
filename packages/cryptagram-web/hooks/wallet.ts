import Web3 from "web3";

function wallet() {
  const accounts = async () => {
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts;
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
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected checkout MetaMask!");
    }
  };
  return {
    accounts,
    loadWallet,
    getEthBalance,
  };
}

export default wallet;
