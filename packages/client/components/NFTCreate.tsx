import { memo, useState, useCallback, useMemo } from "react";
import MediaSelectView from "./MediaSelectView";
import api from "../helper/api";
import showToast from "../helper/toast";
import { CreateObj } from "../interfaces";
import { Button } from "../components";
import Switch from "./Switch";

const NFTCreate = ({ createNFT }: any) => {
  const [state, setstate] = useState<CreateObj | any>({
    media: null,
    isUploading: false,
    caption: "",
    isSelling: false,
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
            setstate((prev: CreateObj) => ({ ...prev, isUploading: true }));
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
              // let url = `${process.env.MEDIA_BASE_URL}/${hash}?filename=${file.name}`;
              let url = `https://ipfs.io/ipfs/${hash}?filename=${file.name}`;

              createNFT &&
                createNFT(url, state.caption?.trim(), state.isSelling);
            } else {
              showToast.error("Upload failed");
            }

            // let text = hasUploaded ? "Uploaded successfully" : "Upload failed";
            // hasUploaded ? showToast.success(text) : showToast.error(text);

            setstate((prev: CreateObj | any) => ({
              ...prev,
              isUploading: false,
            }));
          }
        };
      }
    },
    [state.media, state.caption, state.isUploading, state.isSelling]
  );

  const MediaView = useMemo(
    () => (
      <MediaSelectView
        media={state?.media}
        remove={(e: any) => {
          e.target.value = null;
          setstate((prev: CreateObj) => ({ ...prev, media: null }));
        }}
        onMediaSelect={(e: any) => {
          let files = e.target.files;
          if (!files[0]) return;
          setstate((prev: CreateObj) => ({ ...prev, media: files[0] }));
        }}
      />
    ),
    [state.media]
  );

  return (
    <div className="nft-create">
      {MediaView}
      {/* <MediaSelectView
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
      /> */}
      <input
        className="w-100 py-2 px-3 text-color bg-theme rounded-3 no-focus border mt-3"
        placeholder="Add name"
        onChange={(e: any) => setstate({ ...state, caption: e.target.value })}
      />
      <div className="flex-center-h justify-content-between w-100 text-color my-3 fw-bold">
        Available for sale
        <Switch
          switchOnBgColor="#0d6efd"
          isOn={state.isSelling}
          switchOnThumbColor="#E0E0E0"
          onSwitch={() => {
            setstate((prev: any) => {
              return { ...prev, isSelling: !prev.isSelling };
            });
          }}
        />
      </div>
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
