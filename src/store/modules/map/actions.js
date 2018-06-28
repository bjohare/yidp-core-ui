import { geonodeAxios, geoserverAxios } from "../../axios";
import { geonodeEndpoints, geoserverEndpoints } from "./endpoints";
import WMSCapabilities from "ol/format/wmscapabilities";

export const saveMapPosition = ({ commit }, payload) => {
  commit("zoom", payload.zoom);
  commit("center", payload.center);
};

export const fetchGeonodeMap = async ({ commit, state }) => {
  const response = await geonodeAxios.get(
    geonodeEndpoints.mapsUrl + "?title=" + state.title
  );
  commit("map", response.data.objects[0]);
};

export const fetchWMSCapabilities = async ({ commit }) => {
  const parser = new WMSCapabilities();
  const resp = await geoserverAxios.get(geoserverEndpoints.wmsCapabilitiesUrl);
  const result = parser.read(resp.data);
  commit("capabilities", result);
};
