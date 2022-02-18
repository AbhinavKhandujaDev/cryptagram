import { memo, useMemo } from "react";
import Spinner from "./Spinner";

const Button = (props: any) => {
  const { loading, spinnerProps, onClick, ...other } = props;
  return (
    <button
      disabled={loading}
      onClick={(e) => {
        !loading && onClick && onClick(e);
      }}
      {...other}
    >
      {loading ? <Spinner {...spinnerProps} /> : props.children}
    </button>
  );
};

export default memo(Button);
