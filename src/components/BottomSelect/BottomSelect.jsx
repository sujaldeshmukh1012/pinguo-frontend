import React, { useEffect, useState } from "react";
import stx from "./BottomSelect.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import Sheet from "react-modal-sheet";
import { motion } from "framer-motion";
import book from "../../assets/icons/svg/course.svg";
import lesson from "../../assets/icons/svg/lesson.svg";
import dialogue from "../../assets/icons/svg/dialogue.svg";
import dialogue_group from "../../assets/icons/svg/dialogueGroup.svg";
import balloon from "../../assets/icons/svg/balloon.svg";
import word_card from "../../assets/icons/svg/wordCard.svg";
import note from "../../assets/icons/svg/note.svg";
import pop_up from "../../assets/icons/svg/popUp.svg";
import image from "../../assets/icons/svg/image.svg";
import AddModal from "../AddModal/AddModal";
function BottomSelect({
  toggleAddModal,
  home,
  AccessToken,
  UserId,
  AfterSuccessFunction,
  Parent_Course,
  Parent_Lesson,
}) {
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [ModalTitle, setModalTitle] = useState("Course Title");
  const [ModalType, setModalType] = useState(0);
  const [ImportedData, setImportedData] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const ToggleAddModal = (type) => {
    setAddModalOpen(!AddModalOpen);
    setModalType(type);
    switch (type) {
      case 0:
        setModalTitle("Course Title");
        break;
      case 1:
        setModalTitle("Edit Course Title");
        break;
      case 2:
        setModalTitle("Lesson Title");
        break;
      case 3:
        setModalTitle("Edit Lesson Title");
        break;
      case 4:
        setModalTitle("Word Card Title");
        break;
      case 5:
        setModalTitle("Edit Word Card Title");
        break;
      default:
        setModalTitle("Title");
    }
  };

  const options = [
    {
      id: 0,
      title: "Course",
      image: book,
      func: () => ToggleAddModal(0),
    },
    {
      id: 1,
      title: "Lesson",
      image: lesson,
      func: () => ToggleAddModal(2),
    },
    {
      id: 2,
      title: "Dialogue group",
      image: dialogue_group,
      func: () => console.log(""),
    },
    {
      id: 3,
      title: "Dialogue",
      image: dialogue,
      func: () => console.log(""),
    },
    {
      id: 4,
      title: "Image",
      image: image,
      func: () => console.log(""),
    },
    {
      id: 5,
      title: "Ballon",
      image: balloon,
      func: () => console.log(""),
    },
    {
      id: 6,
      title: "Word Card",
      image: word_card,
      func: () => ToggleAddModal(4),
    },
    {
      id: 7,
      title: "Pop Up",
      image: pop_up,
      func: () => console.log(""),
    },
    {
      id: 8,
      title: "Note",
      image: note,
      func: () => console.log(""),
    },
  ];
  return (
    <>
      <div className={stx.BottomSelect}>
        {!home && (
          <button
            className={stx.BSBBackButton}
            onClick={() => {
              window.history.back();
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={stx.BottomSelectButtonIcon}
            />
          </button>
        )}
        <button
          className={stx.BottomSelectButton}
          onClick={() => setOpen(!isOpen)}
        >
          <FontAwesomeIcon
            style={{
              transform: isOpen ? "rotateZ(45deg)" : "rotateZ(0deg)",
            }}
            icon={faPlus}
            className={stx.BottomSelectButtonIcon}
          />
        </button>
      </div>
      {isOpen && (
        <MainModal toggleAddModal={toggleAddModal} setOpen={setOpen}>
          {options?.map((item, i) => {
            return (
              <OptionChip
                title={item?.title}
                image={item?.image}
                id={item?.id}
                onChipPress={() => {
                  item.func();
                  setOpen(false);
                }}
              />
            );
          })}
        </MainModal>
      )}
      {AddModalOpen && (
        <AddModal
          toggle={ToggleAddModal}
          type={ModalType}
          AccessToken={AccessToken}
          UserId={UserId}
          title={ModalTitle}
          Parent_Course={Parent_Course}
          Parent_Lesson={Parent_Lesson}
          AfterSuccessFunction={AfterSuccessFunction}
          data={null}
        />
      )}
    </>
  );
}

export default BottomSelect;

const variantModal = {
  initial: { y: 10, opacity: 0 },
  final: { y: 0, opacity: 1 },
};

const OptionChip = ({ onChipPress, title, image }) => {
  return (
    <button className={stx.ModalOptionButton} onClick={onChipPress}>
      <img src={image} className={stx.MOBImage} />
      <h2 className={stx.ModalOptionTitle}>{title}</h2>
    </button>
  );
};

export const MainModal = ({ setOpen, children }) => {
  return (
    <motion.div
      className={stx.MainModalWrapper}
      initial={"initial"}
      animate={"final"}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        onClick={() => setOpen(false)}
        className={stx.QuitModalOverlay}
      ></motion.div>
      <motion.div variants={variantModal} className={stx.InnerDiv}>
        {children}
      </motion.div>
    </motion.div>
  );
};
