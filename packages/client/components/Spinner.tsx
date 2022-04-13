import { memo } from "react";

const Spinner = (props: any) => {
  const { type = "border", size = "sm", color = "white", cls } = props;
  return (
    <span
      className={`spinner-${type} text-${color} spinner-${type}-${size} ${cls}`}
      role="status"
      aria-hidden="true"
    />
  );
};

export default memo(Spinner);
