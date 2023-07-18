import React, { useEffect, useState } from "react";
import stx from "./WordCard.module.css";
import WordCardVoiceSpeaking from "../WordCardVoiceSpeaking/WordCardVoiceSpeaking";

function WordCard({ data }) {
  console.log(data);
  return (
    <div className={stx.WordCard}>
      <p className={stx.LevelIndicator}>HSK{data?.dictionary.HSK}</p>
      <h2 className={stx.WordMeaning}>{data?.dictionary?.meaning}</h2>
      <h4 className={stx.WordSubtitle}>{data?.dictionary?.subtitle}</h4>
      <MainIdeogram text={data?.word} />
      <MainPronounciation text={data?.dictionary.pronunciation} />
      <WordCardVoiceSpeaking
        maleVoice={data?.dictionary?.male_voice}
        femaleVoice={data?.dictionary?.female_voice}
      />
      <WordCardDescription text={data?.dictionary?.text} />
      <WordCardLearnMoreBtn />
    </div>
  );
}

export default WordCard;

const MainIdeogram = ({ text }) => {
  return (
    <div className={stx.IdeoGramsWrapper}>
      {[...text]?.map((word, i) => {
        return (
          <div className={stx.IdeoGrams} key={i}>
            <p className={stx.Paragraph}>{word}</p>
          </div>
        );
      })}
    </div>
  );
};

const MainPronounciation = ({ text }) => {
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

const WordCardDescription = ({ text }) => {
  return (
    <div className={stx.WordCardDescription}>
      <p className={stx.WordCardDescriptionParagraph}>{text}</p>
    </div>
  );
};

const WordCardLearnMoreBtn = () => {
  return (
    <div className={stx.WordCardLearnMoreBtnWrapper}>
      <button className={stx.WordCardLearnMoreBtn}>LEARN MORE</button>
    </div>
  );
};
