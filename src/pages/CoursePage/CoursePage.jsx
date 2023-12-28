import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import HomeContent from "../../components/HomeContent/HomeContent";
import MobileSizeDiv from "../../components/MobileSizeDiv/MobileSizeDiv";
import BottomSelect from "../../components/BottomSelect/BottomSelect";
import stx from "./CoursePage.module.css";
import AddModal from "../../components/AddModal/AddModal";
import CourseContent from "../../components/CourseContent/CourseContent";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import course from "../../assets/icons/svg/course.svg";

import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import PageArrangement from "../../connections/PageArrangement";
function CoursePage() {
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [LessonList, SetLessonList] = useState([]);
  const [UserId, SetUserId] = useState(null);
  const [AccessToken, SetAccessToken] = useState(null);
  const [RefreshToken, SetRefreshToken] = useState(null);
  const [Title, SetTitle] = useState("");
  const { courseId } = useParams();

  const FetchCourseTitle = async (courseId, token) => {
    var url = BASEURL + "courses/" + courseId;
    const resp = await fetch(url, {
      headers: { Authorization: "Bearer " + token },
      // referrerPolicy: "unsafe-url",
    });
    const isSuccess = resp.ok;
    const RespData = await resp.json();
    if (isSuccess) {
      var data = {
        status: true,
        title: RespData["title"],
        id: RespData.id,
      };
      SetTitle(data.title);
      return data;
    } else {
      SetTitle("Lesson");
    }
  };

  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetUserId(data.userId);
      SetAccessToken(data.accessToken);
      SetRefreshToken(data.refreshToken);
      FetchLessons(data.accessToken, courseId);
      FetchCourseTitle(courseId, data.accessToken);
    } else {
      window.location.href = "login";
    }
  }, []);
  const ToggleAddModal = () => {
    setAddModalOpen(!AddModalOpen);
  };

  const FetchLessons = async (token, courseId) => {
    setLoading(true);
    setError(false);
    var url = BASEURL + "lessons/" + courseId;
    const response = await FetchCoursesOrLesson(token, url);
    if (response.status) {
      SetLessonList(response.data);
      PageArrangement(
        "change-lesson-arrangement/" + courseId + "/",
        token,
        response.data
      );
      setLoading(false);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const AddLesson = async (title) => {
    console.log(title);
    var url = BASEURL + "lessons-actions/" + 0 + "/";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",
      },
      // referrerPolicy: "unsafe-url",
      body: JSON.stringify({
        title: title,
        author: UserId,
        parent_course: courseId,
      }),
    });
    const isSuccessful = resp.ok;
    if (isSuccessful) {
      const data = await resp.json();
      FetchLessons(courseId, AccessToken);
      setAddModalOpen(false);
    }
  };
  return (
    <div className={stx.CoursePage}>
      <NavBar title={Title} icon={course} />
      <MobileSizeDiv>
        <CourseContent
          LessonList={LessonList}
          loading={Loading}
          error={Error}
          AccessToken={AccessToken}
          AfterSuccessFunction={FetchLessons}
          UserId={UserId}
          Parent_Course={courseId}
        />
        <BottomSelect
          AfterSuccessFunction={FetchLessons}
          allowedActions={["Lesson"]}
          ActionType={1}
          AccessToken={AccessToken}
          UserId={UserId}
          Parent_Course={courseId}
        />
        {AddModalOpen && (
          <AddModal
            toggle={ToggleAddModal}
            title={" Lesson Title"}
            Action={AddLesson}
          />
        )}
      </MobileSizeDiv>
    </div>
  );
}

export default CoursePage;
