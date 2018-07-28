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

export const syncUserMaps = ({ commit, state }, geonodeMaps) => {
  const mapIds = [];
  geonodeMaps.forEach(geonodeMap => {
    let mapId = geonodeMap.id;
    mapIds.push(mapId);
    const userMap = state.userMaps[mapId];
    if (!userMap) {
      const defaults = state.defaults;
      const map = {
        id: mapId,
        ...defaults
        // ...geonodeMap
      };
      commit("saveUserMap", map);
    } else {
      // const updatedUserMap = { ...userMap, ...geonodeMap };
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
