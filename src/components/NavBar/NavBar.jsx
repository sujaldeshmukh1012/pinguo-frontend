import React, { useEffect, useState } from "react";
import stx from "./NavBar.module.css";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";
import { ExtractLocalDetails } from "../../pages/HomePage/HomePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import HomeImg from "../../assets/icons/svg/home.svg";
import lesson from "../../assets/icons/svg/lesson.svg";
import course from "../../assets/icons/svg/course.svg";
import wordCard from "../../assets/icons/svg/wordCard.svg";
function NavBar({ login, home, title }) {
  const { courseId, lessonId, wordCardId } = useParams();
  const [AccessToken, SetAccessToken] = useState(null);
  const [ImageToShow, SetImageToShow] = useState(course);
  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetAccessToken(data.accessToken);
    } else {
      window.location.href = "login";
    }
    if (wordCardId === undefined) {
      if (lessonId === undefined) {
        SetImageToShow(course);
      } else {
        SetImageToShow(lesson);
      }
    } else {
      SetImageToShow(wordCard);
    }
  }, []);
  return (
    <div className={stx.NavBar}>
      {!home && !login ? (
        <a href="/" className={stx.BackToHomeBtn}>
          <img src={HomeImg} className={stx.BackToHomeBtnIcon} />
        </a>
      ) : (
        <></>
      )}
      {!home && !login && (
        <img src={ImageToShow} className={stx.ImageIndicator} />
      )}
      <h2 className={stx.NavHeading}>{title}</h2>
    </div>
  );
}

export default NavBar;
