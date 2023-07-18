import React, { useEffect, useState, useRef } from "react";
import stx from "./WordCardVoiceSpeaking.module.css";
import male from "../../assets/male.png";
import female from "../../assets/female.png";
import ReactAudioPlayer from "react-audio-player";
import { BASEURL, BASEURL_Media } from "../../connections/BASEURL";

function WordCardVoiceSpeaking({ maleVoice, femaleVoice }) {
  const [MaleVoice, SetMaleVoice] = useState(null);
  const [FemaleVoice, SetFemaleVoice] = useState(null);
  useEffect(() => {
    SetMaleVoice(BASEURL_Media + maleVoice);
    SetFemaleVoice(BASEURL_Media + femaleVoice);
  }, []);
  return (
    <div className={stx.WordCardVoiceSpeaking}>
      <SpeakingModuleFeMale voice={FemaleVoice} />
      <SpeakingModuleMale voice={MaleVoice} />
    </div>
  );
}

export default WordCardVoiceSpeaking;

const SpeakingModuleFeMale = ({ voice }) => {
  const [PlayAudio, SetPlayAudio] = useState(false);
  return (
    <button className={stx.SpeakingModule} onClick={() => SetPlayAudio(true)}>
      <img src={female} className={stx.SMImage} />
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
const SpeakingModuleMale = ({ voice }) => {
  const [PlayAudio, SetPlayAudio] = useState(false);
  return (
    <button className={stx.SpeakingModule} onClick={() => SetPlayAudio(true)}>
      <img src={male} className={stx.SMImage} />
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
