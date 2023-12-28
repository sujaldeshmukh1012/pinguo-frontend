import React, { useEffect, useState } from "react";
import MainPageSkeleton from "../../../ReUsableComponents";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import LessonPageContent from "../../components/LessonPageContent/LessonPageContent";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";
import testCard from "../../assets/icons/test-card.png";
import TestContent from "../../components/TestContent/TestContent";
import { MainFetchFunction } from "../../components/AddModal/AddModal";
function TestPage() {
  const [Loading, setLoading] = useState(false);
  const [AnswersLoading, setAnswersLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [TestCardDetails, SetTestCardDetails] = useState([]);
  const [TestCardAnswers, SetTestCardAnswers] = useState([]);
  const [Title, SetTitle] = useState("");
  const { dialogueTestId } = useParams();

  const FetchTestCard = async (token) => {
    setLoading(true);
    setError(false);
    SetTestCardDetails([]);
    var url = BASEURL + "testcard-details/" + dialogueTestId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetTestCardDetails(response.data);
      console.log(response.data);
      SetTitle(response.data.dialogue.title);
      FetchTestCardAnswers(token, response.data.id);
      setLoading(false);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const FetchTestCardAnswers = async (token, id) => {
    setAnswersLoading(true);
    setError(false);
    var url = BASEURL + "testanswer-list/" + id;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetTestCardAnswers(response.data);
      setAnswersLoading(false);
      setError(false);
    } else {
      setError(true);
      setAnswersLoading(false);
    }
  };

  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetUserId(data.userId);
      SetAccessToken(data.accessToken);
      SetRefreshToken(data.refreshToken);
      FetchTestCard(data.accessToken);
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <MainPageSkeleton
      TestCardPage
      NavTitle={Title}
      TestCardId={dialogueTestId}
      UserId={UserId}
      FetchFunction={FetchTestCard}
      AccessToken={AccessToken}
      Parent_Lesson={0}
      NavIcon={testCard}
      Parent_DialogueGroup={0}
      Parent_Dialogue={0}
    >
      <TestContent
        loading={Loading}
        error={Error}
        AddTestAnswer={AddTestAnswer}
        AnswersLoading={AnswersLoading}
        TestCardId={dialogueTestId}
        UserId={UserId}
        FetchTestCardAnswers={FetchTestCardAnswers}
        data={TestCardDetails}
        AccessToken={AccessToken}
        TestCardAnswers={TestCardAnswers}
        AfterSuccessFunction={FetchTestCard}
      />
    </MainPageSkeleton>
  );
}

export default TestPage;

export const PutTestCardData = (url, body, AccessToken) => {
  fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      Authorization: "Bearer " + AccessToken,
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
    })
    .catch((e) => console.log(e));
};

export const AddTestAnswer = async (body, token) => {
  var url = BASEURL + "testanswer/";
  var method = "POST";
  var resp = await MainFetchFunction(token, url, method, body);
};
