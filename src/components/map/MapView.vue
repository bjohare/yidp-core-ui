<template>
  <div style="height: inherit;">
      <div id="map" class="d-flex">
        <div ref="overlay">
          <app-overlay :features="selectedFeatures" :showPopover="showPopover"></app-overlay>
        </div>
      </div>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { initMap, loadWMSLayers } from "./wms";
import appOverlay from "../layers/LayerOverlay.vue";

export default {
  data() {
    return {
      map: null,
      userMap: null,
      info: null,
      selectedFeatures: []
    };
  },
  computed: {
    showPopover() {
      return this.selectedFeatures.length > 0;
    }
  },
  components: {
    appOverlay
  },
  methods: {
    async showGetFeatureInfo(url, coordinate) {
      this.showPopover = false;
      const featureInfo = this.map.getOverlayById("featureInfoOverlay");
      featureInfo.setPosition(coordinate);
      // const response = await axios.get(url);
      // const data = response.data;
    },
    initializeMap() {
      initMap(this);
      this.$root.$emit("map-init", this.map);
    },
    async loadInitalLayers() {
      await loadWMSLayers(this);
    },
    triggerLayersAdded(baseLayers, wmsLayers) {
      this.$root.$emit("base-layers-added", baseLayers, wmsLayers);
    },
    loadUserMap() {
      const id = this.$route.params.id;
      this.userMap = this.$store.getters["usermaps/getUserMap"](id);
    },
    resetSelectedFeature() {
      // this.selectedFeature.layer.setStyle(this.selectedFeature.style);
    }
  },
  mounted() {
    this.initializeMap();
    this.loadInitalLayers();
    this.$nextTick(() => {
      this.$refs.overlay.onclick = e => {
        e.preventDefault();
      };
      this.$refs.overlay.onwheel = e => {
        e.preventDefault();
      };
    });
  },
  created() {
    const _vm = this;
    this.loadUserMap();
    this.$root.$on("map-init", map => {
      map.on("click", e => {
        if (_vm.selectedFeatures.length === 2) {
          _vm.selectedFeatures = [];
        }
      });
    });
    this.$root.$on("map-destroy", () => {
      _vm.map = null;
      _vm.userMap = null;
    });
    this.$root.$on("feature-selected", feature => {
      if (this.selectedFeatures.length === 2) {
        this.selectedFeatures = [];
      }
      this.selectedFeatures.push(feature);
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
