import React, { useState } from "react";
import { ElevatedModal } from "../AddModal/AddModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import stx from "./HanziUpdate.module.css";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import axios from "axios";
function HanziUpdateModal({ toggle, data, AfterSuccessFunction, AccessToken }) {
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);

  const [meaning, SetMeaning] = useState(data?.meaning || "");
  const [subtitle, SetSubtitle] = useState(data?.subtitle || "");
  const [text, SetText] = useState(data?.description || "");
  const [pinyin, SetPinyin] = useState(data?.pinyin || "");
  const [remember, SetrRemember] = useState(data?.sub_description || "");

  const PostData = () => {
    const url = BASEURL + "hanzi-actions/" + data?.word + "/";
    var f_body = new FormData();
    f_body.append("id", data?.id);
    f_body.append("meaning", meaning);
    f_body.append("subtitle", subtitle);
    f_body.append("description", text);
    f_body.append("pinyin", pinyin);
    f_body.append("sub_description", remember);
    console.log(f_body.get("pinyin"));
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
                  className={stx.IDInputFieldGrey}
                  value={data?.word}
                  disabled
                />
              </div>
            </div>
            <div className={stx.InfoChooseInner}>
              <h3 className={stx.InfoChooseH3}>Pinyin</h3>
              <input
                className={stx.IDInputField}
                value={pinyin}
                onChange={(e) => SetPinyin(e.target.value)}
              />
            </div>
            <div className={stx.InfoChooseInner}>
              <h3 className={stx.InfoChooseH3}>Meaning</h3>
              <input
                className={stx.IDInputField}
                onChange={(e) => SetMeaning(e.target.value)}
                value={meaning}
              />
            </div>
            <div className={stx.InfoChooseInner}>
              <h3 className={stx.InfoChooseH3}>Subtitle</h3>
              <textarea
                className={stx.BaloonTextArea}
                onChange={(e) => SetSubtitle(e.target.value)}
                value={subtitle}
              />
            </div>
            <div className={stx.InfoChooseInner}>
              <h3 className={stx.InfoChooseH3}>Text</h3>
              <textarea
                className={stx.BaloonTextArea}
                onChange={(e) => SetText(e.target.value)}
                value={text}
              />
            </div>
            <div className={stx.InfoChooseInner}>
              <h3 className={stx.InfoChooseH3}>Remember</h3>
              <textarea
                className={stx.BaloonTextArea}
                onChange={(e) => SetrRemember(e.target.value)}
                value={remember}
              />
            </div>
            <button
              type="submit"
              onClick={() => PostData()}
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

export default HanziUpdateModal;

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
