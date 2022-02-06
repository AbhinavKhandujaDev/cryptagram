import { MouseEvent, memo } from "react";

interface SwitchProps {
  text?: string;
  isOn?: boolean;
  width?: number;
  height?: number;
  onSwitch?: (event: MouseEvent<HTMLDivElement>) => void;
}

const Switch = ({
  width = 53,
  height = 26,
  isOn = false,
  onSwitch,
}: SwitchProps) => {
  return (
    <div
      style={{ width, height, maxWidth: width, maxHeight: height }}
      className="Switch rounded-pill bg-theme border flex-center-h justify-content-start pointer no-select flex-grow-1 flex-shrink-0"
      onClick={onSwitch}
    >
      <div className="flex-center-h justify-content-between w-100 h-100 px-2">
        <span className={`${!isOn ? "opacity-0" : ""} text-white`}>☾</span>
        <span className={`${isOn ? "opacity-0" : ""}`}>☀️</span>
      </div>
      <span
        style={{
          right: isOn ? "0" : "calc(100% - 49%)",
          transition: "right 0.3s ease-in-out",
        }}
        className="switch-thumb h-75 position-absolute ratio-eq bg-theme-opp rounded-circle m-1"
      />
    </div>
  );
};

export default memo(Switch);
