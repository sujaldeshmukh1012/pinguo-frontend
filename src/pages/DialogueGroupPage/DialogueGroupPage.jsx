import React, { useEffect, useState } from "react";
import MainPageSkeleton from "../../../ReUsableComponents";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import LessonPageContent from "../../components/LessonPageContent/LessonPageContent";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";
import DialogueGroupContent from "../../components/DialogueGroupContent/DialogueGroupContent";
import dgroup from "../../assets/icons/svg/dialogueGroup.svg";

function DialogueGroupPage() {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [DialogueList, SetDialogueList] = useState([]);
  const [TestCardList, SetTestCardList] = useState([]);
  const [Title, SetTitle] = useState("");
  const { lessonId, dialogueGroupId } = useParams();

  const FetchDialogueList = async (token) => {
    setLoading(true);
    setError(false);
    var url = BASEURL + "dialogue-grp/" + dialogueGroupId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetDialogueList(response.data);
      setLoading(false);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };
  const FetchDialogueGrpTitle = async (dialogueGroupId, token) => {
    var url = BASEURL + "dialogue-group-details/" + dialogueGroupId;
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
      FetchDialogueList(data.accessToken);
      FetchDialogueGrpTitle(dialogueGroupId, data.accessToken);
    } else {
      window.location.href = "/login";
    }
  }, []);
  return (
    <MainPageSkeleton
      NavTitle={Title}
      UserId={UserId}
      FetchFunction={FetchDialogueList}
      AccessToken={AccessToken}
      Parent_Lesson={lessonId}
      NavIcon={dgroup}
      Parent_DialogueGroup={dialogueGroupId}
      allowedActions={["Dialogue"]}
    >
      <DialogueGroupContent
        List={DialogueList}
        error={Error}
        AccessToken={AccessToken}
        AfterSuccessFunction={FetchDialogueList}
        UserId={UserId}
        loading={Loading}
        Parent_Lesson={lessonId}
        Parent_DialogueGroup={dialogueGroupId}
      />
    </MainPageSkeleton>
  );
}

export default DialogueGroupPage;
