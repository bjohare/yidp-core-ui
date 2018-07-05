<template>
  <div style="height: inherit;">
      <div id="map" class="d-flex"></div>
      <!-- <app-overlay :info="info" :showPopover="showPopover"></app-overlay> -->
  </div>
</template>
<script>
import WMSGetFeatureInfo from "ol/format/WMSGetFeatureInfo";
import "leaflet/dist/leaflet.css";
import axios from "axios";
// import * as methods from "./methods";
import { initMap, loadWMSLayers } from "./wms_map_leaflet";
import appOverlay from "./Overlay.vue";

import { mapState } from "vuex";

export default {
  data() {
    return {
      map: null,
      layers: [],
      maxExtent: [35, 10, 66, 28],
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
      center: state => state.center,
      minZoom: state => state.minZoom,
      maxZoom: state => state.maxZoom
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
    },
    initializeMap() {
      initMap(this);
    },
    async loadInitalLayers() {
      await loadWMSLayers(this);
    },
    triggerLayersAdded() {
      this.$map.$emit("layers-added");
    }
  },
  components: {
    appOverlay
  },
  mounted() {
    this.initializeMap();
    this.loadInitalLayers();
  }
};
</script>
<style lang="scss" scoped>
#map {
  width: auto;
  height: 100%;
}
</style>
