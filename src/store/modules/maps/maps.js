import * as actions from "./actions";
import * as _ from "lodash";
import { geoserverEndpoints } from "../../endpoints";

export const mapDefaults = () => {
  return {
    id: "default",
    zoom: 7,
    minZoom: 5,
    center: [15.51, 48.47],
    maxExtent: [41, 12, 55, 19],
    wmsBaseUrl: geoserverEndpoints.wmsBaseUrl
  };
};

export const layerDefaults = () => {
  return {
    name: null,
    title: null,
    typename: null,
    opacity: 1,
    featureInfo: null,
    checked: true,
    abstract: null,
    zIndex: 400
  };
};

const initialState = function() {
  return {
    maps: { default: { ...mapDefaults() } },
    mapDefaults: mapDefaults(),
    layers: [],
    categories: [],
    layerDefaults: layerDefaults()
  };
};

const state = initialState;

const mutations = {
  saveMap(state, map) {
    const id = map.id;
    state.maps[id] = map;
  },
  saveCategories(state, categories) {
    state.categories = categories;
  },
  saveMapPosition(state, payload) {
    const { mapId, zoom, center } = payload;
    state.maps[mapId].zoom = zoom;
    state.maps[mapId].center = center;
  },
  resetState(state) {
    const initial = initialState();
    state.maps = initial.maps;
    state.layers = initial.layers;
    state.categories = initial.categories;
  },
  addLayer(state, layer) {
    state.layers.push(layer);
  },
  removeLayer(state, typename) {
    let filtered = _.filter(state.layers, lyr => {
      return lyr.typename !== typename;
    });
    state.layers = filtered;
  },
  updateLayers(state, layers) {
    state.layers = layers;
  },
  setLayerOpacity(state, layer) {
    const lyr = state.layers.find(l => {
      return l.typename === layer.typename;
    });
    if (lyr) {
      lyr.opacity = layer.opacity;
    }
  }
};

const getters = {
  getMap: state => id => {
    return state.maps[id];
  },
  getCategories(state) {
    return state.categories;
  },
  getLayers: state => {
    return state.layers;
  },
  getLayer: state => typename => {
    const layer = state.layers.find(l => {
      return l.typename === typename;
    });
    return layer;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
