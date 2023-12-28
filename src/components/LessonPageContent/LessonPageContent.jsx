import React, { useState, useEffect } from "react";
import stx from "./LessonPageContent.module.css";
import { BASEURL } from "../../connections/BASEURL";
import { FetchCoursesOrLesson } from "../../connections/MainFetch";
import { ContentChip, OptionActions } from "../CourseContent/CourseContent";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import WordCard from "../../assets/icons/svg/wordCard.svg";
import DialogueGroup from "../../assets/icons/svg/dialogueGroup.svg";
import popupImg from "../../assets/icons/svg/popUp.svg";
import NoteImg from "../../assets/icons/svg/note.svg";
import labelImg from "../../assets/icons/label.png";
import { ErrorHandler, LoadingIndicator } from "../../pages/HomePage/HomePage";
import LinkedWordCard from "../../assets/icons/linked-word-card.png";
import label_word_card from "../../assets/icons/label_word_card.png";
import {
  CourseDeleteMatter,
  UpdateIndexInTheBackend,
} from "../HomeContent/HomeContent";
import { MainModal } from "../BottomSelect/BottomSelect";
import AddModal, {
  ElevatedModal,
  MainFetchFunction,
} from "../AddModal/AddModal";
import AddAttachments from "../AddAttachments/AddAttachments";
import { VaidateJsonData } from "../../connections/ValidateData";
import PageArrangement, {
  ArrangeArray,
} from "../../connections/PageArrangement";
function LessonPageContent({
  List,
  error,
  AccessToken,
  AfterSuccessFunction,
  UserId,
  loading,
  Parent_Lesson,
  WordCardList,
  NoteList,
  Popups,
  Labels,
}) {
  const [modalOpen, SetModalOpen] = useState(false);
  const [SelectedCards, SetSelectedCards] = useState();
  const [SelectAttachments, SetSelectAttachments] = useState(false);
  const [TypeOfAttachments, SetTypeOfAttachments] = useState(0);
  const [ForAttachments, SetForAttachments] = useState(null);
  const [DuplicationError, SetDuplicationError] = useState(false);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [ModalText, setModalText] = useState("Edit");
  const [UpdatedList, SetUpdatedList] = useState([]);

  useEffect(() => {
    // var arr = List
    // if (arr.length) {
    //   var d = PageArrangement(
    //     "change-dialogue-group-word-card-arrangement/" + Parent_Lesson + "/",
    //     AccessToken,
    //     arr
    //   );
    //   console.log(d);
    // }
    SetUpdatedList(List);
    console.log(UpdatedList);
  }, [List]);

  const ToggleAttachments = (data, type) => {
    SetSelectAttachments(!SelectAttachments);
    SetTypeOfAttachments(type);
    SetForAttachments(data);
    SetModalOpen(false);
  };

  const detachItems = (type) => {
    const body = removeAttachmentsbody(SelectedCards, type);
    const url = BASEURL + "wordcard-update/" + SelectedCards?.id + "/";
    fetch(url, {
      headers: {
        Authorization: "Bearer " + AccessToken,
        "Content-Type": "application/json; charset=UTF-8",
      },
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        SetModalOpen(false);
      });
  };

  //  try attempting the draggable mechanism and try to achieve the drag and drop thing
  //  After drag comeplete, upload teh required information and hide the element that is draggen in, so that it can be reused,
  // or delete it if want to use the refresh on update architecture
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(UpdatedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    SetUpdatedList(items);
    PageArrangement(
      "change-dialogue-group-word-card-arrangement/" + Parent_Lesson + "/",
      AccessToken,
      items
    );
  };
  const ToggleModal = (data, text) => {
    SetModalOpen(!modalOpen);
    SetSelectedCards(data);
    setModalText(text);
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

  const OnActionSubmitForDuplicateWordCards = async () => {
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
  const OnActionSubmitForDuplicateDialoguieGroups = async () => {
    SetDuplicationError(false);
    var url =
      BASEURL + "dialogue-group-actions-duplicate/" + SelectedCards?.id + "/";
    var method = "POST";
    var body = {
      title: SelectedCards.title,
      user: UserId,
      lesson: Parent_Lesson,
      card_id: SelectedCards?.id,
    };
    var resp = await MainFetchFunction(AccessToken, url, method, body);
    AfterSuccessFunction(AccessToken, Parent_Lesson);
    ToggleModal();
  };

  const DeleteActionDialoguieGroups = async () => {
    SetDuplicationError(false);
    var url = BASEURL + "dialogue-group-actions/" + SelectedCards.id + "/";
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

  const DeleteActionWordCard = async () => {
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
      ) : List.length === 0 ? (
        <p></p>
      ) : (
        <>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <ul
                  className={stx.ListUl}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {UpdatedList?.map((item, index) => {
                    if (item?.info_type === "dialogue_group") {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <DialogueGropuChip
                              provided={provided}
                              item={item}
                              ToggleModal={(data) =>
                                ToggleModal(data, "Edit Dialogue Group")
                              }
                              Parent_Lesson={Parent_Lesson}
                              index={index}
                            />
                          )}
                        </Draggable>
                      );
                    } else if (item?.info_type === "word_card") {
                      var custom_id = item?.id + 21360;
                      var is_red = VaidateJsonData(item);
                      return (
                        <Draggable
                          key={custom_id}
                          draggableId={custom_id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <WordCardChip
                              provided={provided}
                              item={item}
                              ToggleModal={(data) =>
                                ToggleModal(data, "Edit Word Card")
                              }
                              Parent_Lesson={Parent_Lesson}
                              is_red={is_red}
                              index={index}
                            />
                          )}
                        </Draggable>
                      );
                    } else if (item?.info_type === "note") {
                      var custom_id = item?.id + 1000;
                      return (
                        <Draggable
                          key={custom_id}
                          draggableId={custom_id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <NoteChip
                              provided={provided}
                              item={item}
                              ToggleModal={(data) =>
                                ToggleModal(data, "Edit Note title")
                              }
                              Parent_Lesson={Parent_Lesson}
                              index={index}
                            />
                          )}
                        </Draggable>
                      );
                    } else if (item?.info_type === "popup") {
                      var custom_id = item?.id + 560;
                      return (
                        <Draggable
                          key={custom_id}
                          draggableId={custom_id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <PopupChip
                              provided={provided}
                              item={item}
                              ToggleModal={(data) =>
                                ToggleModal(data, "Edit Popup Title")
                              }
                              Parent_Lesson={Parent_Lesson}
                              index={index}
                            />
                          )}
                        </Draggable>
                      );
                    } else if (item?.info_type === "label") {
                      var custom_id = item?.id + 860;
                      return (
                        <Draggable
                          key={custom_id}
                          draggableId={custom_id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <LabelChip
                              provided={provided}
                              item={item}
                              ToggleModal={(data) =>
                                ToggleModal(data, "Edit Label Title")
                              }
                              Parent_Lesson={Parent_Lesson}
                              index={index}
                            />
                          )}
                        </Draggable>
                      );
                    }
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}

      {SelectAttachments && (
        <MainModal setOpen={ToggleAttachments}>
          <AddAttachments
            data={SelectedCards}
            type={TypeOfAttachments}
            ToggleAttachments={ToggleAttachments}
            AccessToken={AccessToken}
            UserId={UserId}
            Parent_Lesson={Parent_Lesson}
            AfterSuccessFunction={AfterSuccessFunction}
          />
        </MainModal>
      )}

      {modalOpen && (
        <MainModal setOpen={ToggleModal}>
          <OptionActions
            detachItems={detachItems}
            ToggleAddModal={ToggleAddModal}
            ToggleDeleteModal={ToggleDeleteModal}
            error={DuplicationError}
            ToggleAttachments={ToggleAttachments}
            WordCard
            OnActionSubmitForDuplicate={() => {
              if (SelectedCards?.word === undefined) {
                OnActionSubmitForDuplicateDialoguieGroups();
              } else {
                OnActionSubmitForDuplicateWordCards();
              }
            }}
            // OnActionSubmitForDuplicate={OnActionSubmitForDuplicate}
          />
        </MainModal>
      )}
      {AddModalOpen && (
        <AddModal
          toggle={ToggleAddModal}
          title={ModalText}
          // prevVal={SelectedCards.word}
          prevVal={SelectedCards.title}
          item_id={SelectedCards.id}
          type={7}
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
            DeleteAction={
              SelectedCards.word === undefined
                ? DeleteActionDialoguieGroups
                : DeleteActionWordCard
            }
            SelectedCourse={SelectedCards}
          />
        </ElevatedModal>
      )}
    </div>
  );
}

