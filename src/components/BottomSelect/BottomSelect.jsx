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
import labelImg from "../../assets/icons/label.png";
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
  allowedActions,
  UserId,
  AfterSuccessFunction,
  Parent_Course,
  Parent_Lesson,
  Parent_DialogueGroup,
  Parent_Dialogue,
  TestCardId,
  Parent_Dialogue_data,
  TestCardPage,
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
      case 6:
        setModalTitle("Dialogue Group Title");
        break;
      case 7:
        setModalTitle("Edit Dialogue Group Title");
        break;
      case 8:
        setModalTitle("Dialogue Title");
        break;
      case 9:
        setModalTitle("Edit Dialogue Title");
        break;
      case 100:
        setModalTitle("Create Wrong Answer");
        break;
      default:
        setModalTitle("Title");
    }
  };

  const options = [
    {
      id: 0,
      visible: allowedActions?.includes("Course"),
      title: "Course",
      image: book,
      func: () => ToggleAddModal(0),
    },
    {
      id: 1,
      title: "Lesson",
      image: lesson,
      visible: allowedActions?.includes("Lesson"),
      func: () => ToggleAddModal(2),
    },
    {
      id: 2,
      title: "Dialogue group",
      image: dialogue_group,
      visible: allowedActions?.includes("Dialogue group"),
      func: () => ToggleAddModal(6),
    },
    {
      id: 3,
      title: "Dialogue",
      image: dialogue,
      visible: allowedActions?.includes("Dialogue"),
      func: () => ToggleAddModal(8),
    },
    {
      id: 4,
      title: "Image",
      image: image,
      visible: allowedActions?.includes("Image"),
      func: () => ToggleAddModal(10),
    },
    {
      id: 5,
      title: "Ballon",
      image: balloon,
      visible: allowedActions?.includes("Ballon"),
      func: () => ToggleAddModal(12),
    },
    {
      id: 6,
      title: "Word Card",
      image: word_card,
      visible: allowedActions?.includes("Word Card"),
      func: () => ToggleAddModal(4),
    },
    {
      id: 7,
      title: "Pop Up",
      image: pop_up,
      visible: allowedActions?.includes("Pop Up"),
      func: () => ToggleAddModal(14),
    },
    {
      id: 8,
      title: "Note",
      image: note,
      visible: allowedActions?.includes("Note"),
      func: () => ToggleAddModal(13),
    },
    {
      id: 9,
      title: "Label",
      image: labelImg,
      visible: allowedActions?.includes("Label"),
      func: () => ToggleAddModal(15),
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
          onClick={() => {
            TestCardPage ? ToggleAddModal(100) : setOpen(!isOpen);
          }}
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
            if (item.visible) {
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
            }
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
          Parent_DialogueGroup={Parent_DialogueGroup}
          Parent_Dialogue={Parent_Dialogue}
          Parent_Dialogue_data={Parent_Dialogue_data}
          Parent_Lesson={Parent_Lesson}
          AfterSuccessFunction={AfterSuccessFunction}
          TestCardId={TestCardId}
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
