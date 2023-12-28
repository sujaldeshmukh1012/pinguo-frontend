import React, { useEffect, useState } from "react";
import stx from "./NavBar.module.css";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../connections/BASEURL";
import { ExtractLocalDetails, Logout } from "../../pages/HomePage/HomePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faOutdent,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import HomeImg from "../../assets/icons/svg/home.svg";
import course from "../../assets/icons/svg/course.svg";
function NavBar({ login, home, title, icon }) {
  const { courseId, lessonId, wordCardId } = useParams();
  const params = useParams();
  const [AccessToken, SetAccessToken] = useState(null);
  const [ImageToShow, SetImageToShow] = useState(course);
  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetAccessToken(data.accessToken);
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
      {!home && !login && <img src={icon} className={stx.ImageIndicator} />}
      <h2 className={stx.NavHeading}>{title}</h2>
      {!login && (
        <button className={stx.LogoutBtn} onClick={() => Logout()}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      )}
    </div>
  );
}

export default NavBar;
