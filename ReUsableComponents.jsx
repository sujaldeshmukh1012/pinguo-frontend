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
}) {
  return (
    <div className={stx.MainPageSkeleton}>
      <NavBar title={NavTitle} />
      <MobileSizeDiv>
        {children}
        <BottomSelect
          AfterSuccessFunction={FetchFunction}
          Parent_Lesson={Parent_Lesson}
          AccessToken={AccessToken}
          UserId={UserId}
        />
      </MobileSizeDiv>
    </div>
  );
}
export default MainPageSkeleton;
const PostData = async (body, url, AccessToken, userId, method) => {
  const resp = await fetch(url, {
    method: method,
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
  });
  const isSuccessful = response.ok;
  if (isSuccessful) {
    const data = await response.json();
    return { status: true, data: data };
  } else {
    return { status: false };
  }
};
