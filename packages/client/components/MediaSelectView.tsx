import { memo } from "react";

const MediaSelectView = ({ onMediaSelect, media, remove }: any) => {
  return (
    <div>
      {!media && (
        <div
          className={`w-100 border fs-1 fw-bold flex-center-h ratio-eq rounded-3 overflow-hidden bg-theme`}
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
      )}
      {media && (
        <div>
          <img
            style={{ objectFit: "contain" }}
            className="ratio-eq w-100 rounded-3"
            src={URL.createObjectURL(media)}
          />
          <div className="d-flex mt-3">
            <button className="btn bg-danger col-5 text-white" onClick={remove}>
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
  );
};

export default memo(MediaSelectView);
