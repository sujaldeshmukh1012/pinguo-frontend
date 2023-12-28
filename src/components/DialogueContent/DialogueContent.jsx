import React, { useState, useEffect } from "react";
import stx from "./DialogueContent.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCopy,
  faEllipsisV,
  faExternalLink,
  faEye,
  faEyeSlash,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { MainModal } from "../BottomSelect/BottomSelect";
import AddModal, { ElevatedModal } from "../AddModal/AddModal";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import male from "../../assets/male.png";
import female from "../../assets/female.png";
import { BASEURL } from "../../connections/BASEURL";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import {
  SpeakingModuleFeMale,
  SpeakingModuleMale,
} from "../WordCardVoiceSpeaking/WordCardVoiceSpeaking";
function DialogueContent({
  data,
  error,
  AccessToken,
  AfterSuccessFunction,
  UserId,
  loading,
  Parent_Lesson,
  Parent_DialogueGroup,
  Parent_Course,
  Parent_Dialogue,
  Parent_Dialogue_data,
}) {
  const [ImageData, SetImageData] = useState(null);
  const [BallonData, SetBallonData] = useState(null);
  const [Data, SetData] = useState(null);
  const [SelectBallon, SetSelectBallon] = useState(null);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [UpdatingData, UpdatingsetData] = useState(null);

  const ToggleAddModal = (data) => {
    setAddModalOpen(!AddModalOpen);
    UpdatingsetData(data);
  };

  useEffect(() => {
    if (!loading && !error) {
      PopulateData();
    }
  }, [loading]);

  const PopulateData = async () => {
    FetchDialogueData(AccessToken, data).then((resp) => {
      var data_ = RearrangeData(resp[0], resp[1]);
      SetData(data_);
      // SetImageData(resp[0]);
      // SetBallonData(resp[1]);
    });
  };
  const SetNewSelectedBallon = (index) => {
    SetSelectBallon(index);
  };
  return (
    <div className={stx.DialogueContent}>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorHandler Action={() => AfterSuccessFunction(AccessToken)} />
      ) : (
        <div className={stx.MainWrapper}>
          {/* {ImageData === null ? (
            <></>
          ) : (
            ImageData?.map((item, i) => {
              return <ImageDataComponent data={item} key={i} />;
            })
          )}
          {BallonData === null ? (
            <></>
          ) : (
            BallonData?.map((item, i) => {
              return (
                <BallonDataComponent
                  data={item}
                  key={i}
                  selective={BallonData?.length > 1}
                  SetNewSelectedBallon={SetNewSelectedBallon}
                  selected={SelectBallon === item?.id}
                />
              );
            })
          )} */}
          {Data === null ? (
            <></>
          ) : (
            Data?.map((item, i) => {
              if (item?.info_type === "image-modal") {
                return <ImageDataComponent data={item} key={i} />;
              } else {
                return (
                  <BallonDataComponent
                    ToggleAddModal={ToggleAddModal}
                    data={item}
                    key={i}
                    selective={Data?.length > 1}
                    SetNewSelectedBallon={SetNewSelectedBallon}
                    selected={SelectBallon === item?.id}
                  />
                );
              }
            })
          )}
        </div>
        // here goes the image baloon and what not
      )}
      {AddModalOpen && (
        <AddModal
          toggle={ToggleAddModal}
          type={20}
          AccessToken={AccessToken}
          UserId={UserId}
          title={"Edit Ballon"}
          Parent_Course={Parent_Course}
          Parent_DialogueGroup={Parent_DialogueGroup}
          Parent_Dialogue={Parent_Dialogue}
          Parent_Dialogue_data={Parent_Dialogue_data}
          Parent_Lesson={Parent_Lesson}
          AfterSuccessFunction={AfterSuccessFunction}
          data={UpdatingData}
        />
      )}
    </div>
  );
}

export default DialogueContent;

const ImageDataComponent = ({ data }) => {
  return (
    <div className={stx.TopWrapper}>
      <h3 className={stx.TopH3}>{data?.hints}</h3>
      <img className={stx.TopImageAvatar} src={data?.file} />
    </div>
  );
};

