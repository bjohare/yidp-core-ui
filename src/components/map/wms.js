import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";

const mapDefaults = {
  zoom: 7,
  center: [15.51, 48.47]
};

const resetMapViewControl = (vm, map) => {
  let control = new L.Control({ position: "topleft" });
  control.onAdd = function(map) {
    var reset = L.DomUtil.create("div", "leaflet-bar");
    reset.innerHTML =
      '<a title="Reset Map" class="leaflet-control-resetmap"><span class="fa fa-refresh"></span></a>';
    L.DomEvent.disableClickPropagation(reset).addListener(
      reset,
      "click",
      function() {
        map.setView(mapDefaults.center, mapDefaults.zoom);
      },
      reset
    );
    return reset;
  };
  return control;
};

export const initMap = vm => {
  vm.map = L.map("map").setView(vm.userMap.center, vm.userMap.zoom);
  resetMapViewControl(vm, vm.map).addTo(vm.map);
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
  isOverlay: false,
  initialize: function(url, vm, wmsParams, options) {
    L.TileLayer.WMS.prototype.initialize.call(this, url, wmsParams);
    this.name = options.name;
    this.vm = vm;
    this.isOverlay = options.isOverlay;
  },
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
  },

  onAdd: function(map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    if (this.isOverlay) {
      map.on("click", this.getFeatureInfo, this);
    }
  },
  onRemove: function(map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    if (this.isOverlay) {
      map.off("click", this.getFeatureInfo, this);
    }
  },
  getFeatureInfo: function(evt) {
    let layer = this;
    // Make an AJAX request to the server and hope for the best
    let url = this.getFeatureInfoUrl(evt.latlng);
    geoserverAxios.get(url).then(response => {
      if (response.data && response.data.features.length > 0) {
        let feature = {
          name: layer.name,
          properties: response.data.features[0].properties
        };
        this.vm.$root.$emit("feature-selected", feature);
      }
    });
  },
  getFeatureInfoUrl: function(latlng) {
    // Construct a GetFeatureInfo request URL given a point
    let point = this._map.latLngToContainerPoint(latlng, this._map.getZoom());
    let size = this._map.getSize();
    let params = {
      request: "GetFeatureInfo",
      service: "WMS",
      srs: "EPSG:4326",
      styles: this.wmsParams.styles,
      transparent: this.wmsParams.transparent,
      version: "1.1.1",
      format: this.wmsParams.format,
      bbox: this._map.getBounds().toBBoxString(),
      height: size.y,
      width: size.x,
      layers: this.wmsParams.layers,
      query_layers: this.wmsParams.layers,
      feature_count: 1,
      info_format: "application/json"
    };

    params[params.version === "1.3.0" ? "i" : "x"] = point.x;
    params[params.version === "1.3.0" ? "j" : "y"] = point.y;

    return this._url + L.Util.getParamString(params, this._url, true);
  }
});

L.tileLayer.wms_auth = (url, vm, wmsParams, options) =>
  new L.TileLayer.WMS_AUTH(url, vm, wmsParams, options);

L.LayerGroup.YIDP = L.FeatureGroup.extend({
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
    let wmsParams = {
      layers: typename,
      version: "1.1.1",
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
        .wms_auth(wmsUrl, vm, wmsParams, { name: layer.title })
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
  let zIndex = 700;
  let params = {
    service: "WMS",
    version: "1.1.1",
    format: "image/png",
    transparent: "true",
    tiled: true,
    minZoom: vm.userMap.minZoom,
    maxZoom: vm.userMap.maxZoom
  };
  let legendParams = {
    request: "GetLegendGraphic",
    version: "1.1.1",
    format: "image/png",
    width: 20,
    height: 20
  };
  let defaultState = { checked: true, opacity: 0.65 };
  for (let group in layerGroups) {
    zIndex++;
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
      let wmsParams = L.Util.extend(params, {
        layers: layer.typename
      });
      let legendParam = L.Util.extend(legendParams, { layer: layer.typename });
      let legendUrl = wmsUrl + L.Util.getParamString(legendParam);
      let state = groupState.layers.find(l => {
        return l.name === layer.title;
      });
      let layerState = state === undefined ? defaultState : state;
      let options = { name: layer.title, isOverlay: true };
      L.tileLayer
        .wms_auth(wmsUrl, vm, wmsParams, options)
        .addTo(vm.map)
        .setZIndex(zIndex)
        .setOpacity(layerState.opacity)
        .addTo(lyrGroup);
      var subLayer = {
        name: layer.title,
        groupName: group,
        mapId: userMap.id,
        checked: layerState.checked,
        opacity: layerState.opacity,
        legendUrl: legendUrl,
        abstract: layer.abstract
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
