import React, { useEffect, useState } from "react";
import MainPageSkeleton from "../../../ReUsableComponents";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import LessonPageContent from "../../components/LessonPageContent/LessonPageContent";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";
import lesson from "../../assets/icons/svg/lesson.svg";
function LessonPage() {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [WordCardsList, SetWordCardsList] = useState([]);
  const [DialogueGropuList, SetDialogueGropuList] = useState([]);
  const [NoteList, SetNoteList] = useState([]);
  const [Popups, SetPopups] = useState([]);
  const [Labels, SetLabels] = useState([]);
  const [Title, SetTitle] = useState("");
  const { lessonId } = useParams();

  const FetchLessonContent = async (token) => {
    setLoading(true);
    setError(false);
    var url = BASEURL + "lessons-content/" + lessonId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetDialogueGropuList(response.data);
      setLoading(false);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const FetchLessonTitle = async (lessonId, token) => {
    var url = BASEURL + "lessons-details/" + lessonId;
    const resp = await fetch(url, {
      headers: { Authorization: "Bearer " + token },
      // referrerPolicy: "unsafe-url",
    });
    const isSuccess = resp.ok;
    const RespData = await resp.json();
    if (isSuccess) {
      var data = {
        status: true,
        title: RespData["title"],
        id: RespData.id,
      };
      SetTitle(data.title);
      return data;
    } else {
      SetTitle("Lesson");
    }
  };
  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetUserId(data.userId);
      SetAccessToken(data.accessToken);
      SetRefreshToken(data.refreshToken);
      FetchLessonContent(data.accessToken);
      FetchLessonTitle(lessonId, data.accessToken);
    } else {
      window.location.href = "/login";
    }
  }, []);
  return (
    <MainPageSkeleton
      NavTitle={Title}
      UserId={UserId}
      FetchFunction={FetchLessonContent}
      allowedActions={[
        "Word Card",
        "Dialogue group",
        "Pop Up",
        "Label",
        "Note",
      ]}
      // FetchFunction={FetchLessonContent}
      AccessToken={AccessToken}
      Parent_Lesson={lessonId}
      NavIcon={lesson}
    >
      <LessonPageContent
        List={DialogueGropuList}
        NoteList={NoteList}
        Popups={Popups}
        Labels={Labels}
        WordCardList={WordCardsList}
        error={Error}
        AccessToken={AccessToken}
        // AfterSuccessFunction={FetchLessonContent}
        AfterSuccessFunction={FetchLessonContent}
        UserId={UserId}
        loading={Loading}
        Parent_Lesson={lessonId}
      />
    </MainPageSkeleton>
  );
}

export default LessonPage;
