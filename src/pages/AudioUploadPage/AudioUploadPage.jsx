import React, { useState, useEffect } from "react";
import stx from "./AudioUploadPage.module.css";
import { BASEURL } from "../../connections/BASEURL";
import { ExtractLocalDetails } from "../HomePage/HomePage";
import axios from "axios";

function AudioUploadPage() {
  const [AccessToken, SetAccessToken] = useState(null);
  const [bulk, setbulk] = useState(true);

  useEffect(() => {
    var data = ExtractLocalDetails();
    if (data.status === true) {
      SetAccessToken(data.accessToken);
    } else {
      window.location.href = "login";
    }
  }, []);

  return (
    <div className={stx.AudioUploadPage}>
      <h1>Uplaod Audio Files here</h1>
      <div className={stx.MainBtnWrapper}>
        <button className={stx.UplaodButtons} onClick={() => setbulk(true)}>
          Bulk
        </button>
        <button className={stx.UplaodButtons} onClick={() => setbulk(false)}>
          Single
        </button>
      </div>
      {bulk ? (
        <BulkUplaod AccessToken={AccessToken} />
      ) : (
        <SingleUplaod AccessToken={AccessToken} />
      )}
    </div>
  );
}

export default AudioUploadPage;

const BulkUplaod = ({ AccessToken }) => {
  const [WordList, SetWordList] = useState([]);
  const [loading, SetLoading] = useState(true);
  const [index, SetIndex] = useState(0);
  const FetchWords = (index) => {
    var url = BASEURL + "word-list/" + index + "/";
    fetch(url, { headers: { Authorization: "Bearer " + AccessToken } })
      .then((r) => r.json())
      .then((resp) => {
        console.log(resp);
        SetWordList(resp);
        SetLoading(false);
      });
  };
  return (
    <div className={stx.UplaodWrapper}>
      {!loading ? (
        <>
          <p style={{ margin: 20 }}> Object | Male Voice | Female Voice </p>
          {WordList.map((item, i) => {
            return (
              <GetAndStoreFileWithBody
                data={item}
                key={i}
                AccessToken={AccessToken}
              />
            );
          })}{" "}
        </>
      ) : (
        <form
          className={stx.Form}
          onSubmit={(e) => {
            e.preventDefault();
            FetchWords(index);
          }}
        >
          <input
            className={stx.NumberInput}
            onChange={(e) => {
              SetIndex(e.target.value);
            }}
            value={index}
            type="number"
            placeholder="Enter Index to fetch Dictionary Words"
          />
          <button className={stx.UplaodButtons} type="submit">
            Get Results
          </button>
        </form>
      )}
      <button
        className={stx.UplaodButtons}
        onClick={() => {
          SetWordList([]);
          SetLoading(true);
        }}
      >
        Empty List
      </button>
    </div>
  );
};
const SingleUplaod = () => {
  return <div className={stx.UplaodWrapper}>SingleUplaod</div>;
};

const GetAndStoreFileWithBody = ({ data, AccessToken }) => {
  const [male_voice, SetMale_voice] = useState(null);
  const [female_voice, SetFemale_voice] = useState(null);
  const [Uploading, SetUploading] = useState(false);
  const [isSuccess, SetisSuccess] = useState(0);
  const SaveFile = () => {
    var body = new FormData();
    if (male_voice) {
      body.append("male_voice", male_voice, male_voice?.name);
    }
    if (female_voice) {
      body.append("female_voice", female_voice, female_voice?.name);
    }
    SetUploading(true);
    var url = BASEURL + "word-upload/" + data?.id + "/";
    axios
      .put(url, body, {
        headers: {
          Authorization: "Bearer " + AccessToken,
          "content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp.data.status);
        SetUploading(false);
        SetisSuccess(true);
      })
      .catch((e) => {
        console.log(data?.id, " ", e);
        SetisSuccess(false);
      });
  };
  return (
    <div className={stx.GetAndStoreFileWithBody}>
      {isSuccess === 0 ? (
        <>
          <p>{data?.id}</p>
          <input
            type="file"
            name="male voice"
            className={stx.GASFWBInput}
            onChange={(e) => {
              e.preventDefault();
              SetMale_voice(e.target.files[0]);
            }}
          />
          <input
            type="file"
            name="Female voice"
            className={stx.GASFWBInput}
            onChange={(e) => {
              e.preventDefault();
              SetFemale_voice(e.target.files[0]);
            }}
          />
          <button
            className={stx.UplaodButtons}
            disabled={male_voice || female_voice ? false : true}
            onClick={() => SaveFile()}
          >
            SAVE
          </button>
        </>
      ) : isSuccess ? (
        <>
          <p style={{ color: "green" }}>
            {" "}
            Voice data for {data?.id} - {data?.ideogram} : is Successfully
            uploaded
          </p>
          <button
            className={stx.UplaodButtons}
            disabled={male_voice || female_voice ? false : true}
            onClick={() => {
              SetMale_voice(null);
              SetFemale_voice(null);
              SetUploading(true);
              SetisSuccess(0);
            }}
          >
            Upload Again
          </button>
        </>
      ) : (
        <>
          {" "}
          <p style={{ color: "red" }}>
            {" "}
            Voice data for {data?.id} - {data?.ideogram} : Failed uploading
          </p>
          <button
            className={stx.UplaodButtons}
            disabled={male_voice || female_voice ? false : true}
            onClick={() => {
              SetMale_voice(null);
              SetFemale_voice(null);
              SetUploading(true);
              SetisSuccess(0);
            }}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
};
