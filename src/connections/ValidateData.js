export const VaidateJsonData = (data) => {
  for (var key of Object.keys(data)) {
    var ob = Object.keys(data[key]);
    if (ob.length > 0) {
      for (var in_keys of Object.keys(data[key])) {
        if (data[key][in_keys] === null || data[key][in_keys] === "") {
          return true;
        }
      }
    } else if (data[key] === null || data[key] === "") {
      return true;
    }
  }
  return false;
};

export const VaidateJsonDataForHanzi = (data) => {
  for (var key of Object.keys(data)) {
    if (data[key] === null || data[key] === "") {
      return true;
    }
  }
  return false;
};
