import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";
import { defaultStyle } from "./styles";
export const fetchGeonodeWFSLayers = async (vm, selected) => {
  const payload = {
    vm,
    selected
  };
  return vm.$store.dispatch("geonode/fetchGeonodeWFSLayers", payload);
};

export const loadVectors = async (vm, selected) => {
  const layerGroups = await fetchGeonodeWFSLayers(vm, selected);
  const userMap = vm.userMap;
  const rootUrl = "/geoserver/geonode/ows";
  let defaultParameters = {
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    outputFormat: "application/json",
    srsName: "EPSG:4326"
  };
  let defaultState = {
    enabled: true,
    checked: true,
    opacity: 1,
    style: defaultStyle
  };
  for (let group in layerGroups) {
    const layers = layerGroups[group];
    var featureGroup = L.featureGroup();
    featureGroup.setZIndex(600);
    let subLayers = [];
    await layers.reduce(async (promise, layer) => {
      await promise;
      var parameters = L.Util.extend(defaultParameters, {
        typeName: layer.typename
      });
      let state = vm.$store.getters["usermaps/getLayerState"](
        userMap.id,
        layer.title
      );
      let layerState = state === undefined ? defaultState : state;
      const url = rootUrl + L.Util.getParamString(parameters);
      let result = await geoserverAxios.get(url);
      var lyr = L.geoJson(result.data, {
        style: layerState.style,
        onEachFeature: function(feature, layer) {
          // popup config here..
          layer.bindPopup();
        },
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng); // cluster here..
        }
      }).addTo(featureGroup);
      var subLayer = {
        name: layer.title,
        groupName: group,
        mapId: userMap.id,
        layer: lyr,
        enabled: layerState.enabled,
        checked: layerState.checked,
        opacity: layerState.opacity,
        style: layerState.style
      };
      subLayers.push(subLayer);
    }, Promise.resolve());
    let layerGroup = {
      name: group,
      layer: featureGroup,
      layers: subLayers,
      mapId: userMap.id,
      enabled: true,
      checked: true
    };
    vm.addWFSOverlay(layerGroup, featureGroup);
  }
  vm.$emit("overlays-loaded");
};
