import * as L from "leaflet";

import { geoserverAxios } from "../../../store/axios";

export const initMap = vm => {
  vm.map = L.map("map").setView(vm.center, vm.zoom);
};

const fetchGeonodeLayers = async vm => {
  return vm.$store.dispatch("map/fetchGeonodeLayers", vm);
};

L.TileLayer.WMS_AUTH = L.TileLayer.WMS.extend({
  createTile(coords, done) {
    const url = this.getTileUrl(coords);
    const img = document.createElement("img");
    geoserverAxios
      .get(url, {
        responseType: "blob"
      })
      .then(response => {
        img.src = URL.createObjectURL(response.data);
        done(null, img);
      });
    return img;
  }
});
L.tileLayer.wms_auth = (url, options) => new L.TileLayer.WMS_AUTH(url, options);

export const loadWMSLayers = async vm => {
  var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  var osmAttrib =
    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {
    minZoom: vm.minZoom,
    maxZoom: vm.maxZoom,
    attribution: osmAttrib
  });
  osm.addTo(vm.map);
  const baseLayers = { OpenStreetMap: osm };
  const layers = await fetchGeonodeLayers(vm);
  let wmsLayers = {};
  const queryLayers = [];
  const wmsUrl = vm.wmsBaseUrl;
  console.log(wmsUrl);
  for (let idx in layers) {
    let layer = layers[idx];
    let typename = layer.typename;
    queryLayers.push(layer.typename);
    let params = {
      LAYERS: typename,
      VERISON: "1.3.0",
      FORMAT: "image/png",
      TRANSPARENT: "true",
      TILED: true
    };
    wmsLayers[layer.title] = L.tileLayer.wms_auth(wmsUrl, params).addTo(vm.map);
  }
  console.log(wmsLayers);
  L.control.layers(baseLayers, wmsLayers).addTo(vm.map);
};
