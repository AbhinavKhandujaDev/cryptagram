import type { NextPage } from "next";
import { useEffect, memo, useState } from "react";
import { Button } from "../components";

var colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];

const NFTPost = memo(({ cls }: any) => {
  return (
    <div
      className={`col-12 col-sm-6 col-md-4 col-lg-3 ratio-eq flex-center-h p-2 ${cls}`}
    >
      {/* <div className="post card bg-theme overflow-hidden w-100">
        <div className="card-body bg-theme p-0 border">
          <img className="w-100 h-100" src="https://i.pravatar.cc" />
        </div>
        <div className="card-footer border-top-0 flex-center-h justify-content-between p-0">
          <Button className="btn rounded-0 no-focus bg-prime fw-bold text-white flex-grow-1">
            Buy (1 Eth)
          </Button>
        </div>
      </div> */}
      <div className="flex-center-h rounded-3 overflow-hidden">
        <img className="w-100 h-100" src="https://i.pravatar.cc?img=2" />
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(34,90,200,0) 0%, rgba(0,0,0,0.6) 100%)",
          }}
          className="w-100 h-100 position-absolute d-flex align-items-end justify-content-center"
        >
          <div className="d-flex justify-content-between align-items-end w-100 px-4 py-3">
            <div className="text-white fw-bold me-2">Bored Ape Yatch Club</div>
            <Button
              style={{ fontSize: "13px" }}
              spinnerProps={{ color: "dark" }}
              className="btn rounded-pill bg-white fw-bold text-dark flex-shrink-0 flex-center-h"
            >
              <img
                // className="me-1"
                src="https://img.icons8.com/fluency/18/000000/ethereum.png"
              />
              1 ETH
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

const SegmentView = memo(
  ({
    cls,
    selected,
    onSelect,
    height = 35,
    opts = ["Button 1", "Button 2", "Button 3"],
  }: any) => {
    useEffect(() => {
      let sv: any = document.getElementsByClassName("segment-view")[0];
      let slider: any = sv.getElementsByClassName("segment-slider")[0];
      slider.style.background = "#90A4AE";
      // slider.style.background = "black";
      sv.onresize = () => {
        slider.style.width = `${
          sv.getBoundingClientRect().width / opts.length
        }px`;
      };
      // sv.addEventListener("resize", );
    }, []);

    return (
      <div
        style={{ height: height }}
        className={`segment-view rounded-pill border bg-theme ${cls}`}
      >
        <div
          style={{
            width: `calc(100%/${opts.length}) !important`,
            left: `calc(${selected} * 100%/${opts.length})`,
            transition: "left 0.3s ease-in-out",
          }}
          className="segment-slider bg-prime h-100 position-absolute rounded-pill"
        />
        <div className="segment-btn-group flex-center-h h-100">
          {opts.map((opt: string, i: number) => (
            <div
              key={i}
              style={{ flexBasis: 0, transition: "color 0.3s ease-in-out" }}
              className={`flex-center-h flex-grow-1 pointer h-100 ${
                selected === i ? "text-white" : "text-color"
              }`}
              onClick={() => onSelect(i)}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const Nft: NextPage = () => {
  const [state, setState] = useState({
    selected: 0,
  });
  return (
    <div id="nft" className="page py-5 flex-center-c justify-content-start">
      <SegmentView
        cls="mt-3 col-10 col-sm-6 col-md-4 col-lg-3"
        selected={state.selected}
        opts={["Market", "Collected", "Create"]}
        onSelect={(index: number) => setState({ ...state, selected: index })}
      />
      <div style={{ maxWidth: "1400px" }} className="row w-100 my-3">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <NFTPost key={i} />
          ))}
      </div>
    </div>
  );
};

export default Nft;
