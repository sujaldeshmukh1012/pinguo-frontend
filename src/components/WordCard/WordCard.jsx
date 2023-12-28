import React, { useEffect, useState } from "react";
import stx from "./WordCard.module.css";
import WordCardVoiceSpeaking from "../WordCardVoiceSpeaking/WordCardVoiceSpeaking";
import HSKUpdateSection from "../HSKUpdateSection/HSKUpdateSection";
import CardInfoUpdateSection from "../CardInfoUpdateSection/CardInfoUpdateSection";
import VoiceUpdateSection from "../VoiceUpdateSection/VoiceUpdateSectuion";
import { BASEURL } from "../../connections/BASEURL";
import {
  VaidateJsonData,
  VaidateJsonDataForHanzi,
} from "../../connections/ValidateData";

function WordCard({ data, AccessToken, AfterSuccessFunction }) {
  const [HSKState, SetHSKState] = useState(false);
  const [CardInfoUpdateToggle, SetCardInfoUpdateToggle] = useState(false);
  const [VoiceUpdate, SetVoiceUpdate] = useState(false);
  const SetInfoUpdateToggle = () => {
    SetCardInfoUpdateToggle(!CardInfoUpdateToggle);
  };
  const ToggleVoiceUpdate = () => {
    SetVoiceUpdate(!VoiceUpdate);
  };
  return (
    <>
      <div className={stx.WordCard}>
        <p
          className={`${stx.LevelIndicator} ${
            !data.dictionary.HSK && stx.MAkeItRed
          }`}
          onClick={() => {
            SetHSKState(!HSKState);
          }}
        >
          HSK{data?.dictionary.HSK}
          {HSKState}
        </p>
        <h2
          onClick={() => {
            SetInfoUpdateToggle();
          }}
          className={`${stx.WordMeaning} ${
            !data.dictionary.meaning && stx.MAkeItRed
          }`}
        >
          {data?.dictionary?.meaning}
        </h2>
        <h4
          className={`${stx.WordSubtitle} ${
            !data.dictionary.subtitle && stx.MAkeItRed
          }`}
          onClick={() => {
            SetInfoUpdateToggle();
          }}
        >
          {data?.dictionary?.subtitle}
        </h4>
        <MainIdeogram text={data?.word} token={AccessToken} />
        <MainPronounciation text={data?.dictionary.pronunciation} />
        <WordCardVoiceSpeaking
          toggle={ToggleVoiceUpdate}
          maleVoice={data?.dictionary?.male_voice}
          femaleVoice={data?.dictionary?.female_voice}
        />
        <WordCardDescription
          text={data?.dictionary?.text}
          toggle={SetInfoUpdateToggle}
        />
        <WordCardLearnMoreBtn toggle={SetInfoUpdateToggle} />
      </div>
      {HSKState && (
        <HSKUpdateSection
          toggle={() => SetHSKState(false)}
          AccessToken={AccessToken}
          AfterSuccessFunction={AfterSuccessFunction}
          data={data}
        />
      )}
      {VoiceUpdate && (
        <VoiceUpdateSection
          toggle={() => ToggleVoiceUpdate(false)}
          AccessToken={AccessToken}
          AfterSuccessFunction={AfterSuccessFunction}
          data={data}
        />
      )}
      {CardInfoUpdateToggle && (
        <CardInfoUpdateSection
          toggle={() => SetCardInfoUpdateToggle(false)}
          AccessToken={AccessToken}
          AfterSuccessFunction={AfterSuccessFunction}
          data={data}
        />
      )}
    </>
  );
}

export default WordCard;

export const MainIdeogram = ({ text, token }) => {
  return (
    <div className={stx.IdeoGramsWrapper}>
      {[...text]?.map((word, i) => {
        return <MainIdeoGramSingle word={word} key={i} token={token} />;
      })}
    </div>
  );
};

const MainIdeoGramSingle = ({ word, token }) => {
  const [is_red, SetIs_red] = useState(false);
  useEffect(() => {
    fetch(BASEURL + "hanzi-actions/" + word + "/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        var isred = VaidateJsonDataForHanzi(r[0]);
        console.log(isred);
        SetIs_red(isred);
      });
  }, []);
  return (
    <a
      href={"/hanzi/" + word}
      className={is_red ? stx.IdeoGrams_red : stx.IdeoGrams}
    >
      <p className={stx.Paragraph}>{word}</p>
    </a>
  );
};

export const MainPronounciation = ({ text }) => {
  return (
    <div className={stx.IdeoGramsWrapperLower}>
      {text.split(" ")?.map((word, i) => {
        return (
          <div className={stx.Pronounciations} key={i}>
            <p className={stx.Paragraph}>{word}</p>
          </div>
        );
      })}
    </div>
  );
};

const WordCardDescription = ({ text, toggle }) => {
  return (
    <div className={stx.WordCardDescription} onClick={() => toggle()}>
      <p className={stx.WordCardDescriptionParagraph}>{text}</p>
    </div>
  );
};

const WordCardLearnMoreBtn = ({ toggle }) => {
  return (
    <div className={stx.WordCardLearnMoreBtnWrapper} onClick={() => toggle()}>
      <button className={stx.WordCardLearnMoreBtn}>LEARN MORE</button>
    </div>
  );
};
