import React, { useEffect, useState } from "react";
import { ElevatedModal } from "../AddModal/AddModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import stx from "./HSKUpdateSection.module.css";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import { PostOrPutData } from "../../connections/MainFetch";
import axios from "axios";

function HSKUpdateSection({ toggle, data, AccessToken, AfterSuccessFunction }) {
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [HSK_Data, SetHSK_Data] = useState(data?.dictionary?.HSK);
  const [Category_Data, SetCategory_Data] = useState(
    data?.dictionary?.category || "Expressions"
  );

  useEffect(() => {
    console.log(HSK_Data);
  }, [data]);
  const data_select = [1, 2, 3, 4];
  const GetInfo_HSK = (data) => {
    SetHSK_Data(data);
  };
  const GetInfo_Category = (data) => {
    SetCategory_Data(data);
  };

  const data_select_category = [
    "Numbers",
    "Places & Directions",
    "Time",
    "Verbs",
    "Adjectives and Adverbs",
    "Expressions",
    "People & Things",
    "Measure Words",
    "Particles",
    "Question Words",
    "Pronouns",
    "Conjunction",
    "Grammar point",
  ];
  const PostData = async () => {
    const url = BASEURL + "word-upload/" + data?.dictionary?.id + "/";
    var f_body = new FormData();
    f_body.append("id", data?.dictionary?.id);
    f_body.append("category", Category_Data);
    f_body.append("HSK", HSK_Data);
    console.log(f_body.get("id"));
    axios
      .put(url, f_body, {
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
                <input
                  className={stx.InfoChooseSelectGrey}
                  value={data.dictionary.ideogram}
                />
              </div>
            </div>
            <SelectInfo
              GetInfo={GetInfo_HSK}
              array={data_select}
              title={"HSK"}
              Info={HSK_Data}
              HSK
            />
            <SelectInfo
              GetInfo={GetInfo_Category}
              array={data_select_category}
              title={"Category"}
              Info={Category_Data}
            />
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

export default HSKUpdateSection;

const SelectInfo = ({ GetInfo, Info, array, title, HSK }) => {
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
              <option value={item} key={i}>
                {HSK && "HSK "}
                {item}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
