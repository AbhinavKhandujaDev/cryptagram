import { useEffect, useRef } from "react";

export default function useUpdateEffect(
  callback: () => any,
  dependencies: Array<any>
) {
  const ref = useRef(true);
  useEffect(() => {
    ref && (ref.current = false);
    return callback();
  }, dependencies);
}
