import type { GetServerSidePropsContext, NextPage } from "next";
import { useMemo, useState, useEffect, useCallback } from "react";
import { SegmentView, NFTPost, NFTCreate } from "../components";
import showToast from "../helper/toast";
import { nft } from "../hooks";
import { NFTItem } from "../interfaces";
import web3 from "web3";

interface NFTPageState {
  selected: number;
  nftItems: NFTItem[];
  created: NFTItem[];
}

const Nft: NextPage = (props: any) => {
  const {
    fetchItems,
    createNFTItem,
    getTokenUri,
    itemCreatedByUser,
    buyItem,
    loaded,
  } = nft();
  const [state, setState] = useState<NFTPageState>({
    selected: 0,
    nftItems: [],
    created: [],
  });

  const getNftItem = useCallback(
    async (item: any) => {
      let uri = await getTokenUri(item.itemId);
      let nft: NFTItem = {
        itemId: item.itemId,
        name: item.name,
        nftContract: item.nftContract,
        tokenId: item.tokenId,
        owner: item.owner,
        creator: item.creator,
        price: web3.utils.fromWei(item.price, "ether"),
        royalityFee: item.royalityFee,
        isSelling: item.isSelling,
        uri: typeof uri === "string" ? uri : "",
      };
      return nft;
    },
    [loaded]
  );

  useEffect(() => {
    loaded &&
      (async () => {
        let items = await fetchItems();
        let nftItems: NFTItem[] = await Promise.all(items.map(getNftItem));
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

  const createNFT = useCallback(
    async (uri: string, name: string) => {
      if (!loaded) return;
      let item = await createNFTItem(uri, "0.025", name);
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
    async (e: any) => {
      let i = Number(e.target.id);
      let item = state.nftItems[i];
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
  const notFound = useCallback(
    (text: string) => (
      <label className="fs-1 w-100 text-center text-muted">{text}</label>
    ),
    []
  );

  let nftList = useMemo(() => {
    return state.nftItems?.length > 0
      ? state.nftItems.map((item: NFTItem, i: number) => (
          <NFTPost key={item.itemId} id={i} item={item} buy={buy} />
        ))
      : notFound("No items found");
  }, [state.nftItems]);

  let createdList = useMemo(() => {
    return state.created?.length > 0
      ? state.created.map((item: NFTItem) => (
          <NFTPost key={item.itemId} item={item} />
        ))
      : notFound("No items found");
  }, [state.created]);

  return (
    <div id="nft" className="page py-5 flex-center-c justify-content-start">
      <SegmentView
        cls="mt-3 col-10 col-sm-7 col-md-5 col-lg-4"
        selected={state.selected}
        opts={["Market", "Collected", "Created", "Create"]}
        onSelect={(index: number) => setState({ ...state, selected: index })}
      />
      <div className="h-100 w-100 flex-grow-1" style={{ maxWidth: "1400px" }}>
        {state.selected === 0 && (
          <div className="row w-100 my-3 mx-0 flex-center-h">{nftList}</div>
        )}
        {state.selected === 1 && (
          <div className="h-100 py-5 my-5">
            {notFound("No items collected")}
          </div>
        )}
        {state.selected === 2 && (
          <div className="row w-100 my-3 mx-0 flex-center-h">{createdList}</div>
        )}
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
