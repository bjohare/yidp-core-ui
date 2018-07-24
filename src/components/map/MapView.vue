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
import { initMap, loadWMSLayers } from "./wms";
import appOverlay from "./Overlay.vue";

export default {
  props: ["userMap"],
  data() {
    return {
      info: null,
      showPopover: false
    };
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
    // triggerWFSLayersAdded() {
    //   this.$map.$emit("overlays-added");
    // }
  },
  components: {
    appOverlay
  },
  mounted() {
    this.initializeMap();
    this.loadInitalLayers();
  },
  created() {
    const _vm = this;
    this.$map.$on("map-destroy", $event => {
      _vm.$map.userMap = null;
    });
  }
};
</script>
<style lang="scss" scoped>
#map {
  width: auto;
  height: 100%;
}
</style>
