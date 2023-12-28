import React, { useEffect, useState } from "react";
import stx from "./HanziCard.module.css";
import hanziImg from "../../assets/hanziImgRed.png";
import VoiceUpdateSection, {
  HanziUpdateSection,
} from "../VoiceUpdateSection/VoiceUpdateSectuion";
import HSKUpdateSection from "../HSKUpdateSection/HSKUpdateSection";
import CardInfoUpdateSection from "../CardInfoUpdateSection/CardInfoUpdateSection";
import HanziUpdateModal from "../HanziUpdate/HanziUpdate";
import HanziHSKUpdate from "../HanziHSKUpdate/HanziHSKUpdate";

function HanziCard({ data, AfterSuccessFunction, AccessToken }) {
  const [HanziUpdate, SetHanziUpdate] = useState(false);
  const [HSKState, SetHSKState] = useState(false);
  const [CardInfoUpdateToggle, SetCardInfoUpdateToggle] = useState(false);
  const SetInfoUpdateToggle = () => {
    SetCardInfoUpdateToggle(!CardInfoUpdateToggle);
  };
  const ToggleHanziUpdate = () => {
    SetHanziUpdate(!HanziUpdate);
  };

  return (
    <>
      <div className={stx.WordCard}>
        <div className={stx.CardLabel}>HANZI CARD</div>
        <p
          className={`${stx.LevelIndicator} ${!data.hsk && stx.MAkeItRed}`}
          onClick={() => {
            SetHSKState(!HSKState);
          }}
        >
          HSK {data.hsk || "?"}
        </p>
        <h2
          onClick={() => {
            SetInfoUpdateToggle();
          }}
          className={`${stx.WordMeaning} ${!data.meaning && stx.MAkeItRed}`}
        >
          {data?.meaning || "???"}
        </h2>
        <h4
          onClick={() => {
            SetInfoUpdateToggle();
          }}
          className={`${stx.WordSubtitle} ${!data.subtitle && stx.MAkeItRed}`}
        >
          {data?.subtitle || "???"}
        </h4>
        <HanziWord toggle={ToggleHanziUpdate} data={data} />
        <p
          onClick={() => {
            SetInfoUpdateToggle();
          }}
          className={`${stx.WordPinyin} ${!data.pinyin && stx.MAkeItRed}`}
        >
          {data?.pinyin || "???"}
        </p>
        <p
          onClick={() => {
            SetInfoUpdateToggle();
          }}
          className={`${stx.WordInfo} ${!data.description && stx.MAkeItRed}`}
        >
          {data?.description}
        </p>
        <h6
          onClick={() => {
            SetInfoUpdateToggle();
          }}
          className={`${stx.WordDarkH6} ${!data.description && stx.MAkeItRed}`}
        >
          {data?.sub_description || "???"}
        </h6>
      </div>
      {HanziUpdate && (
        <HanziUpdateSection
          toggle={ToggleHanziUpdate}
          AccessToken={AccessToken}
          AfterSuccessFunction={AfterSuccessFunction}
          data={data}
        />
      )}
      {HSKState && (
        <HanziHSKUpdate
          toggle={() => SetHSKState(false)}
          AccessToken={AccessToken}
          AfterSuccessFunction={AfterSuccessFunction}
          data={data}
        />
      )}
      {CardInfoUpdateToggle && (
        <HanziUpdateModal
          toggle={() => SetCardInfoUpdateToggle(false)}
          AccessToken={AccessToken}
          AfterSuccessFunction={AfterSuccessFunction}
          data={data}
        />
      )}
    </>
  );
}

export default HanziCard;

const HanziWord = ({ toggle, data }) => {
  return (
    <div className={stx.HanziWordWrapper}>
      <img
        className={stx.HanziWordImage}
        src={data.image || hanziImg}
        onClick={() => toggle()}
      />
    </div>
  );
};
