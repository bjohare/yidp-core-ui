// geonode endpoints
const GEONODE_MAPS_API_URL = "/api/maps/";
const GEONODE_LAYERS_API_URL = "/api/layers/";
const GEONODE_CATEGORIES_URL = "/api/categories/";
const GEONODE_DOCUMENTS_URL = "/api/documents/";

// geoserver endpoints
const GEOSERVER_LAYERS_API_URL = "/rest/layers.json";
const GEOSERVER_WMS_BASE_URL =
  "http://yidp-geonode.geoweb.io/geoserver/geonode/wms";
const GEOSERVER_WMS_CAPABILITIES_URL =
  "/geonode/wms?version=1.0.0&request=GetCapabilities";

const GEOSERVER_WFS_ENDPOINT = "/geoserver/wfs";

export const geonodeEndpoints = {
  mapsUrl: GEONODE_MAPS_API_URL,
  layersUrl: GEONODE_LAYERS_API_URL,
  categoriesUrl: GEONODE_CATEGORIES_URL,
  documentsUrl: GEONODE_DOCUMENTS_URL
};

export const geoserverEndpoints = {
  layersUrl: GEOSERVER_LAYERS_API_URL,
  wmsBaseUrl: GEOSERVER_WMS_BASE_URL,
  wmsCapabilitiesUrl: GEOSERVER_WMS_CAPABILITIES_URL,
  wfsUrl: GEOSERVER_WFS_ENDPOINT
};
