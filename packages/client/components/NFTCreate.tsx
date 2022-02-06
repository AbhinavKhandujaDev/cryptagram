import { memo, useState, useCallback } from "react";
import MediaSelectView from "./MediaSelectView";
import api from "../helper/api";
import showToast from "../helper/toast";
import { CreateObj } from "../interfaces";
import { Button } from "../components";

const NFTCreate = ({ createNFT }: any) => {
  const [state, setstate] = useState<CreateObj>({
    media: null,
    isUploading: false,
    caption: "",
  });

  const upload = useCallback(
    (event: any) => {
      event.preventDefault();
      if (state?.isUploading) return;

      if (state?.media) {
        const file = state?.media;
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = async () => {
          if (reader.result) {
            let src = window.urlSource(URL.createObjectURL(file));
            setstate((prev) => ({ ...prev, isUploading: true }));
            let fileData = await window.ipfs.add(src);
            let hash = fileData.cid.toV1().toString();

            // let body = {
            //   // postUrl: `https://ipfs.infura.io/ipfs/${hash}`,
            //   postUrl: `https://ipfs.io/ipfs/${hash}`,
            //   postType: file.type,
            //   caption: state?.caption,
            // };

            let hasUploaded = hash.length > 3;

            if (hasUploaded) {
              let url = `https://ipfs.io/ipfs/${hash}`;
              // let url = `ipfs://${hash}`;
              createNFT && createNFT(url, state.caption);
            } else {
              showToast.error("Upload failed");
            }

            // let text = hasUploaded ? "Uploaded successfully" : "Upload failed";
            // hasUploaded ? showToast.success(text) : showToast.error(text);

            setstate({
              ...state,
              isUploading: false,
              media: hasUploaded ? null : state.media,
              caption: "",
            });
          }
        };
      }
    },
    [state.media, state.caption, state.isUploading]
  );
  return (
    <div className="nft-create">
      <MediaSelectView
        media={state?.media}
        remove={(e: any) => {
          e.target.value = null;
          setstate({ ...state, media: null });
        }}
        onMediaSelect={(e: any) => {
          let files = e.target.files;
          if (!files[0]) return;
          setstate({ ...state, media: files[0] });
        }}
      />
      <input
        className="w-100 py-2 px-3 text-color bg-theme my-3 rounded-3 no-focus border"
        placeholder="Add name"
        onChange={(e: any) => setstate({ ...state, caption: e.target.value })}
      />
      <Button
        disabled={!state?.media || !state?.caption}
        className="col-12 btn bg-prime text-white fw-bold"
        onClick={upload}
        loading={state?.isUploading}
      >
        Upload
      </Button>
    </div>
  );
};

export default memo(NFTCreate);
