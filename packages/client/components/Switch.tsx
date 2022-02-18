import { MouseEvent, memo, useMemo } from "react";

interface SwitchProps {
  text?: string;
  isOn?: boolean;
  width?: number;
  height?: number;
  onSwitch?: (event: MouseEvent<HTMLDivElement>) => void;
  switchOnBgColor?: string;
  switchOffBgColor?: string;
  switchOnThumbColor?: string;
  switchOffThumbColor?: string;
  switchOnElement?: any;
  switchOffElement?: any;
}

const Switch = ({
  width = 53,
  height = 26,
  isOn = false,
  onSwitch,
  switchOnBgColor,
  switchOffBgColor,
  switchOnElement,
  switchOffElement,
  switchOnThumbColor,
  switchOffThumbColor,
}: SwitchProps) => {
  const thumbColor = useMemo(() => {
    if (isOn && switchOnThumbColor) {
      return switchOnThumbColor;
    } else if (!isOn && switchOffThumbColor) {
      return switchOffThumbColor;
    } else {
      return "bg-theme-opp";
    }
  }, [isOn]);
  return (
    <div
      style={{ width, height, maxWidth: width, maxHeight: height }}
      className="Switch rounded-pill bg-theme border flex-center-h justify-content-start pointer no-select flex-grow-1 flex-shrink-0 overflow-hidden"
      onClick={onSwitch}
    >
      {/* <div className="flex-center-h justify-content-between w-100 h-100 px-2">
        <span className={`${!isOn ? "opacity-0" : ""} text-white`}>☾</span>
        <span className={`${isOn ? "opacity-0" : ""}`}>☀️</span>
      </div> */}
      <div
        style={{
          backgroundColor: isOn ? switchOnBgColor : switchOffBgColor,
          transition: "background-color 0.3s ease-in-out",
        }}
        className="flex-center-h justify-content-between w-100 h-100 px-2"
      >
        <span className={`${!isOn ? "opacity-0" : ""} text-white`}>
          {switchOffElement}
        </span>
        <span className={`${isOn ? "opacity-0" : ""}`}>{switchOnElement}</span>
      </div>
      <span
        style={{
          right: isOn ? "0" : "calc(100% - 49%)",
          transition: "right 0.3s ease-in-out",
          background: thumbColor,
        }}
        className={`switch-thumb h-75 position-absolute ratio-eq ${thumbColor} rounded-circle m-1`}
      />
    </div>
  );
};

export default memo(Switch);
