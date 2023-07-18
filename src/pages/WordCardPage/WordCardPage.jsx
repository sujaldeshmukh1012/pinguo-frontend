import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import MobileSizeDiv from "../../components/MobileSizeDiv/MobileSizeDiv";
import BottomSelect from "../../components/BottomSelect/BottomSelect";
import stx from "./WordCardPage.module.css";
import WordCard from "../../components/WordCard/WordCard";
import { useParams } from "react-router-dom";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import {
  ErrorHandler,
  ExtractLocalDetails,
  LoadingIndicator,
} from "../HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";

function WordCardPage() {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [WordCardDetails, SetWordCardDetails] = useState([]);
  const [NavTitle, SetNavTitle] = useState("");
  const [Title, SetTitle] = useState("");
  const { wordCardId } = useParams();

  const FetchWordCardDetails = async (token) => {
    setLoading(true);
    setError(false);
    var url = BASEURL + "wordcard-details/" + wordCardId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      var card = response.data;
      SetWordCardDetails(card);
      SetNavTitle(
        card[0]?.dictionary?.meaning +
          " " +
          card[0]?.word +
          " " +
          card[0]?.dictionary?.pronunciation
      );
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
      FetchWordCardDetails(data.accessToken);
    } else {
      window.location.href = "login";
    }
  }, []);

  return (
    <div className={stx.WordCardPage}>
      <NavBar
        title={Loading ? "Loading..." : Error ? "An Error Occured" : NavTitle}
      />
      <MobileSizeDiv>
        <div className={stx.WordCardWrapper}>
          {Loading ? (
            <LoadingIndicator />
          ) : Error ? (
            <ErrorHandler Action={() => FetchWordCardDetails(AccessToken)} />
          ) : (
            WordCardDetails.map((item, i) => {
              return <WordCard key={i} data={item} />;
            })
          )}
        </div>
        <BottomSelect />
      </MobileSizeDiv>
    </div>
  );
}

export default WordCardPage;
