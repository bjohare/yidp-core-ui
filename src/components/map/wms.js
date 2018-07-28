import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";

export const initMap = vm => {
  vm.map = L.map("map").setView(vm.userMap.center, vm.userMap.zoom);
  vm.$root.$emit("map-init", vm.map);
};

const fetchGeonodeWMSLayers = async vm => {
  return vm.$store.dispatch("geonode/fetchGeonodeWMSLayers", vm);
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
    attribution: osmAttrib,
    zIndex: 200
  });
  osm.addTo(vm.map);
  const mapLink = '<a href="http://www.esri.com/">Esri</a>';
  const wholink =
    "i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
  const esriUrl =
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const esri = L.tileLayer(esriUrl, {
    attribution: "&copy; " + mapLink + ", " + wholink,
    maxZoom: 17,
    zIndex: 200
  });
  const baseLayers = [
    {
      name: "OpenStreetMap",
      layer: osm,
      opacity: 1,
      checked: true
    },
    {
      name: "Esri World Imagery",
      layer: esri,
      opacity: 1,
      checked: ""
    }
  ];
  const layers = await fetchGeonodeWMSLayers(vm);
  let wmsLayers = [];
  const queryLayers = [];
  const wmsUrl = vm.userMap.wmsBaseUrl;
  let zIndex = 400;
  for (let idx in layers) {
    zIndex++;
    let layer = layers[idx];
    let typename = layer.typename;
    queryLayers.push(layer.typename);
    let params = {
      LAYERS: typename,
      VERISON: "1.3.0",
      FORMAT: "image/png",
      TRANSPARENT: "true",
      TILED: true,
      minZoom: vm.userMap.minZoom,
      maxZoom: vm.userMap.maxZoom
    };
    wmsLayers.push({
      name: layer.title,
      checked: "checked",
      enabled: true,
      opacity: 1,
      layer: L.tileLayer
        .wms_auth(wmsUrl, params)
        .addTo(vm.map)
        .setZIndex(zIndex)
    });
  }
  vm.triggerLayersAdded(baseLayers, wmsLayers);

  vm.map.on("moveend", event => {
    const position = {
      mapId: vm.userMap.id,
      zoom: event.target.getZoom(),
      center: event.target.getCenter()
    };
    vm.$store.dispatch("usermaps/saveMapPosition", position);
  });
};
