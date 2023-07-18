import React, { useEffect, useState } from "react";
import MainPageSkeleton from "../../../ReUsableComponents";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import LessonPageContent from "../../components/LessonPageContent/LessonPageContent";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";

function LessonPage() {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [WordCardsList, SetWordCardsList] = useState([]);
  const [Title, SetTitle] = useState("");
  const { lessonId } = useParams();

  const FetchWordCards = async (token) => {
    setLoading(true);
    setError(false);
    var url = BASEURL + "wordcard/" + lessonId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetWordCardsList(response.data);
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
      console.log(data);
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
      FetchWordCards(data.accessToken);
      FetchLessonTitle(lessonId, data.accessToken);
    } else {
      window.location.href = "login";
    }
  }, []);
  return (
    <MainPageSkeleton
      NavTitle={Title}
      UserId={UserId}
      FetchFunction={FetchWordCards}
      AccessToken={AccessToken}
      Parent_Lesson={lessonId}
    >
      <LessonPageContent
        WordCardsList={WordCardsList}
        error={Error}
        AccessToken={AccessToken}
        AfterSuccessFunction={FetchWordCards}
        UserId={UserId}
        loading={Loading}
        Parent_Lesson={lessonId}
      />
    </MainPageSkeleton>
  );
}

export default LessonPage;
