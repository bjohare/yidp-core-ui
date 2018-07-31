import axios from "axios";

const geonodeAxios = axios.create({
  baseURL: "http://yidp-geonode.geoweb.io"
});

const yidpAxios = axios.create({
  baseURL: "http://localhost:8001"
});

const geoserverAxios = axios.create({
  baseURL: "http://yidp-geonode.geoweb.io",
  auth: {
    username: "admin",
    password: "geoserver"
  }
});

export { geonodeAxios, geoserverAxios, yidpAxios };
