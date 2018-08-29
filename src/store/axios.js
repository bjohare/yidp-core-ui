import axios from "axios";

const geonodeAxios = axios.create({
  baseURL: "http://yidp-geonode.geoweb.io"
});

const yidpAxios = axios.create({
  baseURL: "http://yidp.geoweb.io"
});

export { geonodeAxios, yidpAxios };
