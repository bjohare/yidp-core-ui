import { geonodeAxios } from "../../axios";
import { geonodeEndpoints } from "../../endpoints";

export const saveMapPosition = ({ commit }, payload) => {
  commit("zoom", payload.zoom);
  commit("center", payload.center);
};

// save the available baselayers
export const saveBaseLayers = ({ commit }, payload) => {
  commit("baseLayers", payload);
};

// save the available overlays
export const saveOverlays = ({ commit }, payload) => {
  commit("overlays", payload);
};

// export const fetchGeonodeMap = async ({ commit, state }) => {
//   const response = await geonodeAxios.get(
//     geonodeEndpoints.mapsUrl + "?title=" + state.title
//   );
//   commit("map", response.data.objects[0]);
// };

export const setGeonodeMap = async ({ commit }, map) => {
  commit("geonodeMap", map);
  commit("title", map.title);
};

export const fetchGeonodeLayers = async ({ commit, state }, vm) => {
  const lyrs = vm.$store.getters["map/getGeonodeMap"].layers;
  const overlays = lyrs.filter(lyr => {
    if (lyr.group === null) {
      return true;
    } else {
      return lyr.group !== "background";
    }
  });
  const layers = [];
  for (let o in overlays) {
    let lyr = overlays[o];
    const response = await geonodeAxios.get(
      geonodeEndpoints.layersUrl + "?name=" + lyr.name.split(":")[1],
      {
        headers: {
          Authorization:
            "Bearer " +
            vm.$store.getters["authentication/getAccessToken"].access_token
        }
      }
    );
    layers.push(response.data.objects[0]);
  }
  commit("geonodeLayers", layers);
  return layers;
};
