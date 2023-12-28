import React, { useState, useEffect } from "react";
import stx from "./DialogueGroupContent.module.css";
import { BASEURL } from "../../connections/BASEURL";
import {
  FetchCoursesOrLesson,
  PostOrPutData,
} from "../../connections/MainFetch";
import { ContentChip, OptionActions } from "../CourseContent/CourseContent";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import WordCard from "../../assets/icons/svg/wordCard.svg";
import DialogueGroup from "../../assets/icons/svg/dialogueGroup.svg";
import DialogueImg from "../../assets/icons/svg/dialogue.svg";
import testCard from "../../assets/icons/test-card.png";
import {
  BlackButton,
  ErrorHandler,
  LoadingIndicator,
} from "../../pages/HomePage/HomePage";
import {
  CourseDeleteMatter,
  UpdateIndexInTheBackend,
} from "../HomeContent/HomeContent";
import { MainModal } from "../BottomSelect/BottomSelect";
import AddModal, {
  ElevatedModal,
  MainFetchFunction,
} from "../AddModal/AddModal";
import { GridLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PageArrangement from "../../connections/PageArrangement";

function DialogueGroupContent({
  List,
  TestList,
  error,
  AccessToken,
  AfterSuccessFunction,
  UserId,
  loading,
  Parent_Lesson,
  Parent_DialogueGroup,
}) {
  const [modalOpen, SetModalOpen] = useState(false);
  const [SelectedCards, SetSelectedCards] = useState(null);
  const [DuplicationError, SetDuplicationError] = useState(false);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [UpdatedList, SetUpdatedList] = useState([]);
  const [CreatingTestCard, SetCreatingTestCard] = useState(false);
  const [TestCardError, SetTestCardError] = useState(false);
  const [TestCardSuccess, SetTestCardSuccess] = useState(false);
  const [MakeTestFor, SetMakeTestFor] = useState(null);
  useEffect(() => {
    SetUpdatedList(List);
    console.log(UpdatedList);
  }, [List, loading]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(UpdatedList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    SetUpdatedList(items);
    PageArrangement(
      "change-dialogue-group-arrangement/" + Parent_DialogueGroup + "/",
      AccessToken,
      items
    );
  };
  const ToggleModal = (data = null) => {
    SetModalOpen(!modalOpen);
    SetSelectedCards(data);
  };
  const CreateTestAction = (data, type) => {
    SetCreatingTestCard(true);
    SetMakeTestFor(data);
    UplaodTestCard(data, AccessToken, type);
    ToggleModal();
  };
  const CloseCreateTestAction = (data, url) => {
    SetCreatingTestCard(false);
    SetMakeTestFor(data);
    if (url) {
      window.location.href = url;
    }
    ToggleModal();
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
  const UplaodTestCard = async (data, token, card_type) => {
    var url = BASEURL + "testcard/";
    var body = JSON.stringify({
      dialogue: data.id,
      card_type: card_type,
      hide: [],
      test_text: "",
      answers: [],
      dialogue_group: Parent_DialogueGroup,
    });
    var method = "POST";
    const resp = await PostOrPutData(body, url, token, method);
    if (resp.status === true) {
      SetTestCardError(false);
      SetTestCardSuccess(true);
      url = "dialogue-test/" + resp.data?.id;
      CloseCreateTestAction(null, url);
    } else {
      SetTestCardError(true);
    }
  };
  const OnActionSubmitForDuplicate = async () => {
    SetDuplicationError(false);
    var url = BASEURL + "dialogue-actions/" + 0 + "/";
    var method = "POST";
    var body = {
      title: SelectedCards.title,
      user: UserId,
      lesson: Parent_Lesson,
      dialogue_group: Parent_DialogueGroup,
    };
    var resp = await MainFetchFunction(AccessToken, url, method, body);
    AfterSuccessFunction(AccessToken, Parent_Lesson);
    ToggleModal();
  };
  const DeleteAction = async () => {
    SetDuplicationError(false);
    if (SelectedCards?.test_text === undefined) {
      var url = BASEURL + "dialogue-actions/" + SelectedCards.id + "/";
    } else {
      var url = BASEURL + "testcard/" + SelectedCards.id + "/";
    }
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
    <>
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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <ul
                  className={stx.ListUl}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {UpdatedList?.map((item, index) => {
                    if (item?.info_type === "test_card") {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <WordCardChip
                              provided={provided}
                              item={item}
                              ToggleModal={ToggleModal}
                              Parent_Lesson={Parent_Lesson}
                              index={index}
                            />
                          )}
                        </Draggable>
                      );
                    } else {
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
                              ToggleModal={ToggleModal}
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
        )}

        {modalOpen && (
          <MainModal setOpen={ToggleModal}>
            <OptionActions
              dialoguePage
              CreateTestAction={CreateTestAction}
              data={SelectedCards}
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
            title={"Edit Dialogue "}
            prevVal={SelectedCards.title}
            item_id={SelectedCards.id}
            type={9}
            AfterSuccessFunction={AfterSuccessFunction}
            AccessToken={AccessToken}
            UserId={UserId}
            data={SelectedCards}
            Parent_DialogueGroup={Parent_DialogueGroup}
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
      {CreatingTestCard && (
        <TestCardCreationIndicator
          errorFxn={() => UplaodTestCard(MakeTestFor, AccessToken)}
          token={AccessToken}
          toggle={CloseCreateTestAction}
          dialogue_group={Parent_DialogueGroup}
          error={TestCardError}
          Success={TestCardSuccess}
        />
      )}
    </>
  );
}

export default DialogueGroupContent;

const WordCardChip = ({
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
        iconImage={testCard}
        IconStyles={{ width: 25 }}
        url={"dialogue-test/" + item?.id}
        children={
          <p
            style={{
              background: "inherit",
              margin: 0,
              padding: 0,
            }}
          >
            {item?.dialogue?.title}
          </p>
        }
        ToggleModal={ToggleModal}
        data={item}
        key={index}
      />
    </li>
  );
};

const TestCardCreationIndicator = ({ errorFxn, toggle, error, Success }) => {
  return (
    <div className={stx.TestCardCreationIndicatorWrapper}>
      <div className={stx.TCCard}>
        {error ? (
          <>
            <button className={stx.TCCButtonCross} onClick={() => toggle()}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <ErrorHandler
              Action={() => {
                console.log("Retry Test Card creation");
                errorFxn(data, token);
              }}
            />
          </>
        ) : Success ? (
          <>
            <button className={stx.TCCButtonCross} onClick={() => toggle()}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h4
              style={{
                color: "lightgreen",
                background: "inherit",
                margin: 20,
                fontSize: 30,
                textAlign: "center",
              }}
            >
              Test Card created Successfully
            </h4>
            <p>Redirecting to Test Card Page</p>
          </>
        ) : (
          <>
            <button className={stx.TCCButtonCross} onClick={() => toggle()}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h4 className={stx.TCCardH2}>Creating a Test for this Dialogue</h4>
            <GridLoader
              color={"#000"}
              loading={true}
              className={stx.LoaderSpinner}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </>
        )}
      </div>
    </div>
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
        iconImage={DialogueImg}
        url={"dialogue/" + item?.id}
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

{
  /*



['Numbers', 'Places & Directions', 'Time', 'Verbs', 'Adjectives and Adverbs', 'Expressions', 'People & Things', 'Measure Words', 'Particles', 'Question Words', 'Pronouns', 'Conjunction',  'Grammar point']

*/
}
