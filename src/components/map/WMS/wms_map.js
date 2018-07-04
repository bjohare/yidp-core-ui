import { Map, View, Overlay } from "ol";
import { transformExtent, fromLonLat } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { TileWMS, XYZ } from "ol/source";
import { geoserverAxios } from "../../../store/axios";

export const initMap = vm => {
  const view = new View({
    extent: transformExtent(vm.maxExtent, "EPSG:4326", "EPSG:3857"),
    center: fromLonLat(vm.center),
    zoom: vm.zoom,
    minZoom: vm.minZoom
  });
  vm.map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        })
      })
    ],
    view: view
  });
};

const fetchGeonodeLayers = async vm => {
  return vm.$store.dispatch("map/fetchGeonodeLayers", vm);
};

export const loadWMSLayers = async vm => {
  const layers = await fetchGeonodeLayers(vm);
  const wmsSources = [];
  const queryLayers = [];
  for (let layer in layers) {
    let layerName = layers[layer].typename;
    queryLayers.push(layerName);
    const wmsSource = new TileWMS({
      url: vm.$store.state.map.wmsBaseUrl,
      params: {
        LAYERS: layerName,
        VERSION: "1.3.0",
        FORMAT: "image/png",
        TRANSPARENT: "true",
        TILED: true
      },
      serverType: "geoserver",
      crossOrigin: "anonymous",
      tileLoadFunction: function(tile, src) {
        // required for geoserver authentication
        geoserverAxios
          .get(src, {
            responseType: "arraybuffer"
          })
          .then(response => {
            var arrayBufferView = new Uint8Array(response.data);
            var blob = new Blob([arrayBufferView], { type: "image/png" });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            tile.getImage().src = imageUrl;
          });
      }
    });
    wmsSources.push(wmsSource);
    var wms = new TileLayer({
      source: wmsSource
    });
    vm.map.addLayer(wms);
  }

  const featureInfo = new Overlay({
    id: "featureInfoOverlay",
    element: document.getElementById("featureInfo")
  });
  vm.map.addOverlay(featureInfo);

  vm.map.on("singleclick", event => {
    const viewResolution = vm.map.getView().getResolution();
    const url = wmsSources[0].getGetFeatureInfoUrl(
      event.coordinate,
      viewResolution,
      "EPSG:3857",
      {
        INFO_FORMAT: "text/xml",
        LAYERS: queryLayers.join(","),
        QUERY_LAYERS: queryLayers.join(",")
      }
    );
    if (url) {
      vm.showGetFeatureInfo(url, event.coordinate);
    }
  });
};
