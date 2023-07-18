import React, { useState } from "react";
import stx from "./AddModal.module.css";
import { motion } from "framer-motion";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASEURL } from "../../connections/BASEURL";

function AddModal({
  toggle,
  AfterSuccessFunction,
  title,
  prevVal,
  data,
  type,
  AccessToken,
  UserId,
  Parent_Course,
  Parent_Lesson,
}) {
  // types
  //      0 : Add Course
  //      1 : Update Course
  //      2 : Add Lesson
  //      3 : Update Lesson
  //      4:  Add Word Card
  //      5 : Update Word Card
  //      data : contains data of object that is to be updated

  const [inpVal, SetinpVal] = useState(prevVal || "");
  const [SubmitDisabled, SetSubmitDisabled] = useState(true);
  const handleInput = (e) => {
    SetinpVal(e.target.value);
    if (inpVal !== prevVal) {
      SetSubmitDisabled(false);
    } else {
      SetSubmitDisabled(true);
    }
  };
  const HandelSubmit = async (e) => {
    e.preventDefault();
    if (inpVal === prevVal) {
      return 0;
    }
    switch (type) {
      case 0:
        var url = BASEURL + "course-actions/" + 0 + "/";
        var method = "POST";
        var body = {
          title: inpVal,
          author: UserId,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Course);
        toggle();
        break;
      case 1:
        var url = BASEURL + "course-actions/" + data.id + "/";
        var method = "PUT";
        var body = {
          id: data.id,
          title: inpVal,
          author: UserId,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken);
        toggle();
        break;
      case 2:
        var url = BASEURL + "lessons-actions/" + 0 + "/";
        var method = "POST";
        var body = {
          title: inpVal,
          author: UserId,
          parent_course: Parent_Course,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Course);
        toggle();
        break;
      case 3:
        var url = BASEURL + "lessons-actions/" + data.id + "/";
        var method = "PUT";
        var body = {
          id: data.id,
          title: inpVal,
          author: UserId,
          parent_course: Parent_Course,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Course);
        toggle();
        break;
      case 4:
        var url = BASEURL + "wordcard-options/" + Parent_Lesson + "/";
        var method = "POST";
        var body = {
          words: inpVal,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      case 5:
        var url = BASEURL + "wordcard-options/" + Parent_Lesson + "/";
        var method = "PUT";
        var body = {
          words: inpVal,
          card_id: data?.id,
        };
        var resp = await MainFetchFunction(AccessToken, url, method, body);
        AfterSuccessFunction(AccessToken, Parent_Lesson);
        toggle();
        break;
      default:
        console.log("Failed....");
    }
  };
  return (
    <motion.div
      className={stx.AddModalWrapper}
      initial={"initial"}
      animate={"final"}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        onClick={() => toggle()}
        className={stx.QuitModalOverlay}
      ></motion.div>
      <motion.div variants={variantModal} className={stx.InnerDiv}>
        <button className={stx.IDCrossButton} onClick={() => toggle()}>
          <FontAwesomeIcon icon={faTimes} className={stx.IDCrossButtonIcons} />
        </button>
        <h2 className={stx.ID_h2}>{title || "Course Title"}</h2>
        <form
          className={stx.IDForm}
          method="post"
          onSubmit={(e) => {
            if (!SubmitDisabled) {
              HandelSubmit(e);
            }
          }}
        >
          <textarea
            type="text"
            value={inpVal}
            onChange={(e) => handleInput(e)}
            required={true}
            className={stx.IDInputField}
            placeholder={"Enter " + title || "Course Title"}
          />
          <button
            type="submit"
            className={stx.IDSubmitButton}
            disabled={SubmitDisabled}
          >
            SAVE
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddModal;
const variantModal = {
  initial: { y: 10, opacity: 0 },
  final: { y: 0, opacity: 1 },
};

export const ElevatedModal = ({ toggle, children }) => {
  return (
    <motion.div
      className={stx.AddModalWrapper}
      initial={"initial"}
      animate={"final"}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        onClick={() => toggle()}
        className={stx.QuitModalOverlay}
      ></motion.div>
      <motion.div variants={variantModal} className={stx.InnerDiv}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const MainFetchFunction = async (AccessToken, url, method, body) => {
  const resp = await fetch(url, {
    method: method,
    headers: {
      Authorization: "Bearer " + AccessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const isSuccessful = resp.ok;
  const response = await resp.json();
  if (isSuccessful) {
    return { status: true, data: response };
  } else {
    return { status: false };
  }
};
