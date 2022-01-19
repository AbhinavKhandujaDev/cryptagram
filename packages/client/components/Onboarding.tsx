import { useMemo, useCallback, memo, useState, ChangeEvent } from "react";
import Button from "./Button";

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

export const LoginForm = memo(({ goToSignup, login, formLoading }: any) => {
  const [state, setState] = useState({
    showPswd: false,
    email: "",
    password: "",
  });
  const setvalues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
  const emaillw = useMemo(() => <i className="bi bi-envelope fw-bold" />, []);
  const pswdrw = useMemo(
    () => (
      <i
        className={`bi bi-eye${
          !state.showPswd ? "-slash" : ""
        } btn p-0 fw-bold`}
        onClick={() =>
          setState((prev) => ({ ...prev, showPswd: !prev.showPswd }))
        }
      />
    ),
    [state.showPswd]
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login({
          email: state.email,
          password: state.password,
        });
      }}
      className="w-100"
    >
      <label className="h3 mb-3 fw-bold">Login</label>
      <FormInput
        leftView={emaillw}
        type="email"
        name="email"
        required
        placeholder="abc@example.com"
        onChange={setvalues}
      />
      <FormInput
        leftView="•••"
        rightView={pswdrw}
        type={state.showPswd ? "" : "password"}
        name="password"
        required
        placeholder="Password"
        onChange={setvalues}
        minLength={6}
      />
      <div className="flex-center-h justify-content-between">
        <Button
          loading={formLoading}
          className="bg-prime btn text-white fw-bold flex-center-h"
        >
          Login
        </Button>
        <label className="link btn" onClick={goToSignup}>
          Don't have an account?
        </label>
      </div>
    </form>
  );
});

export const SignUpForm = ({ goToLogin, createAcc, formLoading }: any) => {
  const [state, setState] = useState({
    showPswd: false,
    email: "",
    username: "",
    password: "",
  });
  const setvalues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
  const emaillw = useMemo(() => <i className="bi bi-envelope fw-bold" />, []);
  const pswdrw = useMemo(
    () => (
      <i
        className={`bi bi-eye${
          !state.showPswd ? "-slash" : ""
        } btn p-0 fw-bold`}
        onClick={() =>
          setState((prev) => ({ ...prev, showPswd: !prev.showPswd }))
        }
      />
    ),
    [state.showPswd]
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createAcc({
          email: state.email,
          username: state.username,
          password: state.password,
        });
      }}
      className="w-100"
    >
      <label className="h3 mb-3 fw-bold">Create Account</label>
      <FormInput
        leftView={emaillw} //{<i className="bi bi-envelope fw-bold" />}
        type="email"
        name="email"
        required
        placeholder="abc@example.com"
        onChange={setvalues}
      />
      <FormInput
        leftView="@"
        type="text"
        name="username"
        required
        placeholder="username"
        onChange={setvalues}
      />
      <FormInput
        leftView="•••"
        rightView={pswdrw}
        type={state.showPswd ? "" : "password"}
        name="password"
        required
        placeholder="Password"
        onChange={setvalues}
        minLength={6}
      />
      <div className="flex-center-h justify-content-between">
        <Button
          loading={formLoading}
          className="bg-prime btn text-white fw-bold flex-center-h"
        >
          Create
        </Button>
        <label className="link btn" onClick={goToLogin}>
          Already have an account?
        </label>
      </div>
    </form>
  );
};
