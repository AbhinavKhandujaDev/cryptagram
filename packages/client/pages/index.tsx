import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import { useEffect, useCallback, memo, useState } from "react";
import { LoginForm, SignUpForm } from "../components";
import Particles from "react-tsparticles";
import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
  // setPersistence,
  // inMemoryPersistence,
  updateProfile,
  // User,
  // NextOrObserver,
  // onAuthStateChanged,
} from "firebase/auth";
import Router from "next/router";
import showToast from "../helper/toast";
import api, { saveTokenCookie } from "../helper/api";
import auth from "../helper/auth";

const particles = require("../particles.json");

// const fbauth = getAuth();
// setPersistence(fbauth, inMemoryPersistence);

const Home: NextPage = () => {
  const [state, setState] = useState({
    isLogin: true,
    formLoading: false,
    loadingState: true,
  });

  const fbauth = getAuth();

  // useEffect(() => {
  //   onAuthStateChanged(fbauth, (user: User | null) => {
  //     debugger;
  //     user && saveTokenCookie(user);
  //   });
  // }, []);

  // const saveTokenCookie = async (user: User) => {
  //   let idToken = await user.getIdToken();
  //   let refToken = user.refreshToken;
  //   await api.post("api/cookies/saveCookie", {
  //     body: { key: "idToken", value: idToken },
  //   });
  //   await api.post("api/cookies/saveCookie", {
  //     body: { key: "refreshToken", value: refToken },
  //   });
  // };

  const login = useCallback(async ({ email, password }: any) => {
    setState((prev) => ({ ...prev, formLoading: !prev.formLoading }));
    try {
      let user = await signIn(fbauth, email, password);
      await saveTokenCookie(user.user);
      let cUser = await api.get(
        `/api/user/getUser?username=${user.user.displayName}`
      );

      await api.post("api/cookies/saveCookie", {
        body: { key: "user", value: JSON.stringify(cUser.data) },
      });
      Router.push("/feeds");
    } catch (error: any) {
      console.log("Login error ", error.message);
      showToast.error(error.message);
      setState({ ...state, formLoading: false });
      api.delete("api/cookies/deleteAllCookies");
    }
  }, []);

  const createAccount = useCallback(
    async ({ email, password, username }: any) => {
      setState((prev) => ({ ...prev, formLoading: !prev.formLoading }));
      try {
        let user = await createUser(fbauth, email, password);
        await updateProfile(user.user, { displayName: username });

        await saveTokenCookie(user.user);
        api
          .post("api/user/create")
          .then(() => Router.push("/feeds"))
          .catch(() => {
            user.user.delete();
            setState({ ...state, formLoading: false });
            showToast.error("Unable to register account");
          });
      } catch (error: any) {
        console.log("SignUp error ", error.message);
        fbauth.currentUser?.delete();
        showToast.error(error.message);
        setState({ ...state, formLoading: false });
        api.delete("api/cookies/deleteAllCookies");
      }
    },
    []
  );

  const switchMode = useCallback(() => {
    if (state.formLoading) return;
    setState((prev) => ({ ...prev, isLogin: !prev.isLogin }));
  }, []);

  return (
    <div className="page flex-center-c">
      <Particles id="tsparticles" options={particles} />
      <label className="fs-1 fw-bold mb-5">Cryptagram</label>
      <div className="mt-3 col-12 col-md-6 col-lg-4 px-3">
        {state.isLogin ? (
          <LoginForm
            formLoading={state.formLoading}
            goToSignup={switchMode}
            login={login}
          />
        ) : (
          <SignUpForm
            formLoading={state.formLoading}
            goToLogin={switchMode}
            createAcc={createAccount}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = auth(async () => {
  return {
    props: {},
  };
});

export default memo(Home);
