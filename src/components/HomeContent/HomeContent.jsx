import React, { useEffect, useState } from "react";
import stx from "./HomeContent.module.css";
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import courseBook from "../../assets/icons/svg/course.svg";
import edit from "../../assets/icons/svg/edit.svg";
import duplicate from "../../assets/icons/svg/duplicate.svg";
import drawOut from "../../assets/icons/svg/drawOut.svg";
import hide from "../../assets/icons/svg/hide.svg";
import preview from "../../assets/icons/svg/preview.svg";
import delete_img from "../../assets/icons/svg/delete.svg";

function HomeContent({
  CourseList,
  loading,
  error,
  AccessToken,
  UserId,
  AfterSuccessFunction,
}) {
  const [modalOpen, SetModalOpen] = useState(false);
  const [SelectedCourse, SetSelectedCourse] = useState(null);
  const [DuplicationError, SetDuplicationError] = useState(false);
  const [UpdatedList, SetUpdatedList] = useState([]);
  const ToggleModal = (data = null) => {
    SetModalOpen(!modalOpen);
    SetSelectedCourse(data);
  };
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const ToggleAddModal = () => {
    setAddModalOpen(!AddModalOpen);
    SetModalOpen(false);
  };
  const [DeleteModal, setDeleteModal] = useState(false);
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
    var url = BASEURL + "course-actions-duplicate/" + SelectedCourse.id + "/";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",SelectedCourse
      },
      // referrerPolicy: "unsafe-url",
      body: JSON.stringify({
        title: SelectedCourse.title,
        author: UserId,
      }),
    });
    const isSuccessful = resp.ok;
    if (isSuccessful) {
      const data = await resp.json();
      AfterSuccessFunction(AccessToken);
      ToggleModal(null);
    } else {
      SetDuplicationError(true);
      setInterval(() => {
        SetDuplicationError(false);
      }, 5000);
    }
  };

  const DeleteAction = async () => {
    var url = BASEURL + "course-actions/" + SelectedCourse.id + "/";
    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",
      },
      // referrerPolicy: "unsafe-url",
    });
    AfterSuccessFunction(AccessToken);
    setDeleteModal(false);
    SetModalOpen(false);
  };
  useEffect(() => {
    SetUpdatedList(CourseList);
  }, [CourseList]);
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(UpdatedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    SetUpdatedList(items);
    var url = BASEURL + "update/courses/";
    UpdateIndexInTheBackend(items, AccessToken, url);
  };
  return (
    <div className={stx.HomeContent}>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorHandler Action={() => AfterSuccessFunction(AccessToken)} />
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className={stx.ListUl}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {UpdatedList.map((item, index) => {
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
                          <CourseChip ToggleModal={ToggleModal} data={item} />
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
            OnActionSubmitForDuplicate={OnActionSubmitForDuplicate}
            ToggleDeleteModal={ToggleDeleteModal}
            error={DuplicationError}
          />
        </MainModal>
      )}
      {AddModalOpen && (
        <AddModal
          type={1}
          toggle={ToggleAddModal}
          AfterSuccessFunction={AfterSuccessFunction}
          AccessToken={AccessToken}
          UserId={UserId}
          title={"Edit Course Title"}
          prevVal={SelectedCourse.title}
          data={SelectedCourse}
        />
      )}
      {DeleteModal && (
        <ElevatedModal toggle={CloseDeleteModal}>
          <CourseDeleteMatter
            close={ToggleDeleteModal}
            SelectedCourse={SelectedCourse}
            DeleteAction={DeleteAction}
          />
        </ElevatedModal>
      )}
    </div>
  );
}

export default HomeContent;

const CourseChip = ({ ToggleModal, data }) => {
  return (
    <div className={stx.CourseChip}>
      <img src={courseBook} />
      <a href={"course/" + data?.id} className={stx.CCTitle}>
        {data?.title}
      </a>
      <button className={stx.CCButton} onClick={() => ToggleModal(data)}>
        <FontAwesomeIcon icon={faEllipsisV} className={stx.CCIcon} />
      </button>
    </div>
  );
};

const OptionActions = ({
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
        <Action title={"Edit"} icon={edit} toggle={ToggleAddModal} />
        <Action
          title={"Duplicate"}
          icon={duplicate}
          toggle={OnActionSubmitForDuplicate}
        />
        <Action title={"Darw Out"} icon={drawOut} />
        <Action title={"Hidden"} icon={hide} />
        <Action title={"Preview"} icon={preview} />
        <Action title={"Delete"} icon={delete_img} toggle={ToggleDeleteModal} />
      </div>
    </>
  );
};

const Action = ({ title, icon, toggle }) => {
  return (
    <button className={stx.ActionButton} onClick={() => toggle()}>
      <img src={icon} className={stx.ActionIcon} />
      <h4 className={stx.ActionTitle}>{title}</h4>
    </button>
  );
};

export const CourseDeleteMatter = ({ close, DeleteAction, SelectedCourse }) => {
  return (
    <div className={stx.CourseDeleteMatter}>
      <p className={stx.CDMParagraph}>Do you want to delete</p>
      <h4 className={stx.CDMTitle}>{SelectedCourse?.title}</h4>
      <button
        className={stx.CDMDeleteBtn}
        onClick={() => {
          DeleteAction();
        }}
      >
        Delete
      </button>
      <button
        className={stx.CDMCencelBtn}
        onClick={() => {
          close();
        }}
      >
        cancel
      </button>
    </div>
  );
};

export const UpdateIndexInTheBackend = async (array, AccessToken, url) => {
  var indexArray = [];
  array.map((item, i) => {
    indexArray.push(item.id);
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",
      },
      // referrerPolicy: "unsafe-url",
      body: JSON.stringify({
        list: indexArray,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};
