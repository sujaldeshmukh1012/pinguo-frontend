import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import HomeContent from "../../components/HomeContent/HomeContent";
import MobileSizeDiv from "../../components/MobileSizeDiv/MobileSizeDiv";
import BottomSelect from "../../components/BottomSelect/BottomSelect";
import stx from "./HomePage.module.css";
import { PuffLoader } from "react-spinners";
import { BASEURL } from "../../connections/BASEURL";
import {
  FetchCoursesOrLesson,
  PostOrPutData,
} from "../../connections/MainFetch";

function HomePage() {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [CourseList, SetCourseList] = useState([]);

  const FetchCourses = async (token) => {
    setLoading(true);
    setError(false);
    var url = BASEURL + "courses/";
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetCourseList(response.data);
      setLoading(false);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    var data = ExtractLocalDetails();
    console.log(data);
    if (data.status === true) {
      SetUserId(data.userId);
      SetAccessToken(data.accessToken);
      SetRefreshToken(data.refreshToken);
      FetchCourses(data.accessToken);
      console.log(data.accessToken);
    } else {
      window.location.href = "login";
    }
  }, []);

  return (
    <div className={stx.HomePage}>
      <NavBar home title={"COURSES"} icon={null} />
      <MobileSizeDiv>
        <HomeContent
          CourseList={CourseList}
          AccessToken={AccessToken}
          AfterSuccessFunction={FetchCourses}
          UserId={UserId}
          loading={Loading}
          error={Error}
        />
        <BottomSelect
          allowedActions={["Course"]}
          home
          AfterSuccessFunction={FetchCourses}
          ActionType={1}
          AccessToken={AccessToken}
          UserId={UserId}
        />
      </MobileSizeDiv>
    </div>
  );
}

export default HomePage;

export const LoadingIndicator = () => {
  return (
    <div className={stx.LoadingIndicator}>
      <PuffLoader
        color={"#000"}
        loading={true}
        className={stx.LoaderSpinner}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export const ErrorHandler = ({ Action }) => {
  const [refreshToken, SetRefreshToken] = useState(null);
  const GetRefreshToken = async () => {
    var token = localStorage.getItem("refreshToken");
    if (token !== null) {
      SetRefreshToken(token);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    GetRefreshToken();
  }, []);
  const FunctionAction = async () => {
    var body = JSON.stringify({ refresh: refreshToken });
    var method = "POST";
    var url = BASEURL + "api/token/refresh/";
    const resp = await PostOrPutData(body, url, null, method);
    if (resp.status) {
      SetTokenToStorage(resp.data.access);
      window.location.reload();
    }
    Action();
  };
  return (
    <div className={stx.ErrorHandler}>
      <h3 className={stx.ErrorHandlerH3}>Please Try Again</h3>
      <p className={stx.ErrorHandlerPara}>An Error Occured</p>
      <BlackButton
        className={stx.ErrorHandlerTryAgainBtn}
        FunctionAction={FunctionAction}
      >
        Try again
      </BlackButton>
    </div>
  );
};
export const BlackButton = ({ FunctionAction, children }) => {
  return (
    <button
      className={stx.ErrorHandlerTryAgainBtn}
      onClick={() => FunctionAction()}
    >
      {children}
    </button>
  );
};
export const ExtractLocalDetails = () => {
  var userId = localStorage.getItem("userId");
  var userName = localStorage.getItem("userName");
  var refreshToken = localStorage.getItem("refreshToken");
  var accessToken = localStorage.getItem("accessToken");
  var resp = {
    status: !!accessToken,
    userId: userId,
    userName: userName,
    refreshToken: refreshToken,
    accessToken: accessToken,
  };
  return resp;
};

export const SetTokenToStorage = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
  var accessToken = localStorage.getItem("accessToken");
  var resp = {
    status: !!accessToken,
    accessToken: accessToken,
  };
  return resp;
};

export const Logout = () => {
  localStorage.removeItem("accessToken");
  window.location.reload();
};
