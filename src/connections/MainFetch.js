export const PostOrPutData = async (
  body,
  url,
  AccessToken,
  method,
  content_type
) => {
  const resp = await fetch(url, {
    method: method,
    headers: {
      Authorization: "Bearer " + AccessToken,
      "Content-Type": content_type || "application/json",
    },
    body: body,
  });
  const isSuccessful = resp.ok;
  if (isSuccessful) {
    const data = await resp.json();

    return { status: true, data: data };
  } else {
    console.log("Posting failed reason=>>> ", resp);
    return { status: false };
  }
};

export const FetchCoursesOrLesson = async (token, url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  });
  const isSuccessful = response.ok;
  if (isSuccessful) {
    const data = await response.json();
    return { status: true, data: data };
  } else {
    return { status: false };
  }
};
