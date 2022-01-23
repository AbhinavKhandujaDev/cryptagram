import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/root.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import "../tsglobals";
import { PagesOptions, Navbar } from "../components";
import { create, urlSource } from "ipfs-http-client";
import "../helper/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import api, { saveTokenCookie } from "../helper/api";

const auth = getAuth();

function MyApp({ Component, pageProps, router }: AppProps | any) {
  const [nightmode, setNghtmode] = useState(true);
  const [user, setuser] = useState<any>(null);
  const pagesStatus = useMemo(
    () => ({
      feeds: router.asPath.includes("feeds") ? "-selected" : "",
      wallet: router.asPath.includes("wallet") ? "-selected" : "",
      create: router.asPath.includes("create") ? "-selected" : "",
      nft: "",
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
        host: "127.0.0.1",
        port: 5001,
        protocol: "http",
      });
      window.ipfs = ipfs;
      window.urlSource = urlSource;
    }

    onAuthStateChanged(auth, async (user: User | null) => {
      let idToken = await user?.getIdToken();
      if (user && idToken) {
        let token = await api.get(`/api/cookies/matchIdToken?token=${idToken}`);
        !token.success && saveTokenCookie(user);
        !token.success &&
          setuser({
            ...user,
            username: user.displayName,
            email: user.email,
          });
      }
    });
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
          user={user}
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
  );
}

export default memo(MyApp);
