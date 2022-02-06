import { memo, useEffect } from "react";

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
      // slider.style.background = "#90A4AE";
      const adjustSliderWidth = () => {
        slider.style.width = `${
          sv.getBoundingClientRect().width / opts.length
        }px`;
      };
      adjustSliderWidth();
      window.addEventListener("resize", adjustSliderWidth);
    }, []);

    return (
      <div
        style={{ height: height }}
        className={`segment-view rounded-pill shadow bg-theme ${cls}`}
      >
        <div
          style={{
            width: `calc(100%/${opts.length}) !important`,
            left: `calc(${selected} * 100%/${opts.length})`,
            transition: "left 0.3s ease-in-out",
          }}
          className="segment-slider h-100 position-absolute rounded-pill bg-prime"
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

export default SegmentView;
