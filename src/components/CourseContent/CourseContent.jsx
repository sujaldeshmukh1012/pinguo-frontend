import React, { useState, useEffect } from "react";
import stx from "./CourseContent.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCopy,
  faEllipsisV,
  faExternalLink,
  faEye,
  faEyeSlash,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { MainModal } from "../BottomSelect/BottomSelect";
import AddModal, { ElevatedModal } from "../AddModal/AddModal";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import { BASEURL } from "../../connections/BASEURL";
import {
  CourseDeleteMatter,
  UpdateIndexInTheBackend,
} from "../HomeContent/HomeContent";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import lessonImg from "../../assets/icons/svg/lesson.svg";
function CourseContent({
  LessonList,
  loading,
  error,
  AccessToken,
  UserId,
  AfterSuccessFunction,
  Parent_Course,
}) {
  const [modalOpen, SetModalOpen] = useState(false);
  const [SelectedCourse, SetSelectedCourse] = useState(null);
  const [DuplicationError, SetDuplicationError] = useState(false);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [UpdatedList, SetUpdatedList] = useState([]);
  useEffect(() => {
    SetUpdatedList(LessonList);
  }, [LessonList]);
  const ToggleModal = (data = null) => {
    SetModalOpen(!modalOpen);
    SetSelectedCourse(data);
  };
  const ToggleAddModal = () => {
    setAddModalOpen(!AddModalOpen);
    SetModalOpen(false);
  };
  const ToggleDeleteModal = () => {
    setDeleteModal(!DeleteModal);
    SetModalOpen(false);
  };
  const CloseDeleteModal = () => {
    setDeleteModal(false);
    SetModalOpen(false);
  };

  const OnActionSubmitForDuplicate = async () => {
    SetDuplicationError(false);
    var url = BASEURL + "lessons-actions/" + 0 + "/";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: SelectedCourse.title,
        author: UserId,
        parent_course: Parent_Course,
      }),
    });
    const isSuccessful = resp.ok;
    if (isSuccessful) {
      const data = await resp.json();
      AfterSuccessFunction(AccessToken, Parent_Course);
      ToggleModal(null);
    } else {
      SetDuplicationError(true);
      setInterval(() => {
        SetDuplicationError(false);
      }, 5000);
    }
  };

  const DeleteAction = async () => {
    var url = BASEURL + "lessons-actions/" + SelectedCourse.id + "/";
    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",
      },
    });
    AfterSuccessFunction(AccessToken, Parent_Course);
    setDeleteModal(false);
    SetModalOpen(false);
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(UpdatedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    SetUpdatedList(items);
    var url = BASEURL + "update/lesson/";
    UpdateIndexInTheBackend(items, AccessToken, url);
  };
  return (
    <div className={stx.CourseContent}>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorHandler
          Action={() => AfterSuccessFunction(AccessToken, Parent_Course)}
        />
      ) : LessonList.length === 0 ? (
        <p>Add Lessons</p>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className={stx.ListUl}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {UpdatedList?.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={stx.ListLi}
                        >
                          <CourseChip
                            ToggleModal={ToggleModal}
                            data={item}
                            key={index}
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {modalOpen && (
        <MainModal setOpen={ToggleModal}>
          <OptionActions
            ToggleAddModal={ToggleAddModal}
            ToggleDeleteModal={ToggleDeleteModal}
            error={DuplicationError}
            OnActionSubmitForDuplicate={OnActionSubmitForDuplicate}
          />
        </MainModal>
      )}
      {AddModalOpen && (
        <AddModal
          toggle={ToggleAddModal}
          title={"Lesson Title"}
          prevVal={SelectedCourse.title}
          type={3}
          AfterSuccessFunction={AfterSuccessFunction}
          AccessToken={AccessToken}
          UserId={UserId}
          data={SelectedCourse}
          Parent_Course={Parent_Course}
        />
      )}
      {DeleteModal && (
        <ElevatedModal toggle={CloseDeleteModal}>
          <CourseDeleteMatter
            close={ToggleDeleteModal}
            DeleteAction={DeleteAction}
            SelectedCourse={SelectedCourse}
          />
        </ElevatedModal>
      )}
    </div>
  );
}

export default CourseContent;

const CourseChip = ({ ToggleModal, data }) => {
  return (
    <div className={stx.CourseChip}>
      <img src={lessonImg} className={stx.CourseChipImage} />
      <a
        href={data?.parent_course + "/lesson/" + data?.id}
        className={stx.CCTitle}
      >
        {data?.title}
      </a>
      <button className={stx.CCButton} onClick={() => ToggleModal(data)}>
        <FontAwesomeIcon icon={faEllipsisV} className={stx.CCIcon} />
      </button>
    </div>
  );
};

export const ContentChip = ({
  ToggleModal,
  data,
  url,
  children,
  iconImage,
}) => {
  return (
    <div className={stx.CourseChip}>
      <img src={iconImage.toString()} className={stx.CourseChipImage} />
      <a href={url.toString()} className={stx.CCTitle}>
        {children || title}
      </a>
      <button className={stx.CCButton} onClick={() => ToggleModal(data)}>
        <FontAwesomeIcon icon={faEllipsisV} className={stx.CCIcon} />
      </button>
    </div>
  );
};
// const CourseChip = ({ ToggleModal, data }) => {
//   return (
//     <div className={stx.CourseChip}>
//       <FontAwesomeIcon icon={faBook} className={stx.CCIcon} />
//       <a href={"course/" + data?.id} className={stx.CCTitle}>
//         {data?.title}
//       </a>
//       <button className={stx.CCButton} onClick={() => ToggleModal(data)}>
//         <FontAwesomeIcon icon={faEllipsisV} className={stx.CCIcon} />
//       </button>
//     </div>
//   );
// };

export const OptionActions = ({
  ToggleAddModal,
  ToggleDeleteModal,
  OnActionSubmitForDuplicate,
  error,
}) => {
  return (
    <>
      <div className={stx.OptionActions}>
        {" "}
        {error && (
          <h4 className={stx.DuplicationError}>
            Duplication failed, Data already exists
          </h4>
        )}
        <Action title={"Edit"} icon={faPen} toggle={ToggleAddModal} />
        <Action
          title={"Duplicate"}
          icon={faCopy}
          toggle={OnActionSubmitForDuplicate}
        />
        <Action title={"Darw Out"} icon={faExternalLink} />
        <Action title={"Hidden"} icon={faEyeSlash} />
        <Action title={"Preview"} icon={faEye} />
        <Action title={"Delete"} icon={faTrashAlt} toggle={ToggleDeleteModal} />
      </div>
    </>
  );
};

const Action = ({ title, icon, toggle }) => {
  return (
    <button className={stx.ActionButton} onClick={() => toggle()}>
      <FontAwesomeIcon icon={icon} className={stx.ActionIcon} />
      <h4 className={stx.ActionTitle}>{title}</h4>
    </button>
  );
};
