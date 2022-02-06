import Web3 from "web3";
import NFT from "../abis/NFT.json";
import NFTMarket from "../abis/NFTMarket.json";
import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import wallet from "./wallet";

function nft() {
  const { loadWallet, accounts } = wallet();
  const nftCont = useRef<any>();
  const nftMarketCont = useRef<any>();
  const [loaded, setloaded] = useState<boolean>(false);

  const web3 = useMemo(() => new Web3(), []);

  useEffect(() => {
    (async () => {
      await loadWallet();
      await loadNftContracts();
      console.log("NFT contracts loaded");
      setloaded(true);
    })();
  }, []);

  const setContract = async (cont: any) => {
    const networkId = await window.web3.eth.net.getId();
    const networkData = cont.networks[networkId];
    let contrct;
    if (networkData) {
      contrct = new window.web3.eth.Contract(cont.abi, networkData.address);
    }
    return contrct;
  };

  const loadNftContracts = async () => {
    const nft = NFT as any;
    const nftMarket = NFTMarket as any;
    nftCont.current = await setContract(nft);
    nftMarketCont.current = await setContract(nftMarket);
  };

  const createNFTItem = useCallback(
    async (uri: string, price: string, name: string) => {
      let accs = await accounts();
      let nftTxn = await nftCont.current?.methods
        .createToken(uri)
        .send({ from: accs[0] });

      let currentId = nftTxn.events.Transfer.returnValues.tokenId;

      let amount = web3.utils.toWei(price, "ether");

      console.log("nft name is => ", name);
      let marketItem = await nftMarketCont.current?.methods
        .createMarketItem(nftCont.current._address, currentId, amount, name)
        .send({ from: accs[0] });

      let itemId = await nftMarketCont.current?.methods
        .getCurrentItemId()
        .call();
      console.log("tokenId => ", currentId);
      console.log("itemId => ", itemId);

      return marketItem;
    },
    [loaded]
  );

  const fetchItems = useCallback(async () => {
    // let accs = await accounts();
    let list = await nftMarketCont.current?.methods.getMarketItems().call();
    console.log("contract => ", list);
    return list;
  }, [loaded]);

  const getTokenUri = useCallback(
    async (token: number) => {
      if (!loaded) return;
      let accs = await accounts();
      let contract = nftCont.current;
      console.log("getTokenUri => ", accs[0]);

      let uri = await contract.methods.getTokenURI(token).call();
      return uri;
    },
    [loaded]
  );

  const itemCreatedByUser = useCallback(async () => {
    if (!loaded) return;
    let accs = await accounts();
    let contract = nftMarketCont.current;
    let uri = await contract.methods.itemsCreatedByMe().call({ from: accs[0] });
    return uri;
  }, [loaded]);
  // const getTokenUri = useCallback(
  //   async (token: number) => {
  //     if (!loaded) return;
  //     let accs = await accounts();
  //     let contract = nftMarketCont.current;
  //     console.log("getTokenUri => ", accs[0]);

  //     let uri = await contract.methods
  //       .getTokenURI(contract._address, token)
  //       .call({ from: accs[0] });
  //     return uri;
  //   },
  //   [loaded]
  // );

  return {
    nftCont: nftCont.current,
    nftMarket: nftMarketCont.current,
    fetchItems,
    createNFTItem,
    getTokenUri,
    itemCreatedByUser,
    loaded,
  };
}

export default nft;
