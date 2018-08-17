import { geonodeEndpoints, geoserverEndpoints } from "../../endpoints";
import { geonodeAxios } from "../../axios";

export const resetState = ({ commit }) => {
  commit("geonodeMaps", []);
};

export const getGeonodeAxiosConfig = ({ rootState }) => {
  return {
    headers: {
      Authorization:
        "Bearer " + rootState.authentication.accessToken.acccess_token
    }
  };
};

export const fetchGeonodeMaps = async ({ commit, dispatch }) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(geonodeEndpoints.mapsUrl, auth);
  commit("geonodeMaps", response.data.objects);
  return response.data.objects;
};

export const fetchGeonodeWMSLayers = async (
  { dispatch, getters },
  mapConfig
) => {
  const lyrs = getters["getGeonodeMapLayers"](mapConfig.id);
  const defaultOverlays = lyrs.filter(lyr => {
    if (lyr.group === null) {
      return true;
    } else {
      return lyr.group !== "background";
    }
  });
  const layers = [];
  const auth = await dispatch("getGeonodeAxiosConfig");
  await defaultOverlays.reduce(async (promise, overlay) => {
    await promise;
    const response = await geonodeAxios.get(
      geonodeEndpoints.layersUrl + "?name=" + overlay.name.split(":")[1],
      auth
    );
    layers.push(response.data.objects[0]);
  }, Promise.resolve());
  return layers;
};

export const fetchGeonodeSelectedLayers = async (
  { commit, dispatch },
  payload
) => {
  const { selected } = payload;
  let layerGroups = {};
  for (let idx in selected) {
    let identifier = selected[idx].identifier;
    let category = selected[idx].gn_description;
    let query = "category__identifier__in=" + identifier;
    const auth = await dispatch("getGeonodeAxiosConfig");
    const response = await geonodeAxios.get(
      geonodeEndpoints.layersUrl + "?" + query,
      auth
    );
    layerGroups[category] = response.data.objects;
  }
  return layerGroups;
};

/* Get the categories from geonode */
export const fetchGeonodeCategories = async ({ dispatch }) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(geonodeEndpoints.categoriesUrl, auth);
  return response.data.objects;
};

export const fetchGeonodeMapDescription = async ({ dispatch }, payload) => {
  const { mapId } = payload;
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(
    geonodeEndpoints.mapsUrl + "/" + mapId,
    auth
  );
  return response.data;
};

export const fetchGeonodeDocuments = async ({ dispatch }) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(geonodeEndpoints.documentsUrl, auth);
  return response.data.objects;
};

export const fetchGeonodeLayers = async ({ dispatch }) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(geonodeEndpoints.layersUrl, auth);
  return response.data.objects;
};

export const fetchGeonodeLayer = async ({ dispatch }, id) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(
    geonodeEndpoints.layersUrl + id,
    auth
  );
  return response.data;
};

export const fetchGeoserverFeatureType = async ({ dispatch }, typename) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const response = await geonodeAxios.get(
    geoserverEndpoints.wfsUrl +
      "SERVICE=WFS&VERSION=2.0.0&request=DescribeFeatureType" +
      "&typeNames=" +
      typename +
      "&outputFormat=application/json",
    auth
  );
  return response.data;
};

export const filterGeonodeLayers = async ({ dispatch }, payload) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const { value, type } = payload;
  let url = "";
  if (type === "text") {
    url = geonodeEndpoints.layersUrl + "?title__icontains=" + value;
  }
  if (type === "category") {
    url = geonodeEndpoints.layersUrl + "?category__identifier=" + value;
  }
  const response = await geonodeAxios.get(url, auth);
  return response.data.objects;
};

export const filterGeonodeDocuments = async ({ dispatch }, payload) => {
  const auth = await dispatch("getGeonodeAxiosConfig");
  const { value, type } = payload;
  let url = "";
  if (type === "text") {
    url = geonodeEndpoints.documentsUrl + "?title__icontains=" + value;
  }
  if (type === "category") {
    url = geonodeEndpoints.documentsUrl + "?category__identifier=" + value;
  }
  const response = await geonodeAxios.get(url, auth);
  return response.data.objects;
};
