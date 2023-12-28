import React, { useEffect, useState, useRef } from "react";
import stx from "./WordCardVoiceSpeaking.module.css";
import male from "../../assets/male.png";
import female from "../../assets/female.png";
import male_empty from "../../assets/male_voice_empty.png";
import female_empty from "../../assets/female_voice_empty.png";
import ReactAudioPlayer from "react-audio-player";
import { BASEURL, BASEURL_Media } from "../../connections/BASEURL";

function WordCardVoiceSpeaking({ maleVoice, femaleVoice, toggle }) {
  const [MaleVoice, SetMaleVoice] = useState(null);
  const [FemaleVoice, SetFemaleVoice] = useState(null);
  useEffect(() => {
    SetMaleVoice(maleVoice);
    SetFemaleVoice(femaleVoice);
  }, []);
  return (
    <div className={stx.WordCardVoiceSpeaking} onClick={() => toggle()}>
      <SpeakingModuleFeMale voice={FemaleVoice} />
      <SpeakingModuleMale voice={MaleVoice} />
    </div>
  );
}

export default WordCardVoiceSpeaking;

export const SpeakingModuleFeMale = ({ voice }) => {
  const [PlayAudio, SetPlayAudio] = useState(false);
  return (
    <button className={stx.SpeakingModule} onClick={() => SetPlayAudio(true)}>
      <img
        src={voice === null ? female_empty : female}
        className={stx.SMImage}
      />
      {PlayAudio && (
        <ReactAudioPlayer
          src={voice}
          autoPlay
          onEnded={() => SetPlayAudio(false)}
        />
      )}
    </button>
  );
};
export const SpeakingModuleMale = ({ voice }) => {
  const [PlayAudio, SetPlayAudio] = useState(false);
  return (
    <button className={stx.SpeakingModule} onClick={() => SetPlayAudio(true)}>
      <img src={voice === null ? male_empty : male} className={stx.SMImage} />
      {PlayAudio && (
        <ReactAudioPlayer
          src={voice}
          autoPlay
          onEnded={() => SetPlayAudio(false)}
        />
      )}
    </button>
  );
};
