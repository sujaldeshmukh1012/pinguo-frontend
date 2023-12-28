import React, { useState, useEffect } from "react";
import stx from "./TestContent.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainModal } from "../BottomSelect/BottomSelect";
import AddModal, { ElevatedModal } from "../AddModal/AddModal";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import male from "../../assets/male.png";
import female from "../../assets/female.png";
import { FetchDialogueData } from "../DialogueContent/DialogueContent";
import blank from "../../assets/icons/blank-option.png";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { BASEURL } from "../../connections/BASEURL";
import { PutTestCardData } from "../../pages/TestPage/TestPage";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function TestContent({
  loading,
  error,
  data,
  AccessToken,
  AfterSuccessFunction,
  TestCardAnswers,
  AddTestAnswer,
  UserId,
  AnswersLoading,
  TestCardId,
  FetchTestCardAnswers,
}) {
  const [ImageData, SetImageData] = useState(null);
  const [BallonData, SetBallonData] = useState(null);
  const [TestText, SetTestText] = useState(null);
  const [HiddenItems, SetHiddenItems] = useState([]);
  const [TextType, SetTextType] = useState(null);
  const [SelectBallon, SetSelectBallon] = useState(null);

  useEffect(() => {
    if (!loading && !error) {
      PopulateData();
      SetTestText(data.test_text?.split(","));
      SetTextType(data.card_type);
      var arr = data?.hide?.split(",");
      SetHiddenItems(arr);
      SetSelectBallon(data?.edited_ballon);
    }
  }, [loading]);

  const PopulateData = async () => {
    FetchDialogueData(AccessToken, data.dialogue).then((resp) => {
      SetImageData(resp[0]);
      SetBallonData(resp[1]);
    });
  };
  const SetorDeleteTestText = (text) => {
    var arr = TestText;
    const index = arr.indexOf(text);
    if (index > -1) {
      arr.splice(index, 1);
      SetTestText(arr);
    } else {
      arr.push(text);
      SetTestText(arr);
    }
    var body = {
      test_text: TestText.toString(),
    };
    var url = BASEURL + "testcard/" + data.id + "/";
    PutTestCardData(url, body, AccessToken);
    InitiateAnswerAddition(text, UserId, TestCardId, AccessToken);
    FetchTestCardAnswers(AccessToken, data.id);
  };

  const InitiateAnswerAddition = (textarr, UserId, TestCardId, AccessToken) => {
    console.log(textarr);
    var body = {
      text: textarr,
      user: UserId,
      test: TestCardId,
    };
    AddTestAnswer(body, AccessToken);
    FetchTestCardAnswers(AccessToken, data.id);
  };

  const DeleteTestAnswer = (item, token) => {
    var url = BASEURL + "testanswer/" + item.id + "/";
    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    FetchTestCardAnswers(AccessToken, data.id);
  };

  const validateAnswer = (answer) => {
    if (TestText.includes(answer.text)) {
      DeleteTestAnswer(answer, AccessToken);
      SetorDeleteTestText(answer.text);
    }
  };
  const SetNewSelectedBallon = (index) => {
    UpdateTestEditedBallon(data.id, index, AccessToken);
    SetSelectBallon(index);
  };

  const HideOrShowText = (text) => {
    var arr = HiddenItems;
    const index = arr.indexOf(text);
    if (index > -1) {
      arr.splice(index, 1);
      SetHiddenItems(arr);
    } else {
      arr.push(text);
      SetHiddenItems(arr);
    }
    var body = {
      hide: HiddenItems.toString(),
    };
    var url = BASEURL + "testcard/" + data.id + "/";
    PutTestCardData(url, body, AccessToken);
  };

  return (
    <div className={stx.DialogueContent}>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorHandler
          Action={() => {
            AfterSuccessFunction(AccessToken);
          }}
        />
      ) : (
        <div className={stx.MainWrapper}>
          {ImageData === null ? (
            <></>
          ) : (
            ImageData.map((item, i) => {
              return (
                <ImageDataComponent
                  data={item}
                  HiddenItems={HiddenItems}
                  HideOrShowText={HideOrShowText}
                />
              );
            })
          )}
          {BallonData === null ? (
            <></>
          ) : (
            BallonData.map((item, i) => {
              if (item?.id === SelectBallon) {
                return (
                  <BallonDataComponent
                    HiddenItems={HiddenItems}
                    data={item}
                    SetorDeleteTestText={SetorDeleteTestText}
                    TestText={TestText}
                    TextType={TextType}
                    selective={BallonData?.length > 1}
                    SetNewSelectedBallon={SetNewSelectedBallon}
                    selected={SelectBallon === item?.id}
                    HideOrShowText={HideOrShowText}
                  />
                );
              } else {
                return (
                  <BallonDataComponentDummy
                    HiddenItems={HiddenItems}
                    data={item}
                    SetorDeleteTestText={SetorDeleteTestText}
                    TestText={TestText}
                    TextType={TextType}
                    selective={BallonData?.length > 1}
                    SetNewSelectedBallon={SetNewSelectedBallon}
                    selected={false}
                    HideOrShowText={HideOrShowText}
                  />
                );
              }
            })
          )}
        </div>
      )}
      <div className={stx.BottomYellowDiv}>
        {AnswersLoading ? (
          <LoadingIndicator />
        ) : (
          TestCardAnswers.map((item, i) => {
            return (
              <div
                className={stx.TestAnswer}
                onClick={() => {
                  validateAnswer(item);
                }}
              >
                <button
                  className={stx.TestAnswerCrossButton}
                  onClick={() => DeleteTestAnswer(item, AccessToken)}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={stx.TestAnswerCrossIcon}
                  />
                </button>
                <p className={stx.TestAnswerParagraph}>{item.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TestContent;

const BallonDataComponent = ({
  data,
  SetorDeleteTestText,
  TestText,
  TextType,
  MainClickFunction,
  HiddenItems,
  HideOrShowText,
  selective,
  selected,
  SetNewSelectedBallon,
}) => {
  const [voiceImage, SetVoiceImage] = useState(female);
  const [hide, SetHide] = useState(false);
  const [VoiceHidden, SetVoiceHidden] = useState(false);

  useEffect(() => {
    if (data?.avatar === "male_voice") {
      SetVoiceImage(male);
    } else {
      SetVoiceImage(female);
    }
    if (HiddenItems?.includes(data.meaning)) {
      SetHide(true);
    } else {
      SetHide(false);
    }
  }, []);

  useEffect(() => {
    if (HiddenItems.includes("voice")) {
      SetVoiceHidden(true);
    } else {
      SetVoiceHidden(false);
    }
  }, []);
  return (
    <div className={stx.BottomWrapper}>
      <div className={stx.IndicateType}>{TextType} Test</div>
      {selective &&
        (selected ? (
          <button
            className={stx.SelectBtn_active}
            onClick={() => SetNewSelectedBallon(data.id)}
          >
            SELECTED
          </button>
        ) : (
          <button
            className={stx.SelectBtn}
            onClick={() => SetNewSelectedBallon(data.id)}
          >
            SELECT
          </button>
        ))}
      <button
        className={stx.AudioPlayButton}
        style={
          data?.avatar == "male_voice"
            ? { transform: "scale(-1, 1)" }
            : { transform: "scale(1)" }
        }
      >
        <img
          src={VoiceHidden ? blank : voiceImage}
          className={stx.SMImage}
          onClick={() => {
            HideOrShowText("voice");
            SetVoiceHidden(!VoiceHidden);
          }}
        />
      </button>
      <div
        className={stx.IdeoGramsWrapper}
        onClick={() => {
          HideOrShowText(data?.meaning);
          SetHide(!hide);
        }}
      >
        <h3 className={stx.BWHeading1}>{data?.meaning}</h3>
        {hide && <div className={stx.HideThisStuff}></div>}
      </div>
      <MainIdeogramTest
        text={data?.ideogram.replaceAll(/\s/g, "")} // This trims the text and removes all of the white spaces that exists in it
        pinText={data?.pronunciation.split(" ")} // This trims the text and removes all of the white spaces that exists in it
        SetorDeleteTestText={SetorDeleteTestText}
        TestText={TestText}
        MainClickFunction={MainClickFunction}
        TextType={TextType}
        editable={TextType === "ideogram"}
        HideOrShowText={HideOrShowText}
        HiddenItems={HiddenItems}
      />
      {/* <MainPronounciationTest
        text={data?.pronunciation}
        SetorDeleteTestText={SetorDeleteTestText}
        TestText={TestText}
        MainClickFunction={MainClickFunction}
        TextType={TextType}
        editable={TextType === "pinyin"}
        HideOrShowText={HideOrShowText}
        HiddenItems={HiddenItems}
      /> */}
    </div>
  );
};

// const MainIdeogramTest2 = ({
//   text,
//   SetorDeleteTestText,
//   TestText,
//   editable,
//   HideOrShowText,
//   HiddenItems,
// }) => {
//   const [hide, SetHide] = useState(false);
//   useEffect(() => {
//     if (HiddenItems?.includes(text)) {
//       SetHide(true);
//     } else {
//       SetHide(false);
//     }
//   }, []);
//   return (
//     <div
//       className={stx.IdeoGramsWrapper}
//       onClick={() => {
//         if (!editable) {
//           HideOrShowText(text);
//           SetHide(!hide);
//         }
//       }}
//     >
//       {[...text]?.map((word, i) => {
//         return (
//           <div
//             className={stx.IdeoGrams}
//             key={i}
//             onClick={() => {
//               if (editable) {
//                 SetorDeleteTestText(word);
//               }
//             }}
//           >
//             {TestText.includes(word) && (
//               <div className={stx.HideItemCompleteltDiv}>?</div>
//             )}
//             <p className={stx.Paragraph}>{word}</p>
//           </div>
//         );
//       })}
//       {hide && <div className={stx.HideThisStuff}></div>}
//     </div>
//   );
// };

const MainIdeogramTest = ({
  text,
  pinText,
  SetorDeleteTestText,
  TestText,
  editable,
  HideOrShowText,
  HiddenItems,
}) => {
  const [Pinhide, SetPinHide] = useState(false);
  const [Ideohide, SetIdeoHide] = useState(false);
  useEffect(() => {
    if (HiddenItems?.includes(text)) {
      SetIdeoHide(true);
    } else if (HiddenItems?.includes(pinText)) {
      SetPinHide(true);
    } else {
      SetIdeoHide(false);
      SetPinHide(false);
    }
  }, []);
  const Non_punctuations = text.replace(/[^\p{L}\p{N}\p{Z}]/gu, "").trim();
  console.log(pinText);
  pinText = pinText.filter(function (item) {
    return item !== "";
  });
  var j = pinText.length;
  return (
    <div className={stx.IdeoGramsWrapper}>
      {[...text]?.map((word, i) => {
        if (Non_punctuations.includes(word)) {
          return (
            <div className={stx.IdeoGramAndPinyinDiv}>
              {editable ? (
                <>
                  <IdeoGramTestComponentMain
                    word={word}
                    editable={editable}
                    i={i}
                    text={text}
                    TestText={TestText}
                    SetorDeleteTestText={SetorDeleteTestText}
                    HideOrShowText={HideOrShowText}
                    SetIdeoHide={SetIdeoHide}
                    Ideohide={Ideohide}
                  />
                  <PinyinTestComponentJustHide
                    word={pinText[i]}
                    HideOrShowText={HideOrShowText}
                    pinText={pinText}
                    SetPinHide={SetPinHide}
                    Pinhide={Pinhide}
                    i={i}
                  />
                </>
              ) : (
                <>
                  <IdeoGramTestComponentJustHide
                    word={word}
                    editable={editable}
                    i={i}
                    text={text}
                    TestText={TestText}
                    SetorDeleteTestText={SetorDeleteTestText}
                    HideOrShowText={HideOrShowText}
                    SetIdeoHide={SetIdeoHide}
                    Ideohide={Ideohide}
                  />
                  <PinyinTestComponentMain
                    word={pinText[i]}
                    SetorDeleteTestText={SetorDeleteTestText}
                    TestText={TestText}
                    i={i}
                  />
                </>
              )}
            </div>
          );
        } else {
          if (i !== j) {
            pinText.unshift("new");
            console.log(pinText);
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

// The IdeoGram Component Starts here

const IdeoGramTestComponentMain = ({
  word,
  editable,
  i,
  text,
  TestText,
  SetorDeleteTestText,
  HideOrShowText,
  SetIdeoHide,
  Ideohide,
}) => {
  return (
    <div
      className={stx.IdeoGrams}
      key={i}
      onClick={() => {
        SetorDeleteTestText(word);
      }}
    >
      {TestText.includes(word) && (
        <div className={stx.HideItemCompleteltDiv}>?</div>
      )}
      <p className={stx.Paragraph}>{word}</p>
    </div>
  );
};
const IdeoGramTestComponentJustHide = ({
  word,
  i,
  text,
  HideOrShowText,
  SetIdeoHide,
  Ideohide,
}) => {
  return (
    <div
      className={stx.IdeoGrams}
      key={i}
      onClick={() => {
        HideOrShowText(text);
        SetIdeoHide(!Ideohide);
      }}
    >
      {Ideohide && <div className={stx.HideThisStuff}></div>}
      <p className={stx.Paragraph}>{word}</p>
    </div>
  );
};

const PinyinTestComponentMain = ({
  word,
  SetorDeleteTestText,
  TestText,
  i,
}) => {
  return (
    <div
      className={stx.Pronounciations}
      onClick={() => {
        SetorDeleteTestText(word);
      }}
      key={i}
    >
      {TestText.includes(word) && (
        <div className={stx.HideItemCompleteltDiv}>?</div>
      )}
      <p className={stx.Paragraph}>{word}</p>
    </div>
  );
};

const PinyinTestComponentJustHide = ({
  word,
  HideOrShowText,
  pinText,
  SetPinHide,
  Pinhide,
  i,
}) => {
  return (
    <div
      className={stx.Pronounciations}
      onClick={() => {
        HideOrShowText(pinText);
        SetPinHide(!Pinhide);
      }}
      key={i}
    >
      {Pinhide && <div className={stx.HideThisStuff}></div>}
      <p className={stx.Paragraph}>{word}</p>
    </div>
  );
};

// const MainPronounciationTest = ({
//   text,
//   SetorDeleteTestText,
//   TestText,
//   TextType,
//   HiddenItems,
//   HideOrShowText,
//   editable,
// }) => {
//   const [hide, SetHide] = useState(false);
//   useEffect(() => {
//     if (HiddenItems?.includes(text)) {
//       SetHide(true);
//     } else {
//       SetHide(false);
//     }
//   }, []);
//   return (
//     <div
//       className={stx.IdeoGramsWrapperLower}
//       onClick={() => {
//         if (!editable) {
//           HideOrShowText(text);
//           SetHide(!hide);
//         }
//       }}
//     >
//       {/* <div className={stx.IdeoGramsWrapperLowerHidden}> */}
//       {text?.split(" ")?.map((word, i) => {
//         return (
//           <div
//             className={stx.Pronounciations}
//             key={i}
//             onClick={() => {
//               if (editable) {
//                 SetorDeleteTestText(word);
//               }
//             }}
//           >
//             {TestText.includes(word) && (
//               <div className={stx.HideItemCompleteltDiv}>?</div>
//             )}
//             <p className={stx.Paragraph}>{word}</p>
//             {hide && <div className={stx.HideThisStuff}></div>}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

const ImageDataComponent = ({ data, HiddenItems, HideOrShowText }) => {
  const [hide, SetHide] = useState(false);
  const [imageHidden, SetimageHidden] = useState(false);
  useEffect(() => {
    if (HiddenItems.includes("image")) {
      SetimageHidden(true);
    } else {
      SetimageHidden(false);
    }
    if (HiddenItems.includes(data?.hints)) {
      SetHide(true);
    } else {
      SetHide(false);
    }
  }, []);
  return (
    <div className={stx.TopWrapper}>
      <h3
        className={stx.TopH3}
        onClick={() => {
          SetHide(!hide);
          HideOrShowText(data?.hints);
        }}
      >
        {data?.hints}
        {hide && <div className={stx.HideThisStuffHint}></div>}
      </h3>

      <img
        className={stx.TopImageAvatar}
        src={imageHidden ? blank : data?.file}
        onClick={() => {
          HideOrShowText("image");
          SetimageHidden(!imageHidden);
        }}
        // src={data?.file}
      />
    </div>
  );
};

const BallonDataComponentDummy = ({
  data,
  SetorDeleteTestText,
  TestText,
  TextType,
  MainClickFunction,
  HiddenItems,
  HideOrShowText,
  selective,
  selected,
  SetNewSelectedBallon,
}) => {
  const [voiceImage, SetVoiceImage] = useState(female);
  const [hide, SetHide] = useState(false);
  const [VoiceHidden, SetVoiceHidden] = useState(false);

  useEffect(() => {
    if (data?.avatar === "male_voice") {
      SetVoiceImage(male);
    } else {
      SetVoiceImage(female);
    }
    if (HiddenItems?.includes(data.meaning)) {
      SetHide(true);
    } else {
      SetHide(false);
    }
  }, []);

  useEffect(() => {
    if (HiddenItems.includes("voice")) {
      SetVoiceHidden(true);
    } else {
      SetVoiceHidden(false);
    }
  }, []);
  return (
    <div className={stx.BottomWrapper}>
      <div className={stx.IndicateType}>{TextType} Test</div>
      {selective &&
        (selected ? (
          <button
            className={stx.SelectBtn_active}
            onClick={() => SetNewSelectedBallon(data.id)}
          >
            SELECTED
          </button>
        ) : (
          <button
            className={stx.SelectBtn}
            onClick={() => SetNewSelectedBallon(data.id)}
          >
            SELECT
          </button>
        ))}
      <button
        className={stx.AudioPlayButton}
        style={
          data?.avatar == "male_voice"
            ? { transform: "scale(-1, 1)" }
            : { transform: "scale(1)" }
        }
      >
        <img src={voiceImage} className={stx.SMImage} />
      </button>
      <div className={stx.IdeoGramsWrapper}>
        <h3 className={stx.BWHeading1}>{data?.meaning}</h3>
      </div>
      <MainIdeogramTestDummy
        text={data?.ideogram.replaceAll(/\s/g, "")} // This trims the text and removes all of the white spaces that exists in it
        pinText={data?.pronunciation.split(" ")} // This tri
      />
      {/* <MainPronounciationTestDummy text={data?.pronunciation} /> */}
    </div>
  );
};

// const MainIdeogramTestDummy = ({ text }) => {
//   return (
//     <div className={stx.IdeoGramsWrapper}>
//       {[...text]?.map((word, i) => {
//         return (
//           <div className={stx.IdeoGrams} key={i}>
//             <p className={stx.Paragraph}>{word}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

export const MainIdeogramTestDummy = ({ text, pinText }) => {
  const Non_punctuations = text.replace(/[^\p{L}\p{N}\p{Z}]/gu, "").trim();
  console.log(pinText);
  pinText = pinText.filter(function (item) {
    return item !== "";
  });
  var j = pinText.length;
  return (
    <div className={stx.IdeoGramsWrapper}>
      {[...text]?.map((word, i) => {
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
            pinText.unshift("new");
            console.log(pinText);
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

const UpdateTestEditedBallon = (id, bal_id, AccessToken) => {
  const url =
    BASEURL + "dialogue-test-balloon-select/" + id + "/" + bal_id + "/";
  axios
    .post(
      url,
      {},
      {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      }
    )
    .then((r) => {
      console.log(r);
    })
    .catch((e) => console.log(e));
};
