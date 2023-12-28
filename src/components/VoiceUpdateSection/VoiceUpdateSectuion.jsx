import React, { useState } from "react";
import {
  ElevatedModal,
  FileSelect,
  ImageBoxSelect,
  VoiceSelect,
} from "../AddModal/AddModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import stx from "./VoiceUpdateSection.module.css";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import maleAvatar from "../../assets/male_whole_voice.png";
import femaleAvatar from "../../assets/female_whole_voice.png";
import hanziText from "../../assets/hanzi-text.png";
import { BASEURL } from "../../connections/BASEURL";
import axios from "axios";
function VoiceUpdateSection({
  toggle,
  data,
  AccessToken,
  AfterSuccessFunction,
}) {
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [MaleFile, SetMaleFile] = useState(false);
  const [FemaleFile, SetFemaleFile] = useState(false);

  const PostData = () => {
    const url = BASEURL + "word-upload/" + data?.dictionary?.id + "/";
    var f_body = new FormData();
    f_body.append("id", data?.dictionary?.id);
    f_body.append("male_voice", MaleFile);
    f_body.append("female_voice", FemaleFile);
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
                  value={data?.dictionary.ideogram}
                />
              </div>
            </div>
            <VoiceSelect
              name={"female_voice"}
              image={femaleAvatar}
              GetAudioFile={(e) => SetFemaleFile(e)}
              title={data.dictionary.female_voice}
            />
            <VoiceSelect
              name={"male_voice"}
              image={maleAvatar}
              GetAudioFile={(e) => SetMaleFile(e)}
              title={data.dictionary.male_voice}
            />
            <button
              type="submit"
              className={stx.IDSubmitButton}
              onClick={() => PostData()}
            >
              SAVE
            </button>
          </div>
        )}
      </div>
    </ElevatedModal>
  );
}

export default VoiceUpdateSection;

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

export function HanziUpdateSection({
  toggle,
  AccessToken,
  data,
  AfterSuccessFunction,
}) {
  const [uplaoding, SetUploading] = useState(false);
  const [uplaodingError, SetUploadingError] = useState(false);
  const [ImageFile, SetImageFIle] = useState(null);
  const [VideoFIle, SetVideoFIle] = useState(null);

  const PostData = () => {
    const url = BASEURL + "hanzi-actions/" + data?.word + "/";
    console.log(url);
    var f_body = new FormData();
    f_body.append("id", data?.id);
    f_body.append("image", ImageFile);
    f_body.append("video", VideoFIle);
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
                <input className={stx.InfoChooseSelectGrey} value={"学习"} />
              </div>
            </div>

            <ImageBoxSelect
              image={hanziText}
              label={"Image File"}
              type={"image/*"}
              for_={"image_upload"}
              GetAudioFile={(e) => SetImageFIle(e)}
            />
            <FileSelect
              image={hanziText}
              label={"Video File"}
              type={"video/*"}
              for_={"video_upload"}
              GetAudioFile={(e) => SetVideoFIle(e)}
            />

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
