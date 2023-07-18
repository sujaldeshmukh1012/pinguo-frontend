import React, { useState, useEffect } from "react";
import stx from "./LessonPageContent.module.css";
import { BASEURL } from "../../connections/BASEURL";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import { ContentChip, OptionActions } from "../CourseContent/CourseContent";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import WordCard from "../../assets/icons/svg/wordCard.svg";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import {
  CourseDeleteMatter,
  UpdateIndexInTheBackend,
} from "../HomeContent/HomeContent";
import { MainModal } from "../BottomSelect/BottomSelect";
import AddModal, {
  ElevatedModal,
  MainFetchFunction,
} from "../AddModal/AddModal";
function LessonPageContent({
  WordCardsList,
  error,
  AccessToken,
  AfterSuccessFunction,
  UserId,
  loading,
  Parent_Lesson,
}) {
  const [modalOpen, SetModalOpen] = useState(false);
  const [SelectedCards, SetSelectedCards] = useState(null);
  const [DuplicationError, SetDuplicationError] = useState(false);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [UpdatedList, SetUpdatedList] = useState([]);

  useEffect(() => {
    SetUpdatedList(WordCardsList);
  }, [WordCardsList]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(UpdatedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    SetUpdatedList(items);
    var url = BASEURL + "update/wordcards/";
    UpdateIndexInTheBackend(items, AccessToken, url);
  };
  const ToggleModal = (data = null) => {
    SetModalOpen(!modalOpen);
    SetSelectedCards(data);
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
    var url = BASEURL + "wordcard-options/" + Parent_Lesson + "/";
    var method = "POST";
    var body = {
      words: SelectedCards.word,
    };
    var resp = await MainFetchFunction(AccessToken, url, method, body);
    AfterSuccessFunction(AccessToken, Parent_Lesson);
    ToggleModal();
  };
  const DeleteAction = async () => {
    var url = BASEURL + "wordcard-options/" + SelectedCards.id + "/";
    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lesson: Parent_Lesson,
      }),
    });
    AfterSuccessFunction(AccessToken, Parent_Lesson);
    setDeleteModal(false);
    SetModalOpen(false);
  };
  return (
    <div className={stx.LessonPageContent}>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorHandler
          Action={() => AfterSuccessFunction(AccessToken, Parent_Lesson)}
        />
      ) : WordCardsList.length === 0 ? (
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
                          <ContentChip
                            iconImage={WordCard}
                            url={Parent_Lesson + "/word-card/" + item?.id}
                            children={
                              <p
                                style={{
                                  background: "inherit",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {item?.dictionary?.meaning}
                                <span
                                  style={{
                                    background: "inherit",
                                    margin: 0,
                                    padding: 0,
                                    marginRight: 20,
                                    marginLeft: 20,
                                  }}
                                >
                                  {item?.word}
                                </span>
                                {item?.dictionary?.pronunciation}
                              </p>
                            }
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
          title={"Edit Word Card "}
          prevVal={SelectedCards.word}
          type={5}
          AfterSuccessFunction={AfterSuccessFunction}
          AccessToken={AccessToken}
          UserId={UserId}
          data={SelectedCards}
          Parent_Lesson={Parent_Lesson}
        />
      )}
      {DeleteModal && (
        <ElevatedModal toggle={CloseDeleteModal}>
          <CourseDeleteMatter
            close={ToggleDeleteModal}
            DeleteAction={DeleteAction}
            SelectedCourse={SelectedCards}
          />
        </ElevatedModal>
      )}
    </div>
  );
}

export default LessonPageContent;
