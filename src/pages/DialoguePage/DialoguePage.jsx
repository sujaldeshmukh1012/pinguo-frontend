import React, { useEffect, useState } from "react";
import MainPageSkeleton from "../../../ReUsableComponents";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import LessonPageContent from "../../components/LessonPageContent/LessonPageContent";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";
import { DialogueData } from "../../data/DialogueData";
import DialogueGroupContent from "../../components/DialogueGroupContent/DialogueGroupContent";
import dialogueImg from "../../assets/icons/svg/dialogue.svg";
import DialogueContent from "../../components/DialogueContent/DialogueContent";
import { SingleDialogData } from "../../data/DialogData";

function DialoguePage() {
  const [Loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [DialogueData, SetDialogueData] = useState([]);
  const [Title, SetTitle] = useState("");
  const { lessonId, dialogueGroupId, dialogueId } = useParams();

  const FetchDialogueData = async (token) => {
    setLoading(true);
    seterror(false);
    var url = BASEURL + "dialogue-details/" + dialogueId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetDialogueData(response.data);
      console.log(response.data);
      SetTitle(response.data.title);
      setLoading(false);
      seterror(false);
    } else {
      seterror(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetUserId(data.userId);
      SetAccessToken(data.accessToken);
      SetRefreshToken(data.refreshToken);
      FetchDialogueData(data.accessToken);
    } else {
      window.location.href = "/login";
    }
  }, []);
  return (
    <MainPageSkeleton
      allowedActions={["Ballon", "Image"]}
      NavTitle={Title}
      UserId={UserId}
      FetchFunction={FetchDialogueData}
      AccessToken={AccessToken}
      Parent_Lesson={lessonId}
      NavIcon={dialogueImg}
      Parent_DialogueGroup={dialogueGroupId}
      Parent_Dialogue={dialogueId}
      Parent_Dialogue_data={DialogueData}
    >
      <DialogueContent
        data={DialogueData}
        error={error}
        AccessToken={AccessToken}
        AfterSuccessFunction={FetchDialogueData}
        UserId={UserId}
        loading={Loading}
        Parent_Lesson={lessonId}
        Parent_DialogueGroup={dialogueGroupId}
        Parent_Dialogue={dialogueId}
        Parent_Dialogue_data={DialogueData}
      />
    </MainPageSkeleton>
  );
}

export default DialoguePage;
