import * as _ from "lodash";
import * as L from "leaflet";

export const resetState = ({ commit }) => {
  commit("resetState");
};

export const saveMapPosition = ({ commit }, payload) => {
  commit("saveMapPosition", payload);
};

export const saveMap = ({ commit }, map) => {
  commit("saveMap", map);
};

export const updateLayer = ({ commit }, layer) => {
  commit("updateLayer", layer);
};

export const syncMaps = ({ commit, state }, geonodeMaps) => {
  const mapIds = [];
  geonodeMaps.forEach(geonodeMap => {
    let mapId = geonodeMap.id;
    mapIds.push(mapId);
    let map = state.maps[mapId];
    if (!map) {
      map = {
        ...state.mapDefaults,
        ...{ id: mapId }
      };
      commit("saveMap", map);
    } else {
      const updatedMap = { ...{ id: mapId }, ...map };
      commit("saveMap", updatedMap);
    }
  });
  // remove userMaps that are not in sync
  // with the available geonodeMaps..
  for (let id in state.maps) {
    if (mapIds.indexOf(parseInt(id)) === -1) {
      if (id !== "default") {
        delete state.maps[id];
      }
    }
  }
};

/* Build the sector/cluster layer catalog */
export const buildCatalog = async ({ commit, dispatch }) => {
  const categories = await dispatch("geonode/fetchGeonodeCategories", null, {
    root: true
  });
  const layers = await dispatch("geonode/fetchGeonodeLayers", null, {
    root: true
  });
  categories.forEach(category => {
    category["layers"] = _.filter(layers, layer => {
      return layer.category__identifier === category.identifier;
    });
  });
  commit("saveCategories", categories);
};

/* Add a layer to the selected layers. */
export const addLayer = (
  { commit, state, getters, rootState },
  selectedLayer
) => {
  const accessToken = rootState.authentication.accessToken.access_token;
  let layer = getters["getLayer"](selectedLayer.typename);
  if (!layer) {
    layer = Object.assign({}, state.layerDefaults);
    let legendParam = L.Util.extend(state.legendParams, {
      layer: selectedLayer.typename
    });
    let wmsUrl = state.mapDefaults.wmsBaseUrl;
    let legendUrl =
      wmsUrl +
      L.Util.getParamString(legendParam) +
      "&access_token=" +
      accessToken;
    layer.name = selectedLayer.name;
    layer.title = selectedLayer.title;
    layer.abstract = selectedLayer.abstract;
    layer.typename = selectedLayer.typename;
    layer.featureInfo = selectedLayer.featureInfo;
    layer.legendUrl = legendUrl;
    layer.checked = true;
    commit("addLayer", layer);
  }
};

export const removeLayer = ({ commit }, typename) => {
  commit("removeLayer", typename);
};
