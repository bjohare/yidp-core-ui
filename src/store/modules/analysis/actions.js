import * as d3 from "d3";

export const resetState = ({ commit }) => {
  commit("resetState");
};

export const saveSelectedFeature = ({ commit }, payload) => {
  commit("saveSelectedFeature", payload);
};

export const saveDataLayer = ({ commit }, payload) => {
  commit("saveDataLayer", payload);
};

export const saveSpatialQuery = ({ commit }, payload) => {
  commit("saveSpatialQuery", payload);
};

export const saveQuery = ({ commit }, payload) => {
  commit("saveQuery", payload);
};

export const resetQuery = ({ commit }) => {
  commit("resetQuery");
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

export const aggregateProperty = ({ getters }, property) => {
  const filteredData = getters["getFilteredData"];
  const features = filteredData.features;
  const data = [];
  features.forEach(feature => {
    data.push(feature.properties);
  });
  let grouped = d3
    .nest()
    .key(function(d) {
      return d[property];
    })
    .sortKeys(d3.ascending)
    .rollup(function(v) {
      return v.length;
    })
    .entries(data);
  return grouped;
};
