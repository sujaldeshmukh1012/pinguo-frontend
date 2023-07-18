export const PostOrPutData = async (body, url, AccessToken, method) => {
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

export const FetchCoursesOrLesson = async (token, url) => {
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
