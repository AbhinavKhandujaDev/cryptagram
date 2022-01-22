import { memo, useMemo, useEffect } from "react";

const LoaderView = (props: any) => {
  const { loading, id, cls } = props;
  useEffect(() => {
    let loadingCont = document.getElementById(id);
    if (!loadingCont) return;
    let loadingEle = Array.from(
      loadingCont.getElementsByClassName("loading-view")
    );
    loadingEle.forEach((e: Element) => {
      let list = e.classList;
      loading ? list.add("loading") : list.remove("loading");
    });
  }, [loading]);

  return (
    <div id={id} className={`loader-container ${cls}`}>
      {props.children}
    </div>
  );
};

export default memo(LoaderView);
