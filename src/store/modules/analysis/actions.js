export const resetState = ({ commit }) => {
  commit("resetState");
};

export const saveSelectedFeature = ({ commit }, payload) => {
  commit("saveSelectedFeature", payload);
};

export const saveDataLayer = ({ commit }, payload) => {
  commit("saveDataLayer", payload);
};

export const saveQuery = ({ commit }, payload) => {
  commit("saveQuery", payload);
};

export const saveFilteredData = ({ commit }, payload) => {
  commit("saveFilteredData", payload);
};

export const clearFilteredData = ({ commit }) => {
  commit("saveFilteredData", null);
};

export const saveFeatureDescription = ({ commit }, payload) => {
  commit("saveFeatureDescription", payload);
};
