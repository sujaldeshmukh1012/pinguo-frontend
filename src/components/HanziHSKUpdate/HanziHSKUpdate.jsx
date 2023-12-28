import React, { useEffect, useState } from "react";
import { ElevatedModal } from "../AddModal/AddModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import stx from "./HanziHSKUpdate.module.css";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import { PostOrPutData } from "../../connections/MainFetch";
import axios from "axios";

function HanziHSKUpdate({ toggle, data, AccessToken, AfterSuccessFunction }) {
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [HSK_Data, SetHSK_Data] = useState(data?.HSK || 1);
  const [NoOfStrokes, SetNoOfStrokes] = useState(data?.strokes_no || 1);
  const [Category_Data, SetCategory_Data] = useState(
    data?.category || "Expressions"
  );
  const data_select = [
    { id: 1, title: "HSK 1" },
    { id: 2, title: "HSK 2" },
    { id: 3, title: "HSK 3" },
    { id: 4, title: "HSK 4" },
  ];

  const GetInfo_HSK = (data) => {
    SetHSK_Data(data);
  };
  const GetInfo_Category = (data) => {
    SetCategory_Data(data);
  };

  const data_select_category = [
    { id: "Numbers", title: "Numbers" },
    { id: "Places_&_Directions", title: "Places & Directions" },
    { id: "Time", title: "Time" },
    { id: "Verbs", title: "Verbs" },
    { id: "Adjectives_and_Adverbs", title: "Adjectives and Adverbs" },
    { id: "Expressions", title: "Expressions" },
    { id: "People_&_Things", title: "People & Things" },
    { id: "Measure_Words", title: "Measure Words" },
    { id: "Particles", title: "Particles" },
    { id: "Question_Words", title: "Question Words" },
    { id: "Pronouns", title: "Pronouns" },
    { id: "Conjunction", title: "Conjunction" },
    { id: "Grammar_point", title: "Grammar point" },
  ];
  const PostData = async () => {
    const url = BASEURL + "hanzi-actions/" + data?.word + "/";
    var f_body = new FormData();
    f_body.append("id", data?.dictionary?.id);
    f_body.append("strokes_no", NoOfStrokes);
    f_body.append("hsk", HSK_Data);
    console.log(f_body.get("id"));
    axios
      .put(url, f_body, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        SetUploading(false);
        AfterSuccessFunction(AccessToken);
      })
      .catch((e) => {
        console.log(e);
        SetUploading(false);
        SetUploadingError(true);
      });
  };

  return (
    <ElevatedModal toggle={toggle}>
      <div className={stx.MianWrapper}>
        <button className={stx.IDCrossButton} onClick={() => toggle()}>
          <FontAwesomeIcon icon={faTimes} className={stx.IDCrossButtonIcons} />
        </button>
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
        ) : (
          <div className={stx.ContentDiv}>
            <div className={stx.ChooseWrapper}>
              <div className={stx.InfoChooseInner}>
                <h3 className={stx.InfoChooseH3}>Ideograms</h3>
                <input className={stx.InfoChooseSelectGrey} value={data.word} />
              </div>
            </div>
            <SelectInfo
              GetInfo={GetInfo_HSK}
              array={data_select}
              title={"HSK"}
            />
            <div className={stx.InfoChooseInner}>
              <h3 className={stx.InfoChooseH3}>Number of Strokes</h3>
              <input
                className={stx.InfoChooseSelect}
                onChange={(e) => SetNoOfStrokes(e.target.value)}
                value={NoOfStrokes}
              />
            </div>
            <button
              type="submit"
              onClick={PostData}
              className={stx.IDSubmitButton}
            >
              SAVE
            </button>
          </div>
        )}
      </div>
    </ElevatedModal>
  );
}

export default HanziHSKUpdate;

const SelectInfo = ({ GetInfo, Info, array, title }) => {
  const [defInfo, SetDefInfo] = useState(Info);
  return (
    <div className={stx.ChooseWrapper}>
      <div className={stx.InfoChooseInner}>
        <h3 className={stx.InfoChooseH3}>{title}</h3>
        <select
          className={stx.InfoChooseSelect}
          value={defInfo}
          onChange={(e) => {
            GetInfo(e.target.value);
            SetDefInfo(e.target.value);
          }}
        >
          {array.map((item, i) => {
            return (
              <option value={item.id} key={i}>
                {item.title}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
