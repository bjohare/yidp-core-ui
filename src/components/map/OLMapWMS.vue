<template>
  <div>
    <div id="map" class="map"></div>
    <app-overlay :info="info" :showPopover="showPopover"></app-overlay>
  </div>
</template>
<script>
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import TileWMS from "ol/source/TileWMS";
import { transformExtent, fromLonLat, toLonLat } from "ol/proj";
import WMSGetFeatureInfo from "ol/format/WMSGetFeatureInfo";

import axios from "axios";
// import * as methods from "./methods";
import appOverlay from "./Overlay.vue";

import { mapState } from "vuex";

export default {
  data() {
    return {
      map: null,
      layers: [],
      maxExtent: [35, 10, 66, 28],
      minZoom: 5,
      info: null,
      showPopover: false
    };
  },
  computed: {
    ...mapState("map", {
      mapTitle: state => state.title,
      wmsBaseUrl: state => state.wmsBaseUrl,
      geonodeMap: state => state.map,
      zoom: state => state.zoom,
      center: state => state.center
    })
  },
  methods: {
    async showGetFeatureInfo(url, coordinate) {
      this.showPopover = false;
      const featureInfo = this.map.getOverlayById("featureInfoOverlay");
      featureInfo.setPosition(coordinate);
      this.info = null;
      console.log(url);
      const response = await axios.get(url);
      const data = response.data;
      const features = new WMSGetFeatureInfo().readFeatures(data);
      if (features.length) {
        const props = features[0].getProperties();
        const geomName = features[0].getGeometryName();
        delete props[geomName];
        this.info = props;
        this.showPopover = true;
      }
    }
  },
  components: {
    appOverlay
  },
  created() {
    this.$store.dispatch("map/fetchGeonodeMap");
    this.$store.dispatch("map/fetchWMSCapabilities");
  },
  mounted() {
    const view = new View({
      extent: transformExtent(this.maxExtent, "EPSG:4326", "EPSG:3857"),
      center: fromLonLat(this.center),
      zoom: this.zoom,
      minZoom: this.minZoom
    });
    this.map = new Map({
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

    const wmsSource = new TileWMS({
      url: this.wmsBaseUrl,
      params: {
        // LAYERS: "yem_admin1,healthsites",
        LAYERS: "yem_admin1,healthsites",
        VERSION: "1.3.0",
        FORMAT: "image/png",
        TILED: true
      }
    });

    var yemen = new TileLayer({
      source: wmsSource
    });

    this.map.addLayer(yemen);

    const featureInfo = new Overlay({
      id: "featureInfoOverlay",
      element: document.getElementById("featureInfo")
    });
    this.map.addOverlay(featureInfo);

    this.map.on("moveend", event => {
      const position = {
        zoom: event.map.getView().getZoom(),
        center: toLonLat(event.map.getView().getCenter())
      };
      this.$store.dispatch("map/saveMapPosition", position);
    });

    this.map.on("singleclick", event => {
      const viewResolution = view.getResolution();
      const url = wmsSource.getGetFeatureInfoUrl(
        event.coordinate,
        viewResolution,
        "EPSG:3857",
        { INFO_FORMAT: "text/xml" }
      );
      if (url) {
        this.showGetFeatureInfo(url, event.coordinate);
      }
    });
  }
};
</script>
<style>
@import "ol/ol.css";

html,
body {
  margin: 0;
  height: 100%;
}
#map {
  /* position: absolute; */
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
