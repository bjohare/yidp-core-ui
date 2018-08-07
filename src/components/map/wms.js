import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";

const mapDefaults = {
  zoom: 7,
  center: [15.51, 48.47]
};

const resetMapViewControl = (vm, map) => {
  let control = new L.Control({ position: "topleft" });
  control.onAdd = function(map) {
    var azoom = L.DomUtil.create("div", "leaflet-bar");
    azoom.innerHTML =
      '<a title="Reset Map" class="leaflet-control-resetmap"><span class="fa fa-refresh"></span></a>';
    L.DomEvent.disableClickPropagation(azoom).addListener(
      azoom,
      "click",
      function() {
        map.setView(mapDefaults.center, mapDefaults.zoom);
      },
      azoom
    );
    return azoom;
  };
  return control;
};

export const initMap = vm => {
  vm.map = L.map("map").setView(vm.userMap.center, vm.userMap.zoom);
  resetMapViewControl(vm, vm.map).addTo(vm.map);
  vm.$root.$emit("map-init", vm.map);
};

const fetchGeonodeWMSLayers = async vm => {
  return vm.$store.dispatch("geonode/fetchGeonodeWMSLayers", vm);
};

export const fetchGeonodeSelectedLayers = async (vm, selected) => {
  const payload = {
    vm,
    selected
  };
  return vm.$store.dispatch("geonode/fetchGeonodeSelectedLayers", payload);
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

L.LayerGroup.YIDP = L.LayerGroup.extend({
  name: ""
});
L.layerGroup.yidp = options => new L.LayerGroup.YIDP(options);

export const loadBaseLayers = async map => {
  var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  var osmAttrib =
    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib, zIndex: 200 });
  osm.addTo(map);
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
    { name: "OpenStreetMap", layer: osm, opacity: 1, checked: true },
    { name: "Esri World Imagery", layer: esri, opacity: 1, checked: "" }
  ];
  return baseLayers;
};

export const loadWMSLayers = async vm => {
  let baseLayers = await loadBaseLayers(vm.map);
  const layers = await fetchGeonodeWMSLayers(vm);
  let wmsLayers = [];
  const wmsUrl = vm.userMap.wmsBaseUrl;
  let zIndex = 400;
  for (let idx in layers) {
    zIndex++;
    let layer = layers[idx];
    let typename = layer.typename;
    let params = {
      layers: typename,
      version: "1.3.0",
      format: "image/png",
      transparent: "true",
      tiled: true,
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

export const loadOverlays = async (vm, selected) => {
  const layerGroups = await fetchGeonodeSelectedLayers(vm, selected);
  const userMap = vm.userMap;
  const wmsUrl = vm.userMap.wmsBaseUrl;
  let zIndex = 600;
  let params = {
    service: "WMS",
    version: "1.3.0",
    format: "image/png",
    transparent: "true",
    tiled: true,
    minZoom: vm.userMap.minZoom,
    maxZoom: vm.userMap.maxZoom
  };
  let defaultState = { checked: true, opacity: 0.65 };
  for (let group in layerGroups) {
    const layers = layerGroups[group];
    let state = vm.$store.getters["usermaps/getFeatureGroup"](
      userMap.id,
      group
    );
    const groupState =
      state === undefined
        ? { checked: true, enabled: true, layers: [] }
        : state;
    let lyrGroup = L.layerGroup.yidp();
    lyrGroup.name = group;
    lyrGroup.setZIndex(600);
    let subLayers = [];
    await layers.reduce(async (promise, layer) => {
      await promise;
      var parameters = L.Util.extend(params, {
        layers: layer.typename
      });
      let state = groupState.layers.find(l => {
        return l.name === layer.title;
      });
      let layerState = state === undefined ? defaultState : state;
      let lyr = L.tileLayer
        .wms_auth(wmsUrl, parameters)
        .addTo(vm.map)
        .setZIndex(zIndex)
        .addTo(lyrGroup);
      lyr.name = layer.title;
      var subLayer = {
        name: layer.title,
        groupName: group,
        mapId: userMap.id,
        checked: layerState.checked,
        opacity: layerState.opacity
      };
      subLayers.push(subLayer);
    }, Promise.resolve());
    let layerGroup = {
      name: group,
      layers: subLayers,
      mapId: userMap.id,
      checked: groupState.checked
    };
    vm.addOverlay(layerGroup, lyrGroup);
  }
  vm.$root.$emit("overlays-added");
};
