import { memo } from "react";
import Spinner from "./Spinner";

const Button = (props: any) => {
  const { loading, ...other } = props;
  return (
    <button disabled={loading} {...other}>
      {loading ? <Spinner /> : props.children}
    </button>
  );
};

export default memo(Button);
