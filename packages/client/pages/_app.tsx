import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/root.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, useCallback, memo } from "react";
import "../tsglobals";
import { PagesOptions, Navbar } from "../components";
import { create, urlSource } from "ipfs-http-client";
import "../helper/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps, router }: AppProps | any) {
  const [nightmode, setNghtmode] = useState(true);
  const pagesStatus = {
    feeds: router.asPath.includes("feeds") ? "-selected" : "",
    wallet: router.asPath.includes("wallet") ? "-selected" : "",
    create: router.asPath.includes("create") ? "-selected" : "",
    nft: "",
    profile: router.asPath.includes("profile") ? "-selected" : "",
  };
  const isLogin = router.pathname === "/";
  useEffect(() => {
    if (nightmode) {
      let body = document.getElementById("body");
      body?.classList.add("dark");
    }

    if (!window.ipfs) {
      const ipfs = create({
        host: "127.0.0.1",
        port: 5001,
        protocol: "http",
      });
      window.ipfs = ipfs;
      window.urlSource = urlSource;
    }
  }, []);
  const toggleNight = useCallback(() => {
    let body = document.getElementById("body");
    if (nightmode) {
      body?.classList.remove("dark");
    } else {
      body?.classList.add("dark");
    }
    setNghtmode((prev) => (prev = !prev));
  }, [nightmode]);
  return (
    <div>
      {!isLogin && (
        <Navbar
          nightmode={nightmode}
          switchTheme={toggleNight}
          status={pagesStatus}
        />
      )}
      <Component {...pageProps} nightmode={nightmode} />
      {!isLogin && (
        <footer
          style={{ top: "100%", transform: "translateY(-100%)" }}
          className="d-md-none position-fixed bg-theme w-100 py-2 border-top px-4"
        >
          <PagesOptions status={pagesStatus} showPost={true} />
        </footer>
      )}
      <ToastContainer theme={nightmode ? "dark" : "light"} />
    </div>
  );
}

export default memo(MyApp);