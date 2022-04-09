import { memo, useMemo } from "react";
import Button from "./Button";
import Switch from "./Switch";

const NFTPost = memo(
  ({ walletAddr, cls, item, buy, id, onSellingChange }: any) => {
    const isOwner = useMemo(
      () => item.owner?.toLowerCase() === walletAddr?.toLowerCase(),
      [item.owner, walletAddr]
    );
    const desc = useMemo(() => {
      if (isOwner) {
        return "You own this item";
      } else if (!item.isSelling) {
        return "Item not for sale";
      } else {
        return "";
      }
    }, [item.owner, walletAddr]);
    return (
      <div
        id={id}
        className={`col-12 col-sm-4 col-md-4 col-lg-4 col-xl-3 flex-center-h p-2 ${cls}`}
      >
        <div className="flex-center-c rounded-3 overflow-hidden border w-100 bg-theme p-2">
          <img
            className="w-100 ratio-eq rounded-3"
            style={{ objectFit: "cover" }}
            // src="https://i.pravatar.cc"
            src={item.uri || ""}
            // src="https://gateway.ipfs.io/ipfs/bafybeichmnopqqcnffdh3o5nl7uvv5za37q5mi5uiwwbo3vtm6n3euh7ji?filename=logo.png"
          />
          <div className="w-100 h-100 flex-center-c px-1 align-items-start my-3">
            <div className="text-color w-100 fw-bold mb-2">{item.name}</div>
            <div className="w-100 flex-center-h justify-content-between text-color border-bottom border-top py-2">
              Price
              <Button
                disabled={!item.isSelling}
                style={{ fontSize: "13px" }}
                spinnerProps={{ color: "dark" }}
                onClick={() => buy && buy(item)}
                className="btn rounded-pill fw-bold text-dark flex-shrink-0 flex-center-h border bg-white"
              >
                <img src="https://img.icons8.com/fluency/18/000000/ethereum.png" />
                {item.price}
              </Button>
            </div>
            {isOwner && (
              <div className="w-100 flex-center-h justify-content-between text-color border-bottom border-top py-2">
                Selling
                <Switch
                  isOn={item.isSelling}
                  switchOnBgColor="#0d6efd"
                  onSwitch={() => onSellingChange(item)}
                />
              </div>
            )}
          </div>
          <label style={{ height: 20 }} className="fw-bold text-danger">
            {desc}
          </label>
        </div>
      </div>
    );
  }
);

export default NFTPost;
