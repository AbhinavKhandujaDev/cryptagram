import { memo, useMemo } from "react";
import Button from "./Button";

const NFTPost = memo(({ walletAddr, cls, item, buy, id }: any) => {
  const desc = useMemo(() => {
    if (item.owner?.toLowerCase() === walletAddr?.toLowerCase()) {
      item.isSelling = false;
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
        </div>
        <label style={{ height: 20 }} className="fw-bold text-danger">
          {desc}
        </label>
      </div>
    </div>
  );
});
// const NFTPost = memo(({ cls, item, buy, id }: any) => {
//   return (
//     <div
//       id={id}
//       className={`col-12 col-sm-4 col-md-4 col-lg-4 col-xl-3 ratio-eq flex-center-h p-2 ${cls}`}
//     >
//       <div className="flex-center-h rounded-3 overflow-hidden shadow h-100 w-100">
//         <img
//           className="w-100 h-100"
//           style={{ objectFit: "cover" }}
//           // src="https://i.pravatar.cc"
//           src={item.uri || ""}
//         />
//         <div
//           style={{
//             background:
//               "linear-gradient(180deg, rgba(34,90,200,0) 0%, rgba(0,0,0,0.6) 100%)",
//           }}
//           className="w-100 h-100 position-absolute d-flex align-items-end justify-content-center"
//         >
//           <div className="d-flex justify-content-between align-items-end w-100 px-4 py-3">
//             <div className="text-white fw-bold me-2">{item.name}</div>
//             <Button
//               style={{ fontSize: "13px" }}
//               spinnerProps={{ color: "dark" }}
//               onClick={buy}
//               className="btn rounded-pill bg-white fw-bold text-dark flex-shrink-0 flex-center-h"
//             >
//               <img src="https://img.icons8.com/fluency/18/000000/ethereum.png" />
//               {item.price}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

export default NFTPost;
