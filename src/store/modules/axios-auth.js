import axios from "axios";

const geonodeAxios = axios.create({
  baseURL: "http://yidp-geonode.geoweb.io"
});

const geoserverAxios = axios.create({
  baseURL: "http://yidp-geonode.geoweb.io/geoserver"
});

const yidpAxios = axios.create({
  baseURL: "http://localhost:8000"
});

export { geonodeAxios, geoserverAxios, yidpAxios };
