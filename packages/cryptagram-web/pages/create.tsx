import type { NextPage } from "next";
import { useState, memo, useEffect } from "react";
import { api } from "../helper";
import { Button } from "../components";

const MediaSelectView = memo(({ onMediaSelect, isMediaSelected }: any) => {
  return (
    <div
      className={`w-100 border fs-1 fw-bold flex-center-h ratio-eq rounded-3 overflow-hidden ${
        isMediaSelected ? "d-none" : ""
      }`}
    >
      <div className="position-absolute flex-center-c w-100 h-100">
        <div className="col-5">
          <img src="/images/upload.png" className="w-100 ratio-eq" />
        </div>
        <label className="fs-3 fs-bold text-center mt-5">
          Click or Drop file
        </label>
      </div>
      <input
        type="file"
        className="file-select-input w-100 h-100 ratio-eq opacity-0"
        accept="image/png, image/jpeg, image/jpg, video/mp4, video/quicktime"
        onChange={onMediaSelect}
      />
    </div>
  );
});

interface CreatePageProps {
  media?: any;
  caption?: string;
  isUploading?: boolean;
}

const Create: NextPage = () => {
  const [state, setstate] = useState<CreatePageProps>();

  const upload = (event: any) => {
    event.preventDefault();
    if (state?.isUploading) return;
    const file = state?.media;
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      if (reader.result) {
        let src = window.urlSource(URL.createObjectURL(state?.media));
        setstate({ ...state, isUploading: true });
        let fileData = await window.ipfs.add(src);
        let hash = fileData.cid.toV1().toString();

        api("/api/post/savePost", {
          body: {
            postUrl: hash,
            postType: state?.media.type,
            caption: state?.caption,
          },
        })
          .then(() => {
            setstate({ ...state, isUploading: false });
            alert("uploaded successfully");
          })
          .catch((error) => {
            console.log("upload error => ", error);
            setstate({ ...state, isUploading: false });
          });
      }
    };
  };

  // const upload = (buffer: Buffer) => {
  //   window.ipfs.add(buffer, (error: any, result: any) => {
  //     console.log("Ipfs result", result);
  //     if (error) {
  //       console.error(error);
  //       return;
  //     }
  //   });
  // };

  return (
    <div
      id="create-page"
      className="page flex-center-c justify-content-start p-3 py-5"
    >
      <div className="col-11 col-sm-8 col-lg-4 my-5">
        <div className="bg-theme p-3 rounded-3">
          <MediaSelectView
            isMediaSelected={state?.media ? true : false}
            // onMediaSelect={captureFile}
            onMediaSelect={(e: any) => {
              let files = e.target.files;
              if (!files[0]) return;
              setstate({ ...state, media: files[0] });
            }}
          />
          {state?.media && (
            <div>
              <img
                style={{ objectFit: "contain" }}
                className="ratio-eq w-100 rounded-3"
                src={URL.createObjectURL(state.media)}
              />
              <div className="d-flex mt-3">
                <button
                  className="btn bg-danger col-5 text-white"
                  onClick={() => setstate({ ...state, media: null })}
                >
                  Remove
                </button>
                <div className="col-2" />
                <button
                  className="btn col-5 bg-prime text-white"
                  onClick={() => {
                    let input: any =
                      document.getElementsByClassName("file-select-input")[0];
                    input.click();
                  }}
                >
                  Select new
                </button>
              </div>
            </div>
          )}
        </div>
        <textarea
          style={{ border: "none", outline: "none" }}
          className="w-100 p-3 text-color-theme bg-theme text-theme my-3 rounded-3"
          placeholder="Add caption..."
          onChange={(e: any) => setstate({ ...state, caption: e.target.value })}
        />
        <Button
          disabled={!state?.media && !state?.caption}
          className="col-12 btn bg-prime text-white fw-bold"
          onClick={upload}
          loading={state?.isUploading}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default memo(Create);
