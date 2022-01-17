import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/root.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, useCallback, memo } from "react";
import "../tsglobals";
import { Navbar, BottomNav } from "../components";
import { create, urlSource } from "ipfs-http-client";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [nightmode, setNghtmode] = useState(true);
  const pagesStatus = {
    feeds: router.asPath.includes("feeds") ? "-selected" : "",
    wallet: router.asPath.includes("wallet") ? "-selected" : "",
    create: router.asPath.includes("create") ? "-selected" : "",
    nft: "",
    profile: router.asPath.includes("profile") ? "-selected" : "",
  };
  useEffect(() => {
    let body = document.getElementById("body");
    body?.classList.add("dark");

    if (!window.ipfs) {
      // https://ipfs.infura.io:5001/api/v0/
      // const ipfs = create({
      //   host: "ipfs.infura.io",
      //   port: 5001,
      //   protocol: "https",
      // });
      // const ipfs = create({
      //   host: "localhost",
      //   port: 8080,
      //   protocol: "http",
      // });
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
      <Navbar
        nightmode={nightmode}
        switchTheme={toggleNight}
        status={pagesStatus}
      />
      <Component {...pageProps} nightmode={nightmode} />
      <footer
        style={{ top: "100%", transform: "translateY(-100%)" }}
        className="d-md-none position-fixed bg-theme w-100 py-2 border-top"
      >
        <BottomNav
          className="flex-center-h justify-content-between px-4"
          status={pagesStatus}
        />
      </footer>
    </div>
  );
}

export default memo(MyApp);
