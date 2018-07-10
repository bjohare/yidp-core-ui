import * as L from "leaflet";

import { geonodeAxios } from "../../store/axios";

export const fetchGeonodeWFSLayers = async (vm, selected) => {
  const payload = {
    vm,
    selected
  };
  return vm.$store.dispatch("map/fetchGeonodeWFSLayers", payload);
};

export const loadVectors = async (vm, selected) => {
  const layerGroups = await fetchGeonodeWFSLayers(vm, selected);
  const map = vm.$map.map;
  const rootUrl = "/geoserver/geonode/ows";
  const wfsOverlays = [];
  let defaultParameters = {
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    outputFormat: "application/json",
    srsName: "EPSG:4326"
  };
  for (let group in layerGroups) {
    const layers = layerGroups[group];
    var featureGroup = L.featureGroup().addTo(map);
    featureGroup.setZIndex(600);
    let subLayers = [];
    await layers.reduce(async (promise, layer) => {
      var parameters = L.Util.extend(defaultParameters, {
        typeName: layer.typename
      });
      console.log(parameters);
      const url = rootUrl + L.Util.getParamString(parameters);
      console.log(url);
      let result = await geonodeAxios.get(url);
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
        checked: "checked",
        opacity: 1
      };
      subLayers.push(subLayer);
    }, Promise.resolve());
    console.log(subLayers);
    let layerGroup = {
      name: group,
      layer: featureGroup,
      layers: subLayers,
      enabled: true,
      opacity: 1,
      checked: "chedked"
    };
    wfsOverlays.push(layerGroup);
  }
  vm.$map.wfsOverlays = wfsOverlays;
  vm.$map.$emit("overlays-added");
};
