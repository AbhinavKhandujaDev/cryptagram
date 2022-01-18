import type { NextPage } from "next";
// import styles from "../styles/Home.module.css";
import { Spinner } from "../components";
// import Lottie from "react-lottie";
import { memo, useState, useEffect, useMemo, useCallback } from "react";
import Particles from "react-tsparticles";

const particles = require("../particles.json");

const FormInput = memo(
  ({ rightView, leftView, inpcls, ...inputProps }: any) => {
    return (
      <div className="input-group mb-3">
        {leftView && <span className="input-group-text">{leftView}</span>}
        <input {...inputProps} className={`form-control ${inpcls}`} />
        {rightView && <span className="input-group-text">{rightView}</span>}
      </div>
    );
  }
);

const LoginForm = ({ createAcc }: any) => {
  const [state, setState] = useState({
    showPswd: false,
  });
  return (
    <form className="w-100">
      <label className="h3 mb-3 fw-bold">Login</label>
      <FormInput
        leftView={<i className="bi bi-envelope fw-bold" />}
        type="email"
        name="email"
        required
        placeholder="abc@example.com"
      />
      <FormInput
        leftView="•••"
        rightView={
          <i
            className={`bi bi-eye${
              !state.showPswd ? "-slash" : ""
            } btn p-0 fw-bold`}
            onClick={() => setState({ ...state, showPswd: !state.showPswd })}
          />
        }
        type={state.showPswd ? "" : "password"}
        name="password"
        required
        placeholder="Password"
      />
      <div className="flex-center-h justify-content-between">
        <button className="bg-prime btn text-white fw-bold flex-center-h">
          <i className="bi bi-box-arrow-in-right fs-5 me-2 text-white" />
          Login
        </button>
        <label className="link btn" onClick={createAcc}>
          Don't have an account?
        </label>
      </div>
    </form>
  );
};
const SignUpForm = ({ login }: any) => {
  const [state, setState] = useState({
    showPswd: false,
  });
  return (
    <form className="w-100">
      <label className="h3 mb-3 fw-bold">Create Account</label>
      <FormInput
        leftView={<i className="bi bi-envelope fw-bold" />}
        type="email"
        name="email"
        required
        placeholder="abc@example.com"
      />
      <FormInput
        leftView="@"
        type="text"
        name="username"
        required
        placeholder="username"
      />
      {/* <FormInput
        leftView={<i className="bi bi-phone" />}
        type="telephone"
        name="mobile"
        required
        placeholder="mobile number"
      /> */}
      <FormInput
        leftView="•••"
        rightView={
          <i
            className={`bi bi-eye${
              !state.showPswd ? "-slash" : ""
            } btn p-0 fw-bold`}
            onClick={() => setState({ ...state, showPswd: !state.showPswd })}
          />
        }
        type={state.showPswd ? "" : "password"}
        name="password"
        required
        placeholder="Password"
      />
      <div className="flex-center-h justify-content-between">
        <button className="bg-prime btn text-white fw-bold flex-center-h">
          <i className="bi bi-box-arrow-in-right fs-5 me-2 text-white" />
          Create
        </button>
        <label className="link btn" onClick={login}>
          Already have an account?
        </label>
      </div>
    </form>
  );
};

const Home: NextPage = () => {
  const [state, setState] = useState({
    isLogin: true,
  });
  return (
    <div className="page flex-center-c">
      <Particles id="tsparticles" options={particles} />
      <div className="mt-3 col-12 col-md-6 col-lg-4 px-3">
        {state.isLogin ? (
          <LoginForm createAcc={() => setState({ ...state, isLogin: false })} />
        ) : (
          <SignUpForm login={() => setState({ ...state, isLogin: true })} />
        )}
      </div>
    </div>
  );
};

export default Home;
