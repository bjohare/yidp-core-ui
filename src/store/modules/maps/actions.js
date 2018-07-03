import { geonodeEndpoints } from "../../endpoints";
import { geonodeAxios } from "../../axios";

export const fetchGeonodeMaps = async ({ commit, state }) => {
  const response = await geonodeAxios.get(geonodeEndpoints.mapsUrl);
  commit("geonodeMaps", response.data.objects);
};
