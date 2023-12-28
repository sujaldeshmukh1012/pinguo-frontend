import React, { useState, useEffect } from "react";
import stx from "./AddModal.module.css";
import { motion } from "framer-motion";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASEURL } from "../../connections/BASEURL";
import uploadIcon from "../../assets/uplaod.png";
import menuIcon from "../../assets/menu.png";
import voiceIcon from "../../assets/icons/voice.png";
import FemaleIcon from "../../assets/icons/femaleAvatar.png";
import MaleIcon from "../../assets/icons/maleAvatar.png";
import axios from "axios";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import { AddTestAnswer } from "../../pages/TestPage/TestPage";
import { ToastContainer, toast } from "react-toastify";

function AddModal({
  toggle,
  AfterSuccessFunction,
  title,
  prevVal,
  data,
  type,
  AccessToken,
  UserId,
  Parent_Course,
  Parent_Lesson,
  Parent_DialogueGroup,
  Parent_Dialogue,
  item_id,
  TestCardId,
  Parent_Dialogue_data,
}) {
  // types
  //      0 : Add Course
  //      1 : Update Course
  //      2 : Add Lesson
  //      3 : Update Lesson
  //      4:  Add Word Card
  //      5 : Update Word Card
  //      6 : Add Dialogue Group
  //      7 : Update Dialogue Group
  //      8 : Add Dialogue
  //      9 : Update Dialogue
  //      10 : Add Image
  //      11 : Edit Image
  //      12 : Add Balloon
  //      20 : Update Balloon
  //      data : contains data of object that is to be updated

  const [inpVal, SetinpVal] = useState(prevVal || "");
  const [SubmitDisabled, SetSubmitDisabled] = useState(true);
  const [ImageUploadCard, SetImageUploadCard] = useState(false);
  const [BaloonVoiceCard, SetBaloonVoiceCard] = useState(false);
  const [NoteAddCard, SetNoteAddCard] = useState(false);
  const [PopupAddCard, SetPopupAddCard] = useState(false);
  const [BalloonUpdate, SetBalloonUpdate] = useState(false);
  const [LabelAddCard, SetLabelAddCard] = useState(false);
  const [ShowToast, SetShowToast] = useState(false);
  const [ToastInfo, SetToastInfo] = useState("");
  const [ToastType, SetToastType] = useState(null);
  const CLoseToast = () => {
    SetShowToast(false);
    SetToastInfo("");
    SetToastType(null);
  };
  useEffect(() => {
    if (type === 10) {
      SetImageUploadCard(true);
    } else {
      SetImageUploadCard(false);
    }

    if (type === 12) {
      SetBaloonVoiceCard(true);
    } else {
      SetBaloonVoiceCard(false);
    }
    if (type === 13) {
      SetNoteAddCard(true);
    } else {
      SetNoteAddCard(false);
    }
    if (type === 14) {
      SetPopupAddCard(true);
    } else {
      SetPopupAddCard(false);
    }

    if (type === 15) {
      SetLabelAddCard(true);
    } else {
      SetLabelAddCard(false);
    }
    if (type === 20) {
      SetBalloonUpdate(true);
    }
  }, [type]);
  const handleInput = (e) => {
    SetinpVal(e.target.value);
    if (inpVal !== prevVal) {
      SetSubmitDisabled(false);
    } else {
      SetSubmitDisabled(true);
    }
  };
  const ToggleToast = (val, type, msg, afterFxn) => {
    SetShowToast(val);
    SetToastInfo(msg);
    SetToastType(type);
    // afterFxn();
    toast(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const HandelSubmit = async (e) => {
    e.preventDefault();
    if (inpVal === prevVal) {
      return 0;
    }
    switch (type) {
      case 0:
        var url = BASEURL + "course-actions/" + 0 + "/";
        var method = "POST";
        var body = {
          title: inpVal,
          author: UserId,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Course);
        toggle();
        break;
      case 1:
        var url = BASEURL + "course-actions/" + data.id + "/";
        var method = "PUT";
        var body = {
          id: data.id,
          title: inpVal,
          author: UserId,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken);
        toggle();
        break;
      case 2:
        var url = BASEURL + "lessons-actions/" + 0 + "/";
        var method = "POST";
        var body = {
          title: inpVal,
          author: UserId,
          parent_course: Parent_Course,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Course);
        toggle();
        break;
      case 3:
        var url = BASEURL + "lessons-actions/" + data.id + "/";
        var method = "PUT";
        var body = {
          id: data.id,
          title: inpVal,
          author: UserId,
          parent_course: Parent_Course,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Course);
        toggle();
        break;
      case 4:
        var url = BASEURL + "wordcard-options/" + Parent_Lesson + "/";
        var method = "POST";
        var body = {
          words: inpVal,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        ToggleToast(
          true,
          "error",
          "Word Card already exists in this lesson",
          AfterSuccessFunction(AccessToken, Parent_Lesson)
        );
        toggle();
        break;
      case 5:
        var url = BASEURL + "wordcard-options/" + Parent_Lesson + "/";
        var method = "PUT";
        var body = {
          words: inpVal,
          card_id: data?.id,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      case 6:
        var url = BASEURL + "dialogue-group-actions/" + Parent_Lesson + "/";
        var method = "POST";
        var body = {
          title: inpVal,
          user: UserId,
          lesson: Parent_Lesson,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      case 7:
        var url = BASEURL + "dialogue-group-actions/" + Parent_Lesson + "/";
        var method = "PUT";
        var body = {
          title: inpVal,
          card_id: item_id,
          user: UserId,
          lesson: Parent_Lesson,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      case 8:
        var url = BASEURL + "dialogue-actions/" + Parent_DialogueGroup + "/";
        var method = "POST";
        var body = {
          title: inpVal,
          user: UserId,
          lesson: Parent_Lesson,
          dialogue_group: Parent_DialogueGroup,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      case 9:
        var url = BASEURL + "dialogue-actions/" + Parent_DialogueGroup + "/";
        var method = "PUT";
        var body = {
          title: inpVal,
          user: UserId,
          card_id: item_id,
          lesson: Parent_Lesson,
          dialogue_group: Parent_DialogueGroup,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      case 10:
        console.log("Dialogue Image Setter");
        toggle();
        break;
      case 100:
        var body = {
          text: inpVal,
          user: UserId,
          test: TestCardId,
        };
        AddTestAnswer(body, AccessToken);
        AfterSuccessFunction(AccessToken);
        toggle();
        break;
      default:
        console.log("Failed....");
    }
  };
  return (
    <motion.div
      className={stx.AddModalWrapper}
      initial={"initial"}
      animate={"final"}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        onClick={() => toggle()}
        className={stx.QuitModalOverlay}
      ></motion.div>
      {ShowToast && (
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      )}
      <motion.div variants={variantModal} className={stx.InnerDiv}>
        <button className={stx.IDCrossButton} onClick={() => toggle()}>
          <FontAwesomeIcon icon={faTimes} className={stx.IDCrossButtonIcons} />
        </button>
        {ImageUploadCard ? (
          <ImageUploadFeature
            toggle={toggle}
            AfterSuccessFunction={AfterSuccessFunction}
            type={type}
            AccessToken={AccessToken}
            UserId={UserId}
            ToggleToast={ToggleToast}
            Parent_DialogueGroup={Parent_DialogueGroup}
            Parent_Dialogue={Parent_Dialogue}
            item_id={item_id}
            Parent_Lesson={Parent_Lesson}
            Parent_Dialogue_data={Parent_Dialogue_data}
          />
        ) : BaloonVoiceCard ? (
          <BalloonUploadFeature
            toggle={toggle}
            AfterSuccessFunction={AfterSuccessFunction}
            type={type}
            AccessToken={AccessToken}
            UserId={UserId}
            Parent_DialogueGroup={Parent_DialogueGroup}
            Parent_Dialogue={Parent_Dialogue}
            Parent_Lesson={Parent_Lesson}
            item_id={item_id}
            Parent_Dialogue_data={Parent_Dialogue_data}
          />
        ) : NoteAddCard ? (
          <NoteAddSection
            toggle={toggle}
            AfterSuccessFunction={AfterSuccessFunction}
            type={type}
            AccessToken={AccessToken}
            UserId={UserId}
            Parent_DialogueGroup={Parent_DialogueGroup}
            Parent_Dialogue={Parent_Dialogue}
            Parent_Lesson={Parent_Lesson}
            item_id={item_id}
            Parent_Dialogue_data={Parent_Dialogue_data}
          />
        ) : PopupAddCard ? (
          <PopupAddSection
            toggle={toggle}
            AfterSuccessFunction={AfterSuccessFunction}
            type={type}
            AccessToken={AccessToken}
            UserId={UserId}
            Parent_DialogueGroup={Parent_DialogueGroup}
            Parent_Dialogue={Parent_Dialogue}
            Parent_Lesson={Parent_Lesson}
            item_id={item_id}
            Parent_Dialogue_data={Parent_Dialogue_data}
          />
        ) : LabelAddCard ? (
          <LabelAddSection
            toggle={toggle}
            AfterSuccessFunction={AfterSuccessFunction}
            type={type}
            AccessToken={AccessToken}
            UserId={UserId}
            Parent_DialogueGroup={Parent_DialogueGroup}
            Parent_Dialogue={Parent_Dialogue}
            Parent_Lesson={Parent_Lesson}
            item_id={item_id}
            Parent_Dialogue_data={Parent_Dialogue_data}
          />
        ) : BalloonUpdate ? (
          <UpdateBalloonFeature
            toggle={toggle}
            AfterSuccessFunction={AfterSuccessFunction}
            type={type}
            AccessToken={AccessToken}
            UserId={UserId}
            Parent_DialogueGroup={Parent_DialogueGroup}
            Parent_Dialogue={Parent_Dialogue}
            Parent_Lesson={Parent_Lesson}
            item_id={item_id}
            Parent_Dialogue_data={Parent_Dialogue_data}
            data={data}
          />
        ) : (
          <>
            <h2 className={stx.ID_h2}>{title || "Course Title"}</h2>
            <form
              className={stx.IDForm}
              method="post"
              onSubmit={(e) => {
                if (!SubmitDisabled) {
                  HandelSubmit(e);
                }
              }}
            >
              <textarea
                type="text"
                value={inpVal}
                onChange={(e) => handleInput(e)}
                required={true}
                className={stx.IDInputField}
                placeholder={title || "Course Title"}
              />
              <button
                type="submit"
                className={stx.IDSubmitButton}
                disabled={SubmitDisabled}
              >
                SAVE
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default AddModal;
const variantModal = {
  initial: { y: 10, opacity: 0 },
  final: { y: 0, opacity: 1 },
};

export const ElevatedModal = ({ toggle, children }) => {
  return (
    <motion.div
      className={stx.AddModalWrapper}
      initial={"initial"}
      animate={"final"}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        onClick={() => toggle()}
        className={stx.QuitModalOverlay}
      ></motion.div>
      <motion.div variants={variantModal} className={stx.InnerDiv}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const MainFetchFunction = async (AccessToken, url, method, body) => {
  const resp = await fetch(url, {
    method: method,
    headers: {
      Authorization: "Bearer " + AccessToken,
      "Content-Type": "application/json",
    },
    // referrerPolicy: "unsafe-url",
    body: JSON.stringify(body),
  });
  const isSuccessful = resp.ok;
  const response = await resp.json();
  if (isSuccessful) {
    return { status: true, data: response };
  } else {
    return { status: false };
  }
};

const ImageUploadFeature = ({
  toggle,
  AfterSuccessFunction,
  type,
  AccessToken,
  ToggleToast,
  UserId,
  Parent_DialogueGroup,
  Parent_Dialogue,
  Parent_Lesson,
  item_id,
  Parent_Dialogue_data,
}) => {
  const [File, SetFile] = useState(null);
  const [FileName, SetFileName] = useState(null);
  const [Hint, SetHint] = useState("");
  const [ImageUrl, SetImageUrl] = useState(null);
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [DialogueUpdating, SetDialogueUpdating] = useState(false);
  const SubmitData = () => {
    SetUploading(true);
    SetUploadingError(false);
    var body = new FormData();
    if (File) {
      body.append("file", File, FileName);
    }
    body.append("hints", Hint);
    body.append("user", UserId);
    var url = BASEURL + "image-actions/";
    axios
      .post(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        UpdateDialogue(resp.data);
      })
      .catch((e) => {
        SetUploading(false);
        ToggleToast(true, "error", "an error occured", () => {
          console.log("");
        });
        SetUploadingError(true);
      });
  };
  const UpdateDialogue = async (data) => {
    SetDialogueUpdating(true);
    var imgData = Parent_Dialogue_data?.image;
    imgData.push(data.id);
    var url = BASEURL + "dialogue-actions/" + Parent_DialogueGroup + "/";
    var method = "PUT";
    var body = {
      user: UserId,
      card_id: Parent_Dialogue,
      lesson: Parent_Lesson,
      dialogue_group: Parent_DialogueGroup,
      image: imgData,
    };
    console.log(body);
    var resp = await MainFetchFunction(AccessToken, url, method, body);
    if (resp.status) {
      AfterSuccessFunction(AccessToken, Parent_Lesson);
      toggle();
    } else {
      SetUploadingError(true);
      ToggleToast(true, "error", "an error occured", () => {
        console.log("");
      });
      SetDialogueUpdating(false);
    }
  };
  return (
    <div className={stx.ImageUploadFeature}>
      {uplaoding ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Uploading Image Data...</p>
        </div>
      ) : uplaodingError ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ErrorHandler Action={() => SubmitData()} />
        </div>
      ) : DialogueUpdating ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Updating Dialogue With latest Data...</p>
        </div>
      ) : (
        <>
          <h2 className={stx.ImgUplH2}> Hint</h2>
          <input
            className={stx.ImgUplInputs}
            value={Hint}
            placeholder="Enter Hints here"
            onChange={(e) => {
              SetHint(e.target.value);
            }}
          />
          <div className={stx.ButtonsDivision}>
            <input
              className={stx.ButtonsUplaodInput}
              type="file"
              id="upload-photo"
              name="UploadedImage"
              accept="image/*"
              onChange={(e) => {
                e.preventDefault();
                SetFile(e.target.files[0]);
                console.log(e.target.files[0]);
                SetImageUrl(URL?.createObjectURL(e.target.files[0]));
                SetFileName(e.target.files[0].name);
              }}
            />
            <label className={stx.ButtonsUplaodLabel} for="upload-photo">
              <img className={stx.UplaodButtons} src={uploadIcon} />
            </label>
            <button className={stx.ButtonsUplaod}>
              <img className={stx.UplaodButtons} src={menuIcon} />
            </button>
          </div>
          <label className={stx.imageavatar} for="upload-photo">
            <img
              className={stx.ImgUplImage}
              src={
                ImageUrl ||
                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw8PDw8QDw0NEBINDQ0PEhAPDQ0NFRIWFhURFRUYHSggGBolGxUVITEhJSkrOjouFx8zODM4NygtLjcBCgoKDQ0LEg8PGisZExkrNysrKystLSsrKysrLS0rKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAGxABAQEAAwEBAAAAAAAAAAAAAAERQYHwUQL/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AObgkUkWIoAAAABBAKVamgKQAAABICiYoESgCyAAUAAAAQBRABakUBNVAUAAQoKIaClADU0UAAEWCAohoKioBqxFnQAFBBAGiGpoKVFAwCAAYBF1ADRNAWIaoGAAUAF01KaAVFAIACoAAAmigAigAAUAAFBMRUBRIYCkAAAAIUDEVAWgSAQAACUDCqgJgoAGgGBpAAABAFMCAAUANAAQFEUAwAA00ANAEWoCiKAJgC6CYAqSNAmAAAlBU1QClKgLAh7gAAAAE1QAQMBQPcAAAAAmgAoYgKEKAgoAYgKi4YAFQFDEBRFwAAEIuAAi4ACApEXACgDIuAKQQBUUCAAIuAAaAAAAAKgAGAGmloAUAAgAqAIoAdhoCKigAAAAAAAgKgoBAABAUIAJQBbEUAAAAAAAEAUAARYAGmgiwQFAAAAoACLqALAwAAAggKBoCLqANMqCaACgAiooAAAACKgFFqARSAAAIsAEVFgIACgAAAItMBAAU0IBqLEoKmKAAAgq0EtRQBFQBQAABBQACgItQDFgAAQGRoAIRAFTFgAUAAABAWoqApiYoAEBFAChUBaUoAJFoAAIoAozgCgAAAAUDRFACkBFiKAQAAxAUABAoLhAAAABICgAAAqfABpKAIUASkAGiAAQAWsgBEABfyAKUASrFASoACQAI0AAAP/Z"
              }
            />
          </label>
          <h2 className={stx.ImgUplH2}> Image file name</h2>
          <input
            className={stx.ImgUplInputsMuted}
            placeholder="Uploaded File Name will appear here"
            value={FileName || ""}
            disabled={true}
            onChange={(e) => {
              SetFileName(e.target.value);
            }}
          />
          <div className={stx.SubmitBtnWrapper}>
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => SubmitData()}
              disabled={
                File === null ? true : false || Hint === "" ? true : false
              }
            >
              SAVE
            </button>
          </div>
        </>
      )}
    </div>
  );
};
const BalloonUploadFeature = ({
  toggle,
  AfterSuccessFunction,
  type,
  AccessToken,
  UserId,
  Parent_DialogueGroup,
  Parent_Dialogue,
  Parent_Lesson,
  item_id,
  Parent_Dialogue_data,
}) => {
  const [File, SetFile] = useState(null);
  const [Avatar, SetAvatar] = useState("female_voice");
  const [FileName, SetFileName] = useState(null);
  const [Meaning, SetMeaning] = useState("");
  const [Pronunciation, SetPronunciation] = useState("");
  const [Ideogram, SetIdeogram] = useState("");
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [DialogueUpdating, SetDialogueUpdating] = useState(false);
  const SubmitData = () => {
    SetUploading(true);
    SetUploadingError(false);
    var body = new FormData();
    if (File) {
      body.append("file", File, FileName);
    }
    body.append("avatar", Avatar);
    body.append("meaning", Meaning);
    body.append("ideogram", Ideogram);
    body.append("pronunciation", Pronunciation);
    body.append("lesson", Parent_Lesson);
    body.append("user", UserId);
    var url = BASEURL + "ballon-actions/";
    axios
      .post(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        UpdateDialogue(resp.data);
      })
      .catch((e) => {
        SetUploading(false);
        SetUploadingError(true);
      });
  };
  const UpdateDialogue = async (data) => {
    SetDialogueUpdating(true);
    var ballonData = Parent_Dialogue_data?.ballon;
    ballonData.push(data.id);
    var url = BASEURL + "dialogue-actions/" + Parent_DialogueGroup + "/";
    var method = "PUT";
    console.log(Parent_Lesson);
    var body = {
      user: UserId,
      card_id: Parent_Dialogue,
      dialogue_group: Parent_DialogueGroup,
      lesson: Parent_Lesson,
      ballon: ballonData,
    };
    var resp = await MainFetchFunction(AccessToken, url, method, body);
    if (resp.status) {
      AfterSuccessFunction(AccessToken, Parent_Lesson);
      toggle();
    } else {
      SetUploadingError(true);
      SetDialogueUpdating(false);
    }
    AfterSuccessFunction(AccessToken, Parent_Lesson);
    toggle();
  };

  const GetAvatar = (avatar) => {
    SetAvatar(avatar);
  };
  const GetAudioFile = (file) => {
    SetFile(file);
    SetFileName(file?.name);
  };

  return (
    <div className={stx.BalloonUploadFeature}>
      {uplaoding ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Uploading Image Data...</p>
        </div>
      ) : uplaodingError ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ErrorHandler Action={() => SubmitData()} />
        </div>
      ) : DialogueUpdating ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Updating Dialogue With latest Data...</p>
        </div>
      ) : (
        <>
          <SelectAvatar GetAvatar={GetAvatar} Avatar={Avatar} />
          <VoiceSelect
            GetAudioFile={GetAudioFile}
            name={"voice_select_balloon"}
          />
          <h3 className={stx.BaloonMeaningH3}> Meaning</h3>
          <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetMeaning(e.target.value)}
            value={Meaning}
          />
          <h3 className={stx.BaloonMeaningH3}> Ideograms</h3>
          <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetIdeogram(e.target.value)}
            value={Ideogram}
          />
          {/* <h3 className={stx.BaloonMeaningH3}> Pronunciation</h3> */}
          {/* <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetPronunciation(e.target.value)}
            value={Pronunciation}
          /> */}
          <div className={stx.SubmitBtnWrapper}>
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => SubmitData()}
              disabled={File === null ? true : false}
            >
              SAVE
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const SelectAvatar = ({ GetAvatar, Avatar }) => {
  const [defAvatar, SetDefAvatar] = useState(Avatar);
  return (
    <div className={stx.ChooseWrapper}>
      <img
        src={defAvatar === "female_voice" ? FemaleIcon : MaleIcon}
        className={stx.AvatarPic}
      />
      <div className={stx.AvatarChooseInner}>
        <h3 className={stx.AvatarChooseH3}>Avatar</h3>
        <select
          className={stx.AvatarChooseSelect}
          value={defAvatar}
          onChange={(e) => {
            GetAvatar(e.target.value);
            SetDefAvatar(e.target.value);
          }}
        >
          <option value={"female_voice"}>Female Adult</option>
          <option value={"male_voice"}>Male Adult</option>
        </select>
      </div>
    </div>
  );
};

export const VoiceSelect = ({ GetAudioFile, image, name, title }) => {
  const [Audio, SetAudio] = useState(null);
  return (
    <div className={stx.ChooseWrapper}>
      <img src={image || voiceIcon} className={stx.VoicePic} />
      <label className={stx.ButtonsUplaodLabel} for={name}>
        <img className={stx.UplaodButtons} src={uploadIcon} />
      </label>
      <input
        id={name}
        type="file"
        accept="audio/*"
        className={stx.AudioUpload}
        onChange={(e) => {
          GetAudioFile(e.target.files[0]);
          SetAudio(e.target.files[0]);
        }}
      />
      <div className={stx.AvatarChooseInner}>
        <h3 className={stx.AvatarChooseH3}>Audio</h3>
        <input
          className={stx.AvatarChooseSelectMuted}
          value={Audio?.name ?? title ?? ""}
          disabled
        />
      </div>
    </div>
  );
};

export const FileSelect = ({ GetAudioFile, image, label, type, for_ }) => {
  const [FIle, SetFIle] = useState(null);
  return (
    <div className={stx.ChooseWrapper}>
      <img src={image || voiceIcon} className={stx.VoicePic} />
      <label className={stx.ButtonsUplaodLabel} for={for_ || "voice_upload"}>
        <img className={stx.UplaodButtons} src={uploadIcon} />
      </label>
      <input
        id={for_ || "voice_upload"}
        type="file"
        accept={type || "all/*"}
        className={stx.AudioUpload}
        onChange={(e) => {
          SetFIle(e.target.files[0]);
          GetAudioFile(e.target.files[0]);
        }}
      />
      <div className={stx.AvatarChooseInner}>
        <h3 className={stx.AvatarChooseH3}>{label || "File Uplaod"}</h3>
        <input
          className={stx.AvatarChooseSelectMuted}
          value={FIle?.name || ""}
          disabled
        />
      </div>
    </div>
  );
};
export const ImageBoxSelect = ({ GetAudioFile, image, label, type, for_ }) => {
  const [FIle, SetFIle] = useState(null);
  return (
    <div className={stx.ChooseWrapper}>
      <img src={image || voiceIcon} className={stx.VoicePic} />
      <label className={stx.ButtonsUplaodLabel} for={for_ || "voice_upload"}>
        <img className={stx.UplaodButtons} src={uploadIcon} />
      </label>
      <input
        id={for_ || "voice_upload"}
        type="file"
        accept={type || "all/*"}
        className={stx.AudioUpload}
        onChange={(e) => {
          SetFIle(e.target.files[0]);
          GetAudioFile(e.target.files[0]);
        }}
      />
      <div className={stx.AvatarChooseInner}>
        <h3 className={stx.AvatarChooseH3}>{label || "File Uplaod"}</h3>
        <input
          className={stx.AvatarChooseSelectMuted}
          value={FIle?.name || ""}
          disabled
        />
      </div>
    </div>
  );
};

const NoteAddSection = ({
  toggle,
  AfterSuccessFunction,
  type,
  AccessToken,
  UserId,
  Parent_DialogueGroup,
  Parent_Dialogue,
  Parent_Lesson,
  item_id,
  Parent_Dialogue_data,
}) => {
  const [File, SetFile] = useState(null);
  const [FileName, SetFileName] = useState(null);
  const [NoteTitle, SetNoteTitle] = useState(null);
  const [NoteSubTitle, SetNoteSubTitle] = useState(null);
  const [NoteText, SetNoteText] = useState(null);
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [DialogueUpdating, SetDialogueUpdating] = useState(false);
  const SubmitData = () => {
    SetUploading(true);
    SetUploadingError(false);
    var body = new FormData();
    if (File) {
      body.append("file", File, FileName);
    }
    body.append("title", NoteTitle);
    body.append("subtitle", NoteSubTitle);
    body.append("text", NoteText);
    body.append("lesson", Parent_Lesson);
    body.append("user", UserId);
    var url = BASEURL + "alert-notes-action/";
    axios
      .post(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        // UpdateDialogue(resp.data);
      })
      .catch((e) => {
        SetUploading(false);
        SetUploadingError(true);
      });
  };

  const GetAudioFile = (file) => {
    SetFile(file);
    SetFileName(file?.name);
  };

  return (
    <div className={stx.BalloonUploadFeature}>
      {uplaoding ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Uploading Image Data...</p>
        </div>
      ) : uplaodingError ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ErrorHandler Action={() => SubmitData()} />
        </div>
      ) : DialogueUpdating ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Updating Dialogue With latest Data...</p>
        </div>
      ) : (
        <>
          <h3 className={stx.BaloonMeaningH3}> Note title</h3>
          <input
            className={stx.BaloonInputArea}
            onChange={(e) => SetNoteTitle(e.target.value)}
            value={NoteTitle}
          />
          <h3 className={stx.BaloonMeaningH3}> Note subtitle</h3>
          <input
            className={stx.BaloonInputArea}
            onChange={(e) => SetNoteSubTitle(e.target.value)}
            value={NoteSubTitle}
          />
          <ImageSelect GetAudioFile={GetAudioFile} />
          <h3 className={stx.BaloonMeaningH3}>Note text</h3>
          <textarea
            className={stx.BaloonTextAreaPopup}
            onChange={(e) => SetNoteText(e.target.value)}
            value={NoteText}
          />
          {/* <h3 className={stx.BaloonMeaningH3}> Pronunciation</h3> */}
          {/* <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetPronunciation(e.target.value)}
            value={Pronunciation}
          /> */}
          <div className={stx.SubmitBtnWrapper}>
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => SubmitData()}
              disabled={File === null ? true : false}
            >
              SAVE
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ImageSelect = ({ GetAudioFile }) => {
  const [Image, SetImage] = useState(null);
  const [preview, setPreview] = useState();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!Image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(Image);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [Image]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      SetImage(undefined);
      GetAudioFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    SetImage(e.target.files[0]);
    GetAudioFile(e.target.files[0]);
  };

  return (
    <div className={stx.ImageUplaodWrapper}>
      <div className={stx.ChooseWrapper}>
        <label className={stx.ButtonsUplaodLabel} for="voiceUpload">
          <img className={stx.UplaodButtons} src={uploadIcon} />
        </label>
        <input
          id="voiceUpload"
          type="file"
          accept="image/*"
          className={stx.AudioUpload}
          onChange={(e) => {
            onSelectFile(e);
          }}
        />
        <div className={stx.AvatarChooseInner}>
          <h3 className={stx.AvatarChooseH3}>Image file</h3>
          <input
            className={stx.AvatarChooseSelectMuted}
            value={Image?.name || ""}
            disabled
          />
        </div>
      </div>
      <h3 className={stx.AvatarChooseH3}>Note image preview</h3>
      <div className={stx.ImageUploadImagePreview}>
        {Image && <img src={preview} className={stx.PreviewImage} />}
      </div>
    </div>
  );
};

const PopupAddSection = ({
  toggle,
  AfterSuccessFunction,
  type,
  AccessToken,
  UserId,
  Parent_DialogueGroup,
  Parent_Dialogue,
  Parent_Lesson,
  item_id,
  Parent_Dialogue_data,
}) => {
  const [File, SetFile] = useState(null);
  const [FileName, SetFileName] = useState(null);
  const [NoteTitle, SetNoteTitle] = useState(null);
  const [NoteText, SetNoteText] = useState(null);
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [DialogueUpdating, SetDialogueUpdating] = useState(false);
  const SubmitData = () => {
    SetUploading(true);
    SetUploadingError(false);
    var body = new FormData();
    if (File) {
      body.append("file", File, FileName);
    }
    body.append("title", NoteTitle);
    body.append("text", NoteText);
    body.append("lesson", Parent_Lesson);
    body.append("user", UserId);
    var url = BASEURL + "alert-popups-action/";
    axios
      .post(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        toggle();
        AfterSuccessFunction(AccessToken, Parent_Lesson);
      })
      .catch((e) => {
        SetUploading(false);
        SetUploadingError(true);
      });
  };

  const GetAudioFile = (file) => {
    SetFile(file);
    SetFileName(file?.name);
  };

  return (
    <div className={stx.BalloonUploadFeature}>
      {uplaoding ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Uploading Image Data...</p>
        </div>
      ) : uplaodingError ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ErrorHandler Action={() => SubmitData()} />
        </div>
      ) : DialogueUpdating ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Updating Dialogue With latest Data...</p>
        </div>
      ) : (
        <>
          <h3 className={stx.BaloonMeaningH3}> Popup title</h3>
          <input
            className={stx.BaloonInputArea}
            onChange={(e) => SetNoteTitle(e.target.value)}
            value={NoteTitle}
          />
          <h3 className={stx.BaloonMeaningH3}>Popup text</h3>
          <textarea
            className={stx.BaloonTextAreaPopup}
            onChange={(e) => SetNoteText(e.target.value)}
            value={NoteText}
          />
          <ImageSelect GetAudioFile={GetAudioFile} />

          {/* <h3 className={stx.BaloonMeaningH3}> Pronunciation</h3> */}
          {/* <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetPronunciation(e.target.value)}
            value={Pronunciation}
          /> */}
          <div className={stx.SubmitBtnWrapper}>
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => SubmitData()}
              disabled={File === null ? true : false}
            >
              SAVE
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const LabelAddSection = ({
  toggle,
  AfterSuccessFunction,
  type,
  AccessToken,
  UserId,
  Parent_DialogueGroup,
  Parent_Dialogue,
  Parent_Lesson,
  item_id,
  Parent_Dialogue_data,
}) => {
  const [File, SetFile] = useState(null);
  const [LabelTitle, SetLabelTitle] = useState(null);
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [DialogueUpdating, SetDialogueUpdating] = useState(false);
  const SubmitData = () => {
    SetUploading(true);
    SetUploadingError(false);
    var body = new FormData();
    body.append("title", LabelTitle);
    body.append("lesson", Parent_Lesson);
    body.append("user", UserId);
    var url = BASEURL + "alert-labels-action/";
    axios
      .post(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        // UpdateDialogue(resp.data);
      })
      .catch((e) => {
        SetUploading(false);
        SetUploadingError(true);
      });
  };

  return (
    <div className={stx.BalloonUploadFeature}>
      {uplaoding ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Uploading Image Data...</p>
        </div>
      ) : uplaodingError ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ErrorHandler Action={() => SubmitData()} />
        </div>
      ) : DialogueUpdating ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Updating Dialogue With latest Data...</p>
        </div>
      ) : (
        <>
          <h3 className={stx.BaloonMeaningH3}> Label title</h3>
          <input
            className={stx.BaloonInputArea}
            onChange={(e) => SetLabelTitle(e.target.value)}
            value={LabelTitle}
          />
          <div className={stx.SubmitBtnWrapper}>
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => SubmitData()}
              disabled={LabelTitle === null ? true : false}
            >
              SAVE
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const UpdateBalloonFeature = ({
  toggle,
  AfterSuccessFunction,
  type,
  AccessToken,
  UserId,
  Parent_DialogueGroup,
  Parent_Dialogue,
  Parent_Lesson,
  item_id,
  Parent_Dialogue_data,
  data,
}) => {
  const [File, SetFile] = useState(null);
  const [Avatar, SetAvatar] = useState("female_voice");
  const [FileName, SetFileName] = useState(null);
  const [Meaning, SetMeaning] = useState(data?.meaning || "");
  const [Pronunciation, SetPronunciation] = useState(data?.pronunciation || "");
  const [Ideogram, SetIdeogram] = useState(data?.ideogram || "");
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [DialogueUpdating, SetDialogueUpdating] = useState(false);
  const SubmitData = () => {
    SetUploading(true);
    SetUploadingError(false);
    var body = new FormData();
    if (File) {
      body.append("file", File, FileName);
    }
    body.append("avatar", Avatar);
    body.append("meaning", Meaning);
    body.append("ideogram", Ideogram);
    body.append("pronunciation", Pronunciation);
    body.append("lesson", Parent_Lesson);
    body.append("id", data.id);
    body.append("user", UserId);
    var url = BASEURL + "ballon-actions/";
    axios
      .put(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        toggle();
        AfterSuccessFunction(AccessToken);
      })
      .catch((e) => {
        SetUploading(false);
        SetUploadingError(true);
      });
  };

  const GetAvatar = (avatar) => {
    SetAvatar(avatar);
  };
  const GetAudioFile = (file) => {
    SetFile(file);
    SetFileName(file?.name);
  };

  return (
    <div className={stx.BalloonUploadFeature}>
      {uplaoding ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Uploading Image Data...</p>
        </div>
      ) : uplaodingError ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ErrorHandler Action={() => SubmitData()} />
        </div>
      ) : DialogueUpdating ? (
        <div
          style={{
            height: 450,
            background: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <LoadingIndicator />
          <p>Updating Dialogue With latest Data...</p>
        </div>
      ) : (
        <>
          <SelectAvatar GetAvatar={GetAvatar} Avatar={Avatar} />
          <VoiceSelect
            GetAudioFile={GetAudioFile}
            name={"voice_select_balloon"}
          />
          <h3 className={stx.BaloonMeaningH3}> Meaning</h3>
          <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetMeaning(e.target.value)}
            value={Meaning}
          />
          <h3 className={stx.BaloonMeaningH3}> Ideograms</h3>
          <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetIdeogram(e.target.value)}
            value={Ideogram}
          />
          {/* <h3 className={stx.BaloonMeaningH3}> Pronunciation</h3> */}
          {/* <textarea
            className={stx.BaloonTextArea}
            onChange={(e) => SetPronunciation(e.target.value)}
            value={Pronunciation}
          /> */}
          <div className={stx.SubmitBtnWrapper}>
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => SubmitData()}
            >
              UPDATE
            </button>
          </div>
        </>
      )}
    </div>
  );
};
