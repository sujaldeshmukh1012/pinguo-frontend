import stx from "./ReUsableComponents.module.css";
import AddModal from "./src/components/AddModal/AddModal";
import BottomSelect from "./src/components/BottomSelect/BottomSelect";
import MobileSizeDiv from "./src/components/MobileSizeDiv/MobileSizeDiv";
import NavBar from "./src/components/NavBar/NavBar";

function MainPageSkeleton({
  children,
  UserId,
  FetchFunction,
  AccessToken,
  NavTitle,
  Parent_Lesson,
  NavIcon,
  Parent_DialogueGroup,
  Parent_Dialogue,
  TestCardId,
  TestCardPage,
  Parent_Dialogue_data,
  allowedActions,
}) {
  return (
    <div className={stx.MainPageSkeleton}>
      <NavBar title={NavTitle} icon={NavIcon} />
      <MobileSizeDiv>
        {children}
        <BottomSelect
          TestCardPage={TestCardPage}
          TestCardId={TestCardId}
          allowedActions={allowedActions}
          AfterSuccessFunction={FetchFunction}
          Parent_Lesson={Parent_Lesson}
          AccessToken={AccessToken}
          UserId={UserId}
          Parent_DialogueGroup={Parent_DialogueGroup}
          Parent_Dialogue={Parent_Dialogue}
          Parent_Dialogue_data={Parent_Dialogue_data}
        />
      </MobileSizeDiv>
    </div>
  );
}
export default MainPageSkeleton;
const PostData = async (body, url, AccessToken, userId, method) => {
  const resp = await fetch(url, {
    method: method,
    // referrerPolicy: "unsafe-url",
    headers: {
      Authorization: "Bearer " + AccessToken,
      "Content-Type": "application/json",
    },
    body: body,
  });
  const isSuccessful = resp.ok;
  if (isSuccessful) {
    const data = await resp.json();
    return { status: true, data: data };
  } else {
    return { status: false };
  }
};

const FetchCoursesOrLesson = async (token, url) => {
  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + token },
    // referrerPolicy: "unsafe-url",
  });
  const isSuccessful = response.ok;
  if (isSuccessful) {
    const data = await response.json();
    return { status: true, data: data };
  } else {
    return { status: false };
  }
};
