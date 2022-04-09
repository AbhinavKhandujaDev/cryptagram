import type { GetServerSidePropsContext, NextPage } from "next";
import { useMemo, useState, useEffect, useCallback } from "react";
import { SegmentView, NFTPost, NFTCreate } from "../components";
import showToast from "../helper/toast";
import { nft, wallet } from "../hooks";
import { NFTItem } from "../interfaces";
import web3 from "web3";

interface NFTPageState {
  selected: number;
  nftItems: NFTItem[];
  created: NFTItem[];
  collected: NFTItem[];
}

const Nft: NextPage = (props: any) => {
  const {
    fetchItems,
    createNFTItem,
    getTokenUri,
    itemCreatedByUser,
    itemsCollected,
    buyItem,
    changeSellStatus,
    loaded,
  } = nft();

  const { accs, primaryAddress } = wallet();

  useEffect(() => {
    console.log("primaryAddress ==> ", primaryAddress);
  }, [primaryAddress]);

  const [state, setState] = useState<NFTPageState>({
    selected: 0,
    nftItems: [],
    created: [],
    collected: [],
  });

  const getNftItem = useCallback(
    (item: any) => {
      let nft: NFTItem = {
        itemId: item.itemId,
        name: item.name,
        nftContract: item.nftContract,
        tokenId: item.tokenId,
        owner: item.owner,
        creator: item.creator,
        price: web3.utils.fromWei(item.price, "ether"),
        royalityFee: item.royaltyFee,
        isSelling: item.isSelling,
        uri: item.uri,
      };
      return nft;
    },
    [loaded]
  );

  useEffect(() => {
    loaded &&
      (async () => {
        let items = await fetchItems();
        // let nftItems: NFTItem[] = await Promise.all(items.map(getNftItem));
        let nftItems: NFTItem[] = items.map(getNftItem);
        setState((prev) => ({ ...prev, nftItems }));
      })();
  }, [loaded]);

  useEffect(() => {
    loaded &&
      state.selected === 2 &&
      state.created.length === 0 &&
      (async () => {
        let items = await itemCreatedByUser();
        let created: NFTItem[] = await Promise.all(items.map(getNftItem));
        setState((prev) => ({ ...prev, created }));
      })();
  }, [loaded, state.selected]);

  useEffect(() => {
    loaded &&
      state.selected === 1 &&
      (async () => {
        let items = await itemsCollected();
        let collected: NFTItem[] = await Promise.all(items.map(getNftItem));
        setState((prev) => ({ ...prev, collected }));
      })();
  }, [loaded, state.selected]);

  // useEffect(() => {
  //   loaded &&
  //     state.selected === 1 &&
  //     state.collected.length === 0 &&
  //     (async () => {
  //       let items = await itemsCollected();
  //       let collected: NFTItem[] = await Promise.all(items.map(getNftItem));
  //       setState((prev) => ({ ...prev, collected }));
  //     })();
  // }, [loaded, state.selected]);

  const createNFT = useCallback(
    async (uri: string, name: string, isSelling: boolean) => {
      if (!loaded) return;
      let item = await createNFTItem(uri, "0.025", name, isSelling);
      let hasUploaded = item.transactionHash.length > 3;
      let text = hasUploaded ? "Uploaded successfully" : "Upload failed";
      hasUploaded ? showToast.success(text) : showToast.error(text);

      let items = await fetchItems();
      let nftItems: NFTItem[] = await Promise.all(items.map(getNftItem));
      setState((prev) => ({ ...prev, selected: 0, nftItems }));
    },
    [loaded]
  );

  const buy = useCallback(
    async (item: NFTItem) => {
      buyItem(item)
        .then(() => {
          showToast.success("Bought successfully");
        })
        .catch((error: any) => {
          console.log(error);
          showToast.error("Unable to buy item");
        });
    },
    [loaded, state.nftItems]
  );
  const sellingSwitch = useCallback(
    async (item: NFTItem) => {
      item.owner.toLowerCase() !== primaryAddress?.toLowerCase() &&
        showToast.error("Only owner can change the status");
      changeSellStatus(item)
        .then(() => {
          showToast.success("Status changed");
          setState((prev) => ({
            ...prev,
            nftItems: prev.nftItems.map((o) => {
              if (o.itemId === item.itemId) {
                let nObj = { ...o, isSelling: !o.isSelling };
                return nObj;
              }
              return o;
            }),
          }));
        })
        .catch(() => showToast.error("Unable to change the status"));
    },
    [accs]
  );
  const notFound = useCallback(
    (text: string) => (
      <label className="fs-1 w-100 text-center text-muted">{text}</label>
    ),
    []
  );

  let itemList = useMemo(() => {
    switch (state.selected) {
      case 0:
        return state.nftItems;
      case 1:
        return state.collected;
      case 2:
        return state.created;
      default:
        return state.nftItems;
    }
  }, [
    state.nftItems,
    state.collected,
    state.created,
    state.selected,
    primaryAddress,
  ]);

  let nftList = useMemo(() => {
    return state.nftItems?.length > 0
      ? state.nftItems.map((item: NFTItem, i: number) => (
          <NFTPost
            walletAddr={primaryAddress}
            key={item.itemId}
            id={i}
            item={item}
            buy={buy}
            onSellingChange={sellingSwitch}
          />
        ))
      : notFound("No items found");
  }, [state.nftItems, accs, primaryAddress]);

  let collectedList = useMemo(() => {
    return state.collected?.length > 0
      ? state.collected.map((item: NFTItem) => (
          <NFTPost
            key={item.itemId}
            item={item}
            onSellingChange={sellingSwitch}
          />
        ))
      : notFound("No items found");
  }, [state.collected]);

  let createdList = useMemo(() => {
    return state.created?.length > 0
      ? state.created.map((item: NFTItem) => (
          <NFTPost
            key={item.itemId}
            item={item}
            onSellingChange={sellingSwitch}
          />
        ))
      : notFound("No items found");
  }, [state.created]);

  let listToShow = useMemo(() => {
    return itemList.length > 0
      ? itemList.map((item: NFTItem, i: number) => (
          <NFTPost
            walletAddr={primaryAddress}
            key={item.itemId}
            id={i}
            item={item}
            buy={buy}
            onSellingChange={sellingSwitch}
          />
        ))
      : notFound("No items found");
  }, [itemList, primaryAddress]);

  return (
    <div id="nft" className="page py-5 flex-center-c justify-content-start">
      <SegmentView
        cls="mt-3 col-10 col-sm-7 col-md-5 col-lg-4"
        selected={state.selected}
        opts={["Market", "Collected", "Created", "Create"]}
        onSelect={(index: number) => setState({ ...state, selected: index })}
      />
      <div className="h-100 w-100 flex-grow-1" style={{ maxWidth: "1400px" }}>
        {state.selected !== 3 && (
          <div className="row w-100 my-3 mx-0 flex-center-h">{listToShow}</div>
        )}
        {/* {state.selected === 0 && (
          <div className="row w-100 my-3 mx-0 flex-center-h">{nftList}</div>
        )}
        {state.selected === 1 && (
          <div className="row w-100 my-3 mx-0 flex-center-h">
            {collectedList}
          </div>
        )}
        {state.selected === 2 && (
          <div className="row w-100 my-3 mx-0 flex-center-h">{createdList}</div>
        )} */}
        {state.selected === 3 && (
          <div className="w-100 flex-center-h py-5">
            <div className="col-10 col-md-5 col-lg-4">
              <NFTCreate createNFT={createNFT} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nft;
