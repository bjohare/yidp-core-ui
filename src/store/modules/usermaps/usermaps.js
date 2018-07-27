import * as actions from "./actions";
import { geoserverEndpoints } from "../../endpoints";
// import * as _ from "lodash";
// import Vue from "vue";

const defaultConfig = {
  zoom: 7,
  minZoom: 5,
  center: [15.51, 48.47],
  maxExtent: [41, 12, 55, 19],
  extent: null,
  wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
  baseLayers: [],
  wmsLayers: [],
  wfsLayers: [],
  selectedCategories: [],
  layerStates: []
};

const state = {
  defaults: defaultConfig,
  userMaps: {}
};

const mutations = {
  saveUserMap(state, map) {
    const id = map.id;
    state.userMaps[id] = map;
  },
  saveMapPosition(state, payload) {
    const { mapId, zoom, center } = payload;
    state.userMaps[mapId].zoom = zoom;
    state.userMaps[mapId].center = center;
  },
  setWMSLayers(state, payload) {
    const { mapId, layers } = payload;
    state.userMaps[mapId].wmsLayers = layers;
  },
  setWFSLayers(state, payload) {
    const { mapId, layerGroups } = payload;
    state.userMaps[mapId].wfsLayers = layerGroups;
  },
  saveSelectedCategories(state, payload) {
    const { mapId, selected } = payload;
    state.userMaps[mapId].selectedCategories = selected;
  },
  saveLayerState(state, layer) {
    let layerStates = state.userMaps[layer.mapId].layerStates;
    if (layer.hasOwnProperty("layers")) {
      // update the feature group..
      let { name, mapId, checked, enabled, opacity, layer } = layer;
      let featureGroup = layerStates.find(s => {
        return s.name === layer.name;
      });
      if (featureGroup) {
        // featureGroup = { ...}
        Object.assign(featureGroup, {
          name,
          mapId,
          checked,
          enabled,
          opacity
        });
      } else {
        let featureGroup = {};
        Object.assign(featureGroup, {
          name,
          mapId,
          checked,
          enabled,
          opacity
        });
        layerStates.push(featureGroup);
      }
    } else {
      // update the layer
      let featureGroup = layerStates.find(s => {
        return s.name === layer.groupName;
      });
      let layers = featureGroup.layers;
      let { name, mapId, checked, enabled, opacity, style } = layer;
      let layerState = layers.find(l => {
        return l.name === layer.name;
      });
      if (layerState) {
        Object.assign(layerState, {
          name,
          mapId,
          checked,
          enabled,
          opacity,
          style
        });
      } else {
        let layerState = {};
        Object.assign(layerState, {
          name,
          mapId,
          checked,
          enabled,
          opacity,
          style
        });
        layerStates.push(layerState);
      }
    }
  }
};

const getters = {
  getUserMap: state => id => {
    return state.userMaps[id];
  },
  getUserMaps: state => {
    return state.userMaps;
  },
  getSelectedCategories: state => id => {
    return state.userMaps[id].selectedCategories;
  },
  getLayerState: state => (id, layerName) => {
    let layerStates = state.userMaps[id].layerStates;
    return layerStates.find(s => {
      return s.name === layerName;
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
