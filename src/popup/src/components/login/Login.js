import React, { useRef, useState } from "react";
import { apiUrl, callBackground } from "../../helpers";
import "./login.css";

export default ({ loading, setLoading, setProfile }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loginRef, passwordRef] = [useRef(), useRef()];

  const submit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!login.trim()) {
      loginRef.current.focus();
      return;
    }
    if (!password.trim()) {
      passwordRef.current.focus();
      return;
    }
    setErrors([]);
    setLoading(true);

    callBackground({
      getRequestJson: [
        apiUrl("/oauth/token"),
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "password",
            username: login,
            password,
          }).toString(),
        },
      ],
    }).then((res) => {
      console.log(res);
      if (!res || res.error || !res.access_token) {
        setErrors(["Invalid credentials, please try again"]);
        setLoading(false);
      } else {
        chrome.storage.local.set({ token: res }, () => {
          setProfile(res);
          setLoading(false);
        });
      }
    });
  };

  return (
    <form method="post" action="#" onSubmit={submit} className="login">
      <h2 className="login__title">Please Login</h2>
      {errors.length > 0 && (
        <div className="login__error bg-red-lightest border-l-4 border-red-light p-4 pt-3 text-sm">
          {errors.map((err, i) => (
            <p className="mt-1" key={i}>
              {err}
            </p>
          ))}
        </div>
      )}

      <input
        type="text"
        name="login"
        className="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight mt-2 px-3 py-2 rounded text-grey-darker w-full"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        ref={loginRef}
        disabled={loading}
        placeholder="Enter @username or email"
      />

      <input
        type="password"
        name="password"
        className="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ref={passwordRef}
        disabled={loading}
        placeholder="Enter password"
      />
      <div className="login__redirect">
        <a
          href="https://saverd-qa321.herokuapp.com/users/password/new"
          target="_blank"
        >
          Forgot password
        </a>
        {` `}or{` `}
        <a
          href="https://saverd-qa321.herokuapp.com/users/sign_up"
          target="_blank"
        >
          Sign Up
        </a>
      </div>
      <input
        type="submit"
        value="Login"
        className="login__button cursor-pointer bg-blue focus:outline-none focus:shadow-outline hover:bg-blue-dark px-4 py-2 rounded text-white"
      />
    </form>
  );
};
