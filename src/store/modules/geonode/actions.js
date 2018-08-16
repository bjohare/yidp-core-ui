import { geonodeEndpoints, geoserverEndpoints } from "../../endpoints";
import { geonodeAxios } from "../../axios";

export const resetState = ({ commit }) => {
  commit("geonodeMaps", []);
};

export const fetchGeonodeMaps = async ({ commit }) => {
  const response = await geonodeAxios.get(geonodeEndpoints.mapsUrl);
  commit("geonodeMaps", response.data.objects);
  return response.data.objects;
};

export const fetchGeonodeWMSLayers = async ({ commit, dispatch }, vm) => {
  const lyrs = vm.$store.getters["geonode/getGeonodeMapLayers"](vm.userMap.id);
  const defaultOverlays = lyrs.filter(lyr => {
    if (lyr.group === null) {
      return true;
    } else {
      return lyr.group !== "background";
    }
  });
  const layers = [];
  await defaultOverlays.reduce(async (promise, overlay) => {
    await promise;
    const response = await geonodeAxios.get(
      geonodeEndpoints.layersUrl + "?name=" + overlay.name.split(":")[1],
      {
        headers: {
          Authorization:
            "Bearer " +
            vm.$store.getters["authentication/getAccessToken"].access_token
        }
      }
    );
    layers.push(response.data.objects[0]);
  }, Promise.resolve());
  return layers;
};

export const fetchGeonodeSelectedLayers = async ({ commit }, payload) => {
  const { vm, selected } = payload;
  let layerGroups = {};
  for (let idx in selected) {
    let identifier = selected[idx].identifier;
    let category = selected[idx].gn_description;
    let query = "category__identifier__in=" + identifier;
    const response = await geonodeAxios.get(
      geonodeEndpoints.layersUrl + "?" + query,
      {
        headers: {
          Authorization:
            "Bearer " +
            vm.$store.getters["authentication/getAccessToken"].access_token
        }
      }
    );
    layerGroups[category] = response.data.objects;
  }
  return layerGroups;
};

export const fetchGeonodeCategories = async ({ commit, state }, vm) => {
  const response = await geonodeAxios.get(geonodeEndpoints.categoriesUrl, {
    headers: {
      Authorization:
        "Bearer " +
        vm.$store.getters["authentication/getAccessToken"].access_token
    }
  });
  return response.data.objects;
};

export const fetchGeonodeMapDescription = async ({ commit }, payload) => {
  const { vm, mapId } = payload;
  const response = await geonodeAxios.get(
    geonodeEndpoints.mapsUrl + "/" + mapId,
    {
      headers: {
        Authorization:
          "Bearer" +
          vm.$store.getters["authentication/getAccessToken"].access_token
      }
    }
  );
  return response.data;
};

// TODO: check authentication on these methods
export const fetchGeonodeDocuments = async ({ commit }) => {
  const response = await geonodeAxios.get(geonodeEndpoints.documentsUrl);
  return response.data.objects;
};

export const fetchGeonodeLayers = async () => {
  const response = await geonodeAxios.get(geonodeEndpoints.layersUrl);
  return response.data.objects;
};

export const fetchGeonodeLayer = async (context, id) => {
  console.log(id);
  const response = await geonodeAxios.get(geonodeEndpoints.layersUrl + id);
  return response.data;
};

export const fetchGeoserverFeatureType = async (context, typename) => {
  const response = await geonodeAxios.get(
    geoserverEndpoints.wfsUrl +
      "SERVICE=WFS&VERSION=2.0.0&request=DescribeFeatureType" +
      "&typeNames=" +
      typename +
      "&outputFormat=application/json"
  );
  console.log(response);
};

export const filterGeonodeLayers = async (context, payload) => {
  const { value, type } = payload;
  let url = "";
  if (type === "text") {
    url = geonodeEndpoints.layersUrl + "?title__icontains=" + value;
  }
  if (type === "category") {
    url = geonodeEndpoints.layersUrl + "?category__identifier=" + value;
  }
  const response = await geonodeAxios.get(url);
  return response.data.objects;
};

export const filterGeonodeDocuments = async (context, payload) => {
  const { value, type } = payload;
  let url = "";
  if (type === "text") {
    url = geonodeEndpoints.documentsUrl + "?title__icontains=" + value;
  }
  if (type === "category") {
    url = geonodeEndpoints.documentsUrl + "?category__identifier=" + value;
  }
  const response = await geonodeAxios.get(url);
  return response.data.objects;
};
