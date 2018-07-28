import { geoserverEndpoints } from "../../endpoints";

export const saveMapPosition = ({ commit }, payload) => {
  commit("saveMapPosition", payload);
};

export const saveUserMap = ({ commit }, map) => {
  commit("saveUserMap", map);
};

export const saveSelectedCategories = ({ commit }, payload) => {
  commit("saveSelectedCategories", payload);
};

export const saveFeatureGroup = ({ commit }, group) => {
  commit("saveFeatureGroup", group);
};

export const addFeatureGroup = ({ commit }, group) => {
  commit("addFeatureGroup", group);
};

export const removeFeatureGroup = ({ commit }, group) => {
  commit("removeFeatureGroup", group);
};

export const syncUserMaps = ({ commit, state }, geonodeMaps) => {
  const mapIds = [];
  geonodeMaps.forEach(geonodeMap => {
    let mapId = geonodeMap.id;
    mapIds.push(mapId);
    const userMap = state.userMaps[mapId];
    if (!userMap) {
      const defaults = {
        zoom: 7,
        minZoom: 5,
        center: [15.51, 48.47],
        maxExtent: [41, 12, 55, 19],
        extent: null,
        wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
        selectedCategories: [],
        layers: []
      };
      const map = {
        id: mapId,
        ...defaults
      };
      commit("saveUserMap", map);
    } else {
      const updatedUserMap = { ...userMap };
      commit("saveUserMap", updatedUserMap);
    }
  });
  // remove userMaps that are not in sync
  // with the available geonodeMaps..
  for (let id in state.userMaps) {
    if (mapIds.indexOf(parseInt(id)) === -1) {
      delete state.userMaps[id];
    }
  }
};
