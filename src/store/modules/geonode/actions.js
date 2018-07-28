import { geonodeEndpoints } from "../../endpoints";
import { geonodeAxios } from "../../axios";

export const fetchGeonodeMaps = async ({ commit }) => {
  // do we need to fetch this everytime...
  // might if geonode maps are changing frequently
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

export const fetchGeonodeWFSLayers = async ({ commit }, payload) => {
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
  commit("geonodeCategories", response.data.objects);
  return state.geonodeCategories;
};
