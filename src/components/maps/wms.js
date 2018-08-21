import * as L from "leaflet";

import { geoserverAxios } from "../../store/axios";

const mapDefaults = {
  zoom: 7,
  center: [15.51, 48.47]
};

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

const resetMapViewControl = map => {
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
  vm.map = L.map("map").setView(vm.mapConfig.center, vm.mapConfig.zoom);
  resetMapViewControl(vm.map).addTo(vm.map);
  vm.map.on("moveend", event => {
    const position = {
      mapId: vm.mapConfig.id,
      zoom: event.target.getZoom(),
      center: event.target.getCenter()
    };
    vm.$store.dispatch("maps/saveMapPosition", position);
  });
};

L.TileLayer.WMS_AUTH = L.TileLayer.WMS.extend({
  isOverlay: false,
  initialize: function(url, vm, wmsParams, options) {
    L.TileLayer.WMS.prototype.initialize.call(this, url, wmsParams);
    this.title = options.title;
    this.typename = options.typename;
    this.featureInfo = options.featureInfo;
    this.vm = vm;
  },
  createTile(coords, done) {
    const url = this.getTileUrl(coords);
    const img = document.createElement("img");
    // TODO: switch to geonodeAxios and test access_token works..
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
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on("click", this.getFeatureInfo, this);
  },
  onRemove: function(map) {
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off("click", this.getFeatureInfo, this);
  },
  getFeatureInfo: function(evt) {
    let layer = this;
    let featureInfo =
      this.featureInfo !== ({} || undefined)
        ? this.featureInfo.getFeatureInfo
        : null;
    let url = this.getFeatureInfoUrl(evt.latlng);
    // TODO: switch to geonodeAxios and test access_token works..
    geoserverAxios.get(url).then(response => {
      if (response.data && response.data.features.length > 0) {
        let feature = {
          title: layer.title,
          properties: response.data.features[0].properties,
          featureInfo: featureInfo,
          map: this.vm.map,
          latlng: evt.latlng
        };
        this.vm.$root.$emit("feature-selected", feature);
      }
    });
  },
  getFeatureInfoUrl: function(latlng) {
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

export const loadWMSLayer = (vm, layer) => {
  const wmsUrl = vm.mapConfig.wmsBaseUrl;
  let typename = layer.typename;
  let wmsParams = {
    layers: typename,
    version: "1.1.1",
    format: "image/png",
    transparent: "true",
    tiled: true,
    minZoom: vm.mapConfig.minZoom,
    maxZoom: vm.mapConfig.maxZoom
  };
  const wmsLayer = L.tileLayer
    .wms_auth(wmsUrl, vm, wmsParams, {
      title: layer.title,
      typename: layer.typename,
      featureInfo: layer.featureInfo
    })
    .addTo(vm.map)
    .setOpacity(layer.opacity)
    .setZIndex(400);
  return wmsLayer;
};
