import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/root.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import "../tsglobals";
import { PagesOptions, Navbar, LoaderView, Spinner } from "../components";
import { create, urlSource } from "ipfs-http-client";
import "../helper/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../helper/api";
import store from "../redux/store";
import { Provider } from "react-redux";
import { abiAction } from "../redux/abis/actions";
import { ABI } from "../redux/types";

function MyApp({ Component, pageProps, router }: AppProps | any) {
  const [nightmode, setNghtmode] = useState(true);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [user, setuser] = useState<any>(null);
  const pagesStatus = useMemo(
    () => ({
      feeds: router.asPath.includes("feeds") ? "-selected" : "",
      wallet: router.asPath.includes("wallet") ? "-selected" : "",
      create: router.asPath.includes("create") ? "-selected" : "",
      nft: router.asPath.includes("nft") ? "-selected" : "",
      profile: router.asPath.includes("profile") ? "-selected" : "",
    }),
    [router.asPath]
  );
  const isLogin = router.pathname === "/";
  useEffect(() => {
    (async () => {
      let user = await api.get("/api/cookies/user");
      user.data && setuser(user.data);
    })();

    if (nightmode) {
      let body = document.getElementById("body");
      body?.classList.add("dark");
    }

    if (!window.ipfs) {
      const ipfs = create({
        host: "localhost",
        port: 5001,
        protocol: "http",
      });
      window.ipfs = ipfs;
      window.urlSource = urlSource;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      let storeState = store.getState();
      storeState.abi.transfer &&
        storeState.abi.nftStore &&
        storeState.abi.cryptNft &&
        setContractsLoaded(true);
    });
    if (contractsLoaded) {
      return unsubscribe;
    }
    (async () => {
      let abis = await api.post(process.env.CONTRACTS_ABI_URL || "", {
        body: [ABI.transfer, ABI.nftStore, ABI.cryptNft],
        headers: { "Content-Type": "application/json" },
      });
      store.dispatch(
        abiAction({
          transfer: abis.data[ABI.transfer],
          nftStore: abis.data[ABI.nftStore],
          cryptNft: abis.data[ABI.cryptNft],
        })
      );
    })();
  }, [contractsLoaded]);

  const toggleNight = useCallback(() => {
    let body = document.getElementById("body");
    if (nightmode) {
      body?.classList.remove("dark");
    } else {
      body?.classList.add("dark");
    }
    setNghtmode((prev) => (prev = !prev));
  }, [nightmode]);

  if (!contractsLoaded) {
    return (
      <div className="page flex-center-h">
        <Spinner size="md" cls="position-absolute"></Spinner>
        <Spinner size="sm" type="grow" cls="position-absolute"></Spinner>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <div>
        {!isLogin && (
          <Navbar
            nightmode={nightmode}
            switchTheme={toggleNight}
            status={pagesStatus}
            user={user}
            isNFT={router.pathname.includes("nft")}
          />
        )}
        <Component {...pageProps} nightmode={nightmode} user={user} />
        {!isLogin && (
          <footer
            style={{ top: "100%", transform: "translateY(-100%)" }}
            className="d-md-none position-fixed bg-theme w-100 py-2 border-top px-4"
          >
            <PagesOptions status={pagesStatus} showPost={true} user={user} />
          </footer>
        )}
        <ToastContainer theme={nightmode ? "dark" : "light"} />
      </div>
    </Provider>
  );
}

export default memo(MyApp);
