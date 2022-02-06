import type { NextPage, GetServerSideProps } from "next";
import { useState, memo, useEffect, useCallback } from "react";
import auth from "../helper/auth";
import api from "../helper/api";
import { Button, MediaSelectView } from "../components";
import showToast from "../helper/toast";
import { CreateObj } from "../interfaces";

const Create: NextPage = () => {
  const [state, setstate] = useState<CreateObj>({
    media: null,
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
            let body = {
              // postUrl: `https://ipfs.infura.io/ipfs/${hash}`,
              postUrl: `https://ipfs.io/ipfs/${hash}`,
              postType: file.type,
              caption: state?.caption,
            };
            api
              .post("/api/post/createPost", { body })
              .then(() => {
                setstate((prev) => ({ ...prev, isUploading: false }));
                showToast.success("Uploaded successfully");
              })
              .catch((error) => {
                showToast.error("Upload failed");
                setstate((prev) => ({ ...prev, isUploading: false }));
              });
          }
        };
      }
    },
    [state]
  );

  return (
    <div
      id="create-page"
      className="page flex-center-c justify-content-start p-3 py-5"
    >
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 my-5">
        <div className="bg-theme p-3 rounded-3">
          <MediaSelectView
            media={state?.media}
            remove={(e: any) => {
              e.target.files = [];
              setstate({ ...state, media: null });
            }}
            onMediaSelect={(e: any) => {
              let files = e.target.files;
              if (!files[0]) return;
              setstate({ ...state, media: files[0] });
            }}
          />
          {/* {state?.media && (
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
          )} */}
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

export const getServerSideProps: GetServerSideProps = auth(async () => {
  return {
    props: {},
  };
});

export default memo(Create);
