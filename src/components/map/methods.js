import axios from "axios";

export const showGetFeatureInfo = async url => {
  console.log(url);
  const response = await axios.get(url);
  this.info = response.data;
  throw new DOMException("debug this");
};
