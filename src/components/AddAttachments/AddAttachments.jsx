import React, { useEffect, useState } from "react";
import stx from "./AddAttachments.module.css";
import { FetchCoursesOrLesson } from "../../connections/MainFetch.js";
import { BASEURL } from "../../connections/BASEURL";
function AddAttachments({
  data,
  ToggleAttachments,
  AccessToken,
  UserId,
  Parent_Lesson,
  AfterSuccessFunction,
}) {
  const [selectedTypes, SetSelectedTypes] = useState("Popup");
  const [PopupData, SetPopupData] = useState([]);
  const AddorRemoveType = (type) => {
    if (selectedTypes === type) {
      SetSelectedTypes("");
    } else {
      SetSelectedTypes(type);
    }
  };

  return (
    <div className={stx.AttachmentWrapper}>
      <h3 className={stx.AddAttachmentHeader}>Select Attachments</h3>
      <div className={stx.TopHorizontalScrollDiv}>
        <Chip
          title={"Popup"}
          AddorRemoveType={AddorRemoveType}
          active={selectedTypes === "Popup"}
        />
        <Chip
          title={"Note"}
          AddorRemoveType={AddorRemoveType}
          active={selectedTypes === "Note"}
        />
        <Chip
          title={"Label"}
          AddorRemoveType={AddorRemoveType}
          active={selectedTypes === "Label"}
        />
      </div>
      <PopupContent
        PopupData={PopupData}
        SetPopupData={SetPopupData}
        data={data}
        Parent_Lesson={Parent_Lesson}
        AccessToken={AccessToken}
        AfterSuccessFunction={AfterSuccessFunction}
        UserId={UserId}
        contentIndex={
          selectedTypes === "Note" ? 0 : selectedTypes === "Popup" ? 1 : 2
        }
      />
      <button onClick={ToggleAttachments} className={stx.ConfirmButton}>
        Confirm
      </button>
    </div>
  );
}

export default AddAttachments;

const PopupContent = ({
  PopupData,
  SetPopupData,
  data,
  AccessToken,
  UserId,
  Parent_Lesson,
  AfterSuccessFunction,
  contentIndex,
}) => {
  const [Loading, setLoading] = useState(true);
  const FetchLessonAttcahments = (token, url) => {
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp);
        SetPopupData(resp);
      });
  };

  useEffect(() => {
    if (PopupData.length === 0) {
      setLoading(true);
      const url = BASEURL + "lesson-attachments/" + Parent_Lesson + "/";
      const result = FetchLessonAttcahments(AccessToken, url);
      console.log(result);
    }
  }, []);
  return (
    <div className={stx.ContentDiv}>
      {PopupData.length === 0 ? (
        <ContentLoading />
      ) : (
        PopupData[contentIndex || 0].map((item, i) => {
          return (
            <ContentChip
              data={item}
              key={i}
              attachTo={data}
              token={AccessToken}
              type={contentIndex}
            />
          );
        })
      )}
    </div>
  );
};

const ContentChip = ({ data, attachTo, token, type }) => {
  const [selected, SetSelected] = useState(false);
  const AttachThisContent = () => {
    SetSelected(!selected);
    const body = get_body(type, attachTo, data);
    const url = BASEURL + "wordcard-update/" + attachTo.id + "/";
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json; charset=UTF-8",
      },
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .then((resp) => console.log(resp))
      .catch((error) => {
        alert("An Error occured, refresh the page");
      });
  };
  return (
    <div
      className={
        selected ? stx.ContentCHipWrapperSelected : stx.ContentCHipWrapper
      }
      onClick={() => AttachThisContent()}
    >
      {data.title}
    </div>
  );
};

const ContentLoading = () => {
  return (
    <div className={stx.ContentLoadingChipWrapper}>
      <div className={stx.ContentLoadingChiplarge}></div>
      <div className={stx.ContentLoadingChipmedium}></div>
      <div className={stx.ContentLoadingChipmedium}></div>
      <div className={stx.ContentLoadingChipsmall}></div>
      <div className={stx.ContentLoadingChiplarge}></div>
    </div>
  );
};

const Chip = ({ title, AddorRemoveType, active }) => {
  return (
    <div
      className={active ? stx.ChipWrapperActive : stx.ChipWrapper}
      onClick={() => AddorRemoveType(title)}
    >
      {title}
    </div>
  );
};

const get_url = (data) => {
  console.log(data);
  if (data.info_type === "word_card") {
    return BASEURL + "wordcard-options/" + data.id + "/";
  } else if (data.info_type === "dialogue_group") {
    return BASEURL + "dialogue-group-actions/" + data.id + "/";
  } else if (data.info_type === "note") {
    return BASEURL + "alert-notes-action/";
  }
};

const get_body = (type, data, object) => {
  var arr = data;
  if (type === 0) {
    if (arr.note_linked.indexOf(object.id) === -1) {
      arr.note_linked.push(object.id);
    }
  } else if (type === 1) {
    if (arr.popup_linked.indexOf(object.id) === -1) {
      arr.popup_linked.push(object.id);
    }
  } else if (type === 2) {
    if (arr.label_linked.indexOf(object.id) === -1) {
      arr.label_linked.push(object.id);
    }
  }
  console.log(arr);
  return arr;
};
