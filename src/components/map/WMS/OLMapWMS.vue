<template>
  <div>
    <div id="map" class="map"></div>
    <app-overlay :info="info" :showPopover="showPopover"></app-overlay>
  </div>
</template>
<script>
import WMSGetFeatureInfo from "ol/format/WMSGetFeatureInfo";

import axios from "axios";
// import * as methods from "./methods";
import { initMap, loadWMSLayers } from "./wms_map";
import appOverlay from "../Overlay.vue";

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
  mounted() {
    initMap(this);
    loadWMSLayers(this);
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
