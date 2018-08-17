<template>
  <div style="height: inherit;">
      <div id="map" class="d-flex">
        <div ref="overlay">
          <app-overlay :features="selectedFeatures"
            :showPopover="showPopover" @dismissed="clearSelectedFeatures"></app-overlay>
        </div>
      </div>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { initMap, loadWMSLayers } from "./wms";
import appOverlay from "../layers/LayerOverlay.vue";
import * as L from "leaflet";

export default {
  props: ["mapId"],
  data() {
    return {
      map: null,
      mapConfig: null,
      info: null,
      selectedFeatures: [],
      selection: null
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
    loadMapConfig() {
      this.mapConfig = this.$store.getters["maps/getMap"](this.mapId);
      this.mapConfig.id = this.mapId;
    },
    clearSelectedFeatures() {
      this.selectedFeatures = [];
      if (this.selection) {
        this.map.removeLayer(this.selection);
      }
    },
    addSelectedIndicator() {
      if (this.showPopover) {
        const latlng = this.selectedFeatures[0].latlng;
        if (this.selection) {
          this.map.removeLayer(this.selection);
        }
        this.selection = L.circleMarker(latlng, {
          color: "#4000ff",
          fillColor: "lightblue",
          fillOpacity: 0.8,
          radius: 25
        });
        this.selection.addTo(this.map);
        // this.map.panTo(latlng);
      }
    }
  },
  mounted() {
    this.initializeMap();
    this.loadInitalLayers();
  },
  created() {
    const _vm = this;
    this.loadMapConfig();
    this.$root.$on("map-init", map => {
      map.on("click", e => {
        this.selectedFeatures = [];
        if (_vm.selection) {
          map.removeLayer(_vm.selection);
        }
      });
    });
    this.$root.$on("map-destroy", () => {
      _vm.map = null;
      _vm.mapConfig = null;
    });
    this.$root.$on("feature-selected", feature => {
      this.selectedFeatures.push(feature);
      this.addSelectedIndicator();
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
