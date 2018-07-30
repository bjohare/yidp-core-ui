import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";
import { defaultStyle, defaultMarkerStyle } from "./styles";
export const fetchGeonodeWFSLayers = async (vm, selected) => {
  const payload = {
    vm,
    selected
  };
  return vm.$store.dispatch("geonode/fetchGeonodeWFSLayers", payload);
};

L.FeatureGroup.YIDP = L.FeatureGroup.extend({
  name: ""
});
L.featureGroup.yidp = options => new L.FeatureGroup.YIDP(options);

L.GeoJSON.YIDP = L.GeoJSON.extend({
  name: ""
});
L.geoJson.yidp = (data, options) => new L.GeoJSON.YIDP(data, options);

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
    checked: true,
    opacity: 0.65,
    style: defaultStyle
  };
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
    var featureGroup = L.featureGroup.yidp();
    featureGroup.name = group;
    featureGroup.setZIndex(600);
    let subLayers = [];
    await layers.reduce(async (promise, layer) => {
      await promise;
      var parameters = L.Util.extend(defaultParameters, {
        typeName: layer.typename
      });
      let state = groupState.layers.find(l => {
        return l.name === layer.title;
      });
      let layerState = state === undefined ? defaultState : state;
      const url = rootUrl + L.Util.getParamString(parameters);
      let result = await geoserverAxios.get(url);
      let options = {
        style: layerState.style,
        onEachFeature: function(feature, layer) {
          vm.showOverlay(vm, feature, layer);
        },
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, defaultMarkerStyle); // cluster here..
        }
      };
      let lyr = L.geoJson.yidp(result.data, options).addTo(featureGroup);
      lyr.name = layer.title;
      var subLayer = {
        name: layer.title,
        groupName: group,
        mapId: userMap.id,
        checked: layerState.checked,
        opacity: layerState.opacity,
        style: layerState.style
      };
      subLayers.push(subLayer);
    }, Promise.resolve());
    let layerGroup = {
      name: group,
      layers: subLayers,
      mapId: userMap.id,
      checked: groupState.checked
    };
    vm.addWFSOverlay(layerGroup, featureGroup);
  }
  vm.$emit("overlays-added");
};