export default LessonPageContent;

const WordCardChip = ({
  provided,
  Parent_Lesson,
  item,
  ToggleModal,
  index,
  is_red,
}) => {
  useEffect(() => {}, [item]);
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={stx.ListLi}
    >
      <ContentChip
        note_linked={item?.note_linked > 0}
        popup_linked={item?.popup_linked > 0}
        empty={is_red}
        label_linked={item?.label_linked.length > 0}
        iconImage={item?.linked ? LinkedWordCard : WordCard}
        IconStyles={{ width: 20 }}
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
  );
};

const DialogueGropuChip = ({
  provided,
  Parent_Lesson,
  item,
  ToggleModal,
  index,
}) => {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={stx.ListLi}
    >
      <ContentChip
        iconImage={DialogueGroup}
        url={Parent_Lesson + "/dialogue-group/" + item?.id + "/"}
        children={
          <p
            style={{
              background: "inherit",
              margin: 0,
              padding: 0,
            }}
          >
            {item?.title}
          </p>
        }
        ToggleModal={ToggleModal}
        data={item}
        key={index}
      />
    </li>
  );
};

const NoteChip = ({ provided, Parent_Lesson, item, ToggleModal, index }) => {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={stx.ListLi}
    >
      <ContentChip
        iconImage={NoteImg}
        IconStyles={{ width: 20 }}
        url={Parent_Lesson + "/word-card/" + item?.id}
        children={
          <p
            style={{
              background: "inherit",
              margin: 0,
              padding: 0,
            }}
          >
            {item?.title}
          </p>
        }
        ToggleModal={ToggleModal}
        data={item}
        key={index}
      />
    </li>
  );
};

