import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage/HomePage";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  redirect,
} from "react-router-dom";
import CoursePage from "./pages/CoursePage/CoursePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { useLocation } from "react-router-dom";
import LessonPage from "./pages/LessonPage/LessonPage";
import WordCardPage from "./pages/WordCardPage/WordCardPage";
import AudioUploadPage from "./pages/AudioUploadPage/AudioUploadPage";

function App() {
  const [count, setCount] = useState(0);
  const [token, SetToken] = useState(null);

  const DetectIsLoggedIn = () => {
    try {
      var accessToken = localStorage.getItem("accessToken");
      var refreshToken = localStorage.getItem("refreshToken");
      if (accessToken == null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const RedirectToLoginPage = (currentLocation) => {
    if (currentLocation !== "/login") {
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    const IsAuth = DetectIsLoggedIn();
    var location = window.location.pathname;
    if (!IsAuth) {
      RedirectToLoginPage(location);
      console.log(location);
    }
    return () => {
      console.log("CleanUp");
    };
  }, []);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
const router = createBrowserRouter([
  {
    path: "login",
    element: (
      <>
        <LoginPage />
      </>
    ),
  },
  {
    path: "/",
    element: (
      <>
        <HomePage />
      </>
    ),
  },
  {
    path: "course/:courseId",
    element: (
      <>
        <CoursePage />
      </>
    ),
  },
  {
    path: "course/:courseId/lesson/:lessonId",
    element: (
      <>
        <LessonPage />
      </>
    ),
  },
  {
    path: "course/:courseId/lesson/:lessonId/word-card/:wordCardId",
    element: (
      <>
        <WordCardPage />
      </>
    ),
  },

  {
    path: "audioUplaod",
    element: (
      <>
        <AudioUploadPage />
      </>
    ),
  },
]);
