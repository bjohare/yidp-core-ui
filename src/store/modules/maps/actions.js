import { geonodeEndpoints } from "../../endpoints";
import { geonodeAxios } from "../../axios";

export const fetchGeonodeMaps = async ({ commit, state }) => {
  // do we need to fetch this everytime...
  // might if geonode maps are changing frequently
  const response = await geonodeAxios.get(geonodeEndpoints.mapsUrl);
  commit("geonodeMaps", response.data.objects);
};