const BallonDataComponent = ({ data, ToggleAddModal }) => {
  return (
    <div className={stx.BottomWrapper} onClick={() => ToggleAddModal(data)}>
      {/* <button className={stx.AudioPlayButton}> 
        <img src={female} className={stx.SMImage} />
      </button> */}

      <section
        className={stx.AudioPlayButton}
        style={
          data?.avatar == "male_voice"
            ? { transform: "scale(-1, 1)" }
            : { transform: "scale(1)" }
        }
      >
        {data?.avatar == "female_voice" ? (
          <SpeakingModuleFeMale voice={data?.file} />
        ) : (
          <SpeakingModuleMale voice={data?.file} />
        )}
      </section>
      <h3 className={stx.BWHeading1}>{data?.meaning}</h3>
      <MainIdeogramDialogue
        text={data?.ideogram.replaceAll(/\s/g, "")} // This trims the text and removes all of the white spaces that exists in it
        pinText={data?.pronunciation.split(" ")} // This trims the text and removes all of the white spaces that exists in it
      />
      {/* <MainPronounciationDialogue text={data?.pronunciation} /> */}
    </div>
  );
};

export const MainIdeogramDialogue = ({ text, pinText }) => {
  const Non_punctuations = text?.replace(/[^\p{L}\p{N}\p{Z}]/gu, "").trim();
  pinText = pinText?.filter(function (item) {
    return item !== "";
  });

  var j = pinText?.length;
  return (
    <div className={stx.IdeoGramsWrapper}>
      {[...text].map((word, i) => {
        if (Non_punctuations.includes(word)) {
          return (
            <div className={stx.IdeoGramAndPinyinDiv}>
              <div className={stx.IdeoGrams} key={i}>
                <p className={stx.Paragraph}>{word}</p>
              </div>
              <div className={stx.Pronounciations} key={i}>
                <p className={stx.Paragraph}>{pinText[i]}</p>
              </div>
            </div>
          );
        } else {
          if (i !== j) {
            pinText.unshift("");
          }
          return (
            <div className={stx.IdeoGramAndPinyinDiv}>
              <div className={stx.IdeoGramsPunctuation} key={i}>
                <p className={stx.Paragraph}>{word}</p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export const MainPronounciationDialogue = ({ text }) => {
  // this function is currently not used by the Main Renderer, its instanciated in The mAInIdeogram component
  return (
    <div className={stx.IdeoGramsWrapperLower}>
      {text?.split(" ")?.map((word, i) => {
        if (word !== "。") {
          return (
            <div className={stx.Pronounciations} key={i}>
              <p className={stx.Paragraph}>{word}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export const FetchDialogueData = async (token, data) => {
  var images = data?.image;
  var ballon = data?.ballon;
  var resp = [];
  var imgresp = [];
  var ballonresp = [];
  if (images?.length !== 0) {
    for (var i = 0; i < images.length; i++) {
      var url = BASEURL + "image-details/" + images[i];
      const response = await FetchCoursesOrLesson(token, url);
      if (response.status) {
        imgresp.push(response.data);
      } else {
        imgresp = null;
      }
    }
  } else {
    imgresp = null;
  }

  if (ballon?.length !== 0) {
    for (var i = 0; i < ballon.length; i++) {
      var url = BASEURL + "ballon-details/" + ballon[i];
      const response = await FetchCoursesOrLesson(token, url);
      if (response.status) {
        ballonresp.push(response.data);
      } else {
        ballonresp = null;
      }
    }
  } else {
    ballonresp = null;
  }
  resp.push(imgresp);
  resp.push(ballonresp);
  return resp;
};

// const FetchImage = async (token, data) => {
//   var resp = [];
//   if (data) {
//     var url = BASEURL + "image-details/" + data.id;
//     const response = await FetchCoursesOrLesson(token, url);
//     if (response.status) {
//       resp.push(response.data);
//     } else {
//       resp.push(null);
//     }
//   }
// };

// const FetchBallon = async (token, data) => {
//   if (data) {
//     var resp = [];
//     var url = BASEURL + "ballon-details/" + data.id;
//     const response = await FetchCoursesOrLesson(token, url);
//     if (response.status) {
//       resp.push(response.data);
//     } else {
//       resp.push(null);
//     }
//   }
// };

const RearrangeData = (arr1, arr2) => {
  arr2.map((item, i) => {
    arr1.push(item);
  });
  arr1.sort(function (a, b) {
    var x = new Date(a["last_updated"]);
    var y = new Date(b["last_updated"]);
    console.log(x > y);
    return x > y ? -1 : x < y ? 1 : 0;
  });
  console.log(arr1);
  return arr1;
};