const PopupChip = ({ provided, Parent_Lesson, item, ToggleModal, index }) => {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={stx.ListLi}
    >
      <ContentChip
        iconImage={popupImg}
        IconStyles={{ width: 20 }}
        url={Parent_Lesson + "/word-card/" + item?.id}
        children={
          <p
            style={{
              background: "inherit",
              margin: 0,
              padding: 0,
            }}
          >
            {item?.title}
          </p>
        }
        ToggleModal={ToggleModal}
        data={item}
        key={index}
      />
    </li>
  );
};

const LabelChip = ({ provided, Parent_Lesson, item, ToggleModal, index }) => {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={stx.ListLi}
    >
      <ContentChip
        iconImage={labelImg}
        IconStyles={{ width: 20 }}
        url={Parent_Lesson + "/word-card/" + item?.id}
        children={
          <p
            style={{
              background: "inherit",
              margin: 0,
              padding: 0,
            }}
          >
            {item?.title}
          </p>
        }
        ToggleModal={ToggleModal}
        data={item}
        key={index}
      />
    </li>
  );
};

const removeAttachmentsbody = (data, type) => {
  var arr = data;
  if (type === 0) {
    arr.note_linked = [];
  } else if (type === 1) {
    arr.popup_linked = [];
  } else if (type === 2) {
    arr.label_linked = [];
  }
  return arr;
};
