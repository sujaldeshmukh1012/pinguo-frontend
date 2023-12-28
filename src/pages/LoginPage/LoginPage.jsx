import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import MobileSizeDiv from "../../components/MobileSizeDiv/MobileSizeDiv";
import stx from "./LoginPage.module.css";
import { LoadingIndicator } from "../HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import Checkbox from "rc-checkbox";

function LoginPage() {
  return (
    <div className={stx.LoginPage}>
      <NavBar login />
      <MobileSizeDiv>
        <LoginContent />
      </MobileSizeDiv>
    </div>
  );
}

export default LoginPage;

const LoginContent = () => {
  const [loading, SetLoading] = useState(false);
  const [success, SetSuccess] = useState(false);
  const [ShowPass, SetShowPass] = useState(false);
  const [error, SetError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const HandelUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const HandelShowHidePass = (e) => {
    // e.preventDefault();
    SetShowPass(!ShowPass);
  };
  const HandelPasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const DoLogin = async (e) => {
    SetLoading(true);
    setUsername("");
    setPassword("");
    e.preventDefault();
    var url = BASEURL + "api/token/";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const isSuccessful = response.ok;
      if (isSuccessful) {
        const data = await response.json();
        var successSavingToken = await SaveToken(data);
        if (successSavingToken) {
          SetLoading(false);
          SetSuccess(true);
          window.location.href = "/";
        } else {
          SetError(true);
          SetLoading(false);
          SetSuccess(false);
        }
      } else {
        SetError(true);
        SetLoading(false);
        SetSuccess(false);
      }
    } catch (error) {
      console.log(error);
      SetError(true);
      SetLoading(false);
      SetSuccess(false);
    }
  };
  return (
    <div className={stx.LoginContent}>
      <h3 className={stx.LoginTitle}>
        {loading ? "Logining you in.. " : success ? "Redirecting..." : "LOGIN"}
      </h3>
      <form className={stx.LoginForm} onSubmit={(e) => DoLogin(e)}>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <span className={stx.LoginLegend}>Username</span>
            <input
              className={stx.LoginInput}
              onChange={(e) => HandelUsernameChange(e)}
              type="text"
              required={true}
              placeholder="Username"
              value={username}
            />
            <span className={stx.LoginLegend}>Password</span>
            <input
              className={stx.LoginInput}
              onChange={(e) => HandelPasswordChange(e)}
              type={ShowPass ? "text" : "password"}
              required={true}
              placeholder="Password"
              value={password}
            />
            <div className={stx.OtherOptionDiv}>
              <div className={stx.OtherOptionDivCheck}>
                {/* <input
                  type="checkbox"
                  name="checkbox"
                  // value={ShowPass}
                  onChange={(e) => HandelShowHidePass(e)}
                  className={stx.CheckboxShowPass}
                /> */}
                <Checkbox onChange={(e) => HandelShowHidePass(e)} />
                <p className={stx.otherText}>Show Password</p>
              </div>
              <p className={stx.otherTextSpecial}>Forgotten Password?</p>
            </div>
            <button className={stx.LoginButton} type="submit">
              LOG IN
            </button>
            {error && (
              <p className={stx.ErrorIndicator}>
                An error occured.Please Try Again
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
};

const SaveToken = async (data) => {
  var url = BASEURL + "get-user-id";
  var refreshToken = data["refresh"];
  var accessToken = data["access"];
  console.log(accessToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  const respData = await response.json();
  var UserId = respData["id"];
  var UserName = respData["username"];
  localStorage.setItem("userId", UserId);
  localStorage.setItem("userName", UserName);
  var acc_tok = localStorage.getItem("accessToken");
  if (acc_tok) {
    return true;
  } else {
    return false;
  }
};

// try gettng tokeb after setting it, if not nullthen show true else false
