import React, { useState } from "react";
import { ElevatedModal } from "../AddModal/AddModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import stx from "./CardInfoUpdateSection.module.css";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import axios from "axios";
function CardInfoUpdateSection({
  toggle,
  data,
  AfterSuccessFunction,
  AccessToken,
}) {
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);

  const [meaning, SetMeaning] = useState(data?.dictionary?.meaning || "");
  const [subtitle, SetSubtitle] = useState(data?.dictionary?.subtitle || "");
  const [text, SetText] = useState(data?.dictionary?.text || "");

  const PostData = () => {
    const url = BASEURL + "word-upload/" + data?.dictionary?.id + "/";
    var f_body = new FormData();
    f_body.append("id", data?.dictionary?.id);
    f_body.append("meaning", meaning);
    f_body.append("subtitle", subtitle);
    f_body.append("text", text);
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
                  className={stx.IDInputFieldGrey}
                  value={data?.dictionary?.ideogram}
                  disabled
                />
              </div>
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

export default CardInfoUpdateSection;

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
