import Web3 from "web3";
import NFT from "../abis/CRYPT.json";
import NFTStore from "../abis/NFTStore.json";
import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import wallet from "./wallet";
import { NFTItem } from "../interfaces";

function nft() {
  const { loadWallet, accounts, primaryAddress } = wallet();
  const nftCont = useRef<any>();
  const nftStoreCont = useRef<any>();
  const [loaded, setloaded] = useState<boolean>(false);

  const web3 = useMemo(() => new Web3(), []);

  useEffect(() => {
    (async () => {
      await loadWallet();
      await loadNftContracts();
      console.log("NFT contracts loaded");
      setloaded(true);
      // let nftOwner = await nftCont.current.methods.ownerOf(0).call();
      // console.log("nftOwner => ", nftOwner);
      // window.ethereum.on("accountsChanged", function (accounts) {
      //   // Time to reload your interface with accounts[0]!
      // });
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
    const nftMarket = NFTStore as any;
    nftCont.current = await setContract(nft);
    nftStoreCont.current = await setContract(nftMarket);
  };

  const createNFTItem = useCallback(
    async (
      uri: string,
      price: string,
      name: string,
      isSelling: boolean = false
    ) => {
      let accs = await accounts();
      // let nftTxn = await nftCont.current?.methods
      //   .createToken(uri)
      //   .send({ from: accs[0] });

      // let currentId = nftTxn.events.Transfer.returnValues.tokenId;

      let amount = web3.utils.toWei(price, "ether");

      // console.log("nft name is => ", name);
      let marketItem = await nftStoreCont.current?.methods
        .createItem(
          nftCont.current._address,
          uri,
          name,
          amount,
          // currentId,
          50,
          isSelling
        )
        .send({ from: accs[0] });

      // let itemId = await nftStoreCont.current?.methods
      //   .getCurrentItemId()
      //   .call();
      // console.log("tokenId => ", currentId);
      // console.log("itemId => ", itemId);

      return marketItem;
    },
    [loaded]
  );
  // const createNFTItem = useCallback(
  //   async (
  //     uri: string,
  //     price: string,
  //     name: string,
  //     isSelling: boolean = false
  //   ) => {
  //     let accs = await accounts();
  //     let nftTxn = await nftCont.current?.methods
  //       .createToken(uri)
  //       .send({ from: accs[0] });

  //     let currentId = nftTxn.events.Transfer.returnValues.tokenId;

  //     let amount = web3.utils.toWei(price, "ether");

  //     console.log("nft name is => ", name);
  //     let marketItem = await nftStoreCont.current?.methods
  //       .createItem(
  //         nftCont.current._address,
  //         uri,
  //         name,
  //         amount,
  //         currentId,
  //         50,
  //         isSelling
  //       )
  //       .send({ from: accs[0] });

  //     // let itemId = await nftStoreCont.current?.methods
  //     //   .getCurrentItemId()
  //     //   .call();
  //     // console.log("tokenId => ", currentId);
  //     // console.log("itemId => ", itemId);

  //     return marketItem;
  //   },
  //   [loaded]
  // );

  const fetchItems = useCallback(async () => {
    // let accs = await accounts();
    let list = await nftStoreCont.current?.methods.getItems().call();
    console.log("contract => ", list);
    return list;
  }, [loaded]);

  const getTokenUri = useCallback(
    async (token: number) => {
      if (!loaded) return;
      let accs = await accounts();
      let contract = nftCont.current;
      console.log("getTokenUri => ", accs[0]);

      let uri = await contract.methods.tokenURI(token).call();
      return uri;
    },
    [loaded]
  );

  const itemCreatedByUser = useCallback(async () => {
    if (!loaded) return;
    let accs = await accounts();
    let contract = nftStoreCont.current;
    let uri = await contract.methods.getItemsCreatedByUser(accs[0]).call();
    console.log("Sender is => ", accs[0]);
    console.log("Items are => ", uri);
    return uri;
  }, [loaded]);

  const buyItem = useCallback(
    async (item: NFTItem) => {
      let accs = await accounts();
      let contract = nftStoreCont.current;
      let nftcont = nftCont.current;
      let sOwner = await nftcont.methods.getStoreOwner().call();
      console.log("STORE OWNER IS ===> ", sOwner);
      console.log("ITEM OWNER IS ===> ", item.owner);
      console.log("PRIMARY ADDRESS IS ===> ", primaryAddress);

      await nftcont.methods
        .transferToken(item.tokenId, primaryAddress)
        .send({ from: item.owner });

      // return;
      // let price = web3.utils.toWei(item.price, "ether");

      // let txn = await contract.methods
      //   .buyItem(item.itemId)
      //   .send({ from: accs[0], value: price });

      // await nftcont.methods
      //   .transferToken(item.tokenId, primaryAddress)
      //   .send({ from: sOwner });
      // return txn;
    },
    [loaded, primaryAddress]
  );

  const itemsCollected = useCallback(async () => {
    let accs = await accounts();
    let contract = nftStoreCont.current;
    let txn = await contract.methods.getItemsOwnedByUser(accs[0]).call();
    console.log("itemsCollected ==> ", txn);
    return txn;
  }, [loaded]);

  const changeSellStatus = useCallback(
    async (item: NFTItem) => {
      let accs = await accounts();
      let contract = nftStoreCont.current;
      let tx = await contract.methods
        .changeSellingStatus(item.itemId, !item.isSelling)
        .send({ from: accs[0] });
      console.log("changeSellStatus ===> ", tx);
      let nitem = await contract.methods.getItemById(item.itemId).call();
      console.log("changeSellStatus item ===> ", nitem);
    },
    [loaded]
  );

  return {
    nftCont: nftCont.current,
    nftMarket: nftStoreCont.current,
    fetchItems,
    createNFTItem,
    getTokenUri,
    itemCreatedByUser,
    buyItem,
    itemsCollected,
    changeSellStatus,
    loaded,
  };
}

export default nft;
