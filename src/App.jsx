import { useState, useEffect } from "react";
import HomePage, { ExtractLocalDetails } from "./pages/HomePage/HomePage";
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
import DialogueGroupPage from "./pages/DialogueGroupPage/DialogueGroupPage";
import DialoguePage from "./pages/DialoguePage/DialoguePage";
import TestPage from "./pages/TestPage/TestPage";
import HanziWordPage from "./pages/HanziWordPage/HanziWordPage";

function App() {
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
    path: "hanzi/:hanziWord",
    element: (
      <>
        <HanziWordPage />
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
    path: "course/:courseId/lesson/:lessonId/dialogue-group/:dialogueGroupId",
    element: (
      <>
        <DialogueGroupPage />
      </>
    ),
  },
  {
    path: "course/:courseId/lesson/:lessonId/dialogue-group/:dialogueGroupId/dialogue/:dialogueId",
    element: (
      <>
        <DialoguePage />
      </>
    ),
  },
  {
    path: "course/:courseId/lesson/:lessonId/dialogue-group/:dialogueGroupId/dialogue-test/:dialogueTestId",
    element: (
      <>
        <TestPage />
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
