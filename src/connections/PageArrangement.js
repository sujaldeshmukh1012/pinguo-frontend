import axios from "axios";
import { BASEURL } from "./BASEURL";

const PageArrangement = (url, AccessToken, List) => {
  //  url,AccessToken = string
  // List = [{"id":23,"info_type":"word_card"}]
  var d = ReduceData(List);
  axios
    .put(
      BASEURL + url,
      { items: d },
      {
        headers: {
          Authorization: "Bearer " + AccessToken,
        },
      }
    )
    .then((response) => {
      console.log(response.data.arragements);
      return response.data.arragements;
    })
    .catch((e) => {
      console.log(e);
      return e;
    });
};
export default PageArrangement;

const ReduceData = (data) => {
  var new_d = [];
  data.map((item, i) => {
    var js = {};
    js["item_id"] = item.item_id;
    js["info_type"] = item.info_type;
    new_d.push(js);
  });
  return new_d;
};

export const ArrangeArray = (arranged, List) => {
  var new_a = [];
  arranged?.map((item, i) => {
    List?.map((data, j) => {
      if (item?.id === data?.id && item?.info_type === data?.info_type) {
        new_a.push(data);
      }
    });
  });
  return new_a;
};
