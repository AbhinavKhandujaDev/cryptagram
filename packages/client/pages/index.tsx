import type { NextPage } from "next";
import { useCallback, memo, useState } from "react";
import { LoginForm, SignUpForm } from "../components";
import Particles from "react-tsparticles";
import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
  setPersistence,
  inMemoryPersistence,
  updateProfile,
  User,
} from "firebase/auth";
import Router from "next/router";
import { api } from "../helper";
import showToast from "../helper/toast";

const particles = require("../particles.json");

const auth = getAuth();
setPersistence(auth, inMemoryPersistence);

const Home: NextPage = () => {
  const [state, setState] = useState({
    isLogin: true,
    formLoading: false,
    loadingState: true,
  });

  const saveCookies = async (user: User) => {
    let idToken = await user.getIdToken();
    let refToken = user.refreshToken;
    await api("api/saveCookie", {
      body: { key: "idToken", value: idToken },
    });
    await api("api/saveCookie", {
      body: { key: "refreshToken", value: refToken },
    });
  };

  const login = useCallback(async ({ email, password }: any) => {
    setState((prev) => ({ ...prev, formLoading: !prev.formLoading }));
    try {
      let user = await signIn(auth, email, password);
      await saveCookies(user.user);
      Router.push("/feeds");
    } catch (error: any) {
      console.log("SignUp error ", error.message);
      auth.currentUser?.delete();
    }
  }, []);

  const createAccount = useCallback(
    async ({ email, password, username }: any) => {
      setState((prev) => ({ ...prev, formLoading: !prev.formLoading }));
      try {
        let user = await createUser(auth, email, password);

        saveCookies(user.user);
        await updateProfile(user.user, { displayName: username });
        api("api/user/create")
          .then(() => Router.push("/feeds"))
          .catch(() => {
            user.user.delete();
            setState({ ...state, formLoading: false });
            showToast("Unable to register account", { type: "error" });
          });
      } catch (error: any) {
        console.log("SignUp error ", error.message);
        auth.currentUser?.delete();
        showToast(error.message, { type: "error" });
        setState({ ...state, formLoading: false });
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

export default memo(Home);
