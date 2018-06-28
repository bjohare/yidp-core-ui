// geonode endpoints
const GEONODE_MAPS_API_URL = "/api/maps/";
const GEONODE_LAYERS_API_URL = "/api/layers/";

// geoserver endpoints
const GEOSERVER_LAYERS_API_URL = "/rest/layers.json";
const GEOSERVER_WMS_BASE_URL =
  "http://yidp-geonode.geoweb.io/geoserver/geonode/wms?";
const GEOSERVER_WMS_CAPABILITIES_URL =
  "/geonode/wms?version=1.0.0&request=GetCapabilities";

export const geonodeEndpoints = {
  mapsUrl: GEONODE_MAPS_API_URL,
  layersUrl: GEONODE_LAYERS_API_URL
};

export const geoserverEndpoints = {
  layersUrl: GEOSERVER_LAYERS_API_URL,
  wmsBaseUrl: GEOSERVER_WMS_BASE_URL,
  wmsCapabilitiesUrl: GEOSERVER_WMS_CAPABILITIES_URL
};
