import { geonodeAxios } from "../../store/axios";
import { geoserverEndpoints } from "../../store/endpoints";
import * as L from "leaflet";
import { access } from "fs";

export const filterWFSLayer = async (layer, query, access_token) => {
  let wfsParams = {
    service: "WFS",
    request: "GetFeature",
    typeName: layer.typename,
    version: "1.0.0",
    outputFormat: "application/json",
    crsName: "EPSG:4326",
    count: 200
  };
  const url =
    geoserverEndpoints.wfsUrl +
    L.Util.getParamString(wfsParams) +
    "&access_token=" +
    access_token;
  const response = await geonodeAxios({
    method: "post",
    url: url,
    data: query !== undefined ? query : "",
    headers: { "Content-Type": "application/x-www-form-urlencoded " }
  });
  return response.data;
};

export const describeFeatureType = async (typename, access_token) => {
  let wfsParams = {
    service: "WFS",
    request: "DescribeFeatureType",
    typeName: typename,
    version: "1.0.0",
    outputFormat: "application/json"
  };
  const url =
    geoserverEndpoints.wfsUrl +
    L.Util.getParamString(wfsParams) +
    "&access_token=" +
    access_token;
  const response = await geonodeAxios.get(url);
  return response.data;
};
