import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import MobileSizeDiv from "../../components/MobileSizeDiv/MobileSizeDiv";
import BottomSelect from "../../components/BottomSelect/BottomSelect";
import stx from "./HanziWordPage.module.css";
import WordCard from "../../components/WordCard/WordCard";
import { useParams } from "react-router-dom";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import {
  ErrorHandler,
  ExtractLocalDetails,
  LoadingIndicator,
} from "../HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import wordCard from "../../assets/icons/svg/wordCard.svg";
import HanziCard from "../../components/HanziCard/HanziCard";
function HanziWordPage() {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [HanziCardDetails, SetHanziCardDetails] = useState([]);
  const { hanziWord } = useParams();
  console.log(hanziWord);
  const FetchHanziCardDetails = async (token) => {
    setLoading(true);
    setError(false);
    var ecoded_word = encodeURIComponent(hanziWord);
    var decoded_word = decodeURIComponent(ecoded_word);
    var url = BASEURL + "hanzi-actions/" + decoded_word + "/";
    console.log(url);
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      var card = response.data;
      SetHanziCardDetails(card);
      setLoading(false);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetUserId(data.userId);
      SetAccessToken(data.accessToken);
      SetRefreshToken(data.refreshToken);
      FetchHanziCardDetails(data.accessToken);
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className={stx.HanziWordPage}>
      <NavBar
        title={Loading ? "Loading..." : Error ? "An Error Occured" : hanziWord}
        icon={wordCard}
      />
      <MobileSizeDiv>
        <div className={stx.WordCardWrapper}>
          {Loading ? (
            <LoadingIndicator />
          ) : Error ? (
            <ErrorHandler Action={() => FetchHanziCardDetails(AccessToken)} />
          ) : (
            HanziCardDetails?.map((item, i) => {
              return (
                <HanziCard
                  key={i}
                  data={item}
                  AccessToken={AccessToken}
                  AfterSuccessFunction={() =>
                    FetchHanziCardDetails(AccessToken)
                  }
                />
              );
            })
          )}
        </div>
        <BottomSelect />
      </MobileSizeDiv>
    </div>
  );
}

export default HanziWordPage;
