import { memo, useEffect } from "react";

const underlineHeight = 10;

const SegmentView = memo(
  ({
    cls,
    selected,
    onSelect,
    height = 35,
    opts = ["Button 1", "Button 2", "Button 3"],
    sliderType = "cover", //underline, cover
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
        className={`segment-view rounded-pill bg-theme ${cls}`}
      >
        <div
          style={{
            height: sliderType === "cover" ? "100%" : `${underlineHeight}%`,
            top: sliderType === "cover" ? "0" : `${100 - underlineHeight}%`,
            width: `calc(100%/${opts.length}) !important`,
            left: `calc(${selected} * 100%/${opts.length})`,
            transition: "left 0.3s ease-in-out",
          }}
          className="segment-slider position-absolute rounded-pill bg-prime"
        />
        <div className="segment-btn-group flex-center-h h-100">
          {opts.map((opt: string, i: number) => (
            <div
              key={i}
              style={{ flexBasis: 0, transition: "color 0.3s ease-in-out" }}
              className={`flex-center-h flex-grow-1 pointer h-auto ${
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
