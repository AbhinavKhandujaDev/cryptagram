import { memo } from "react";
import Spinner from "./Spinner";

const Button = (props: any) => {
  const { loading, spinnerProps, ...other } = props;
  return (
    <button disabled={loading} {...other}>
      {loading ? <Spinner {...spinnerProps} /> : props.children}
    </button>
  );
};

export default memo(Button);
