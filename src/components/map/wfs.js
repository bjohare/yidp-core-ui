import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";

export const fetchGeonodeWFSLayers = async (vm, selected) => {
  const payload = {
    vm,
    selected
  };
  return vm.$store.dispatch("geonode/fetchGeonodeWFSLayers", payload);
};

export const loadVectors = async (vm, selected) => {
  const layerGroups = await fetchGeonodeWFSLayers(vm, selected);
  // const map = vm.$map.map;
  const rootUrl = "/geoserver/geonode/ows";
  let defaultParameters = {
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    outputFormat: "application/json",
    srsName: "EPSG:4326"
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
      const url = rootUrl + L.Util.getParamString(parameters);
      let result = await geoserverAxios.get(url);
      var lyr = L.geoJson(result.data, {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "str.1: " +
              feature.properties.str1 +
              "<br />cat: " +
              feature.properties.cat
          );
        },
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng); // cluster here..
        }
      }).addTo(featureGroup);
      var subLayer = {
        name: layer.title,
        layer: lyr,
        enabled: true,
        checked: true,
        opacity: 1
      };
      subLayers.push(subLayer);
    }, Promise.resolve());
    let layerGroup = {
      name: group,
      layer: featureGroup,
      layers: subLayers,
      enabled: true,
      opacity: 1,
      checked: true
    };
    vm.$map.addWFSOverlay(layerGroup);
  }
  vm.$map.$emit("overlays-loaded");
};
