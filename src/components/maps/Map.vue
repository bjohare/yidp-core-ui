<template>
  <div style="height: inherit;">
    <multipane layout="horizontal" @paneResize="resize" id="multipane">
      <div id="map" :style="{ height: mapHeight}">
        <div ref="overlay">
          <app-overlay :features="selectedFeatures"
            :showPopover="showPopover" @dismissed="clearSelectedFeatures"></app-overlay>
        </div>
      </div>
      <multipane-resizer v-if="showDataPane"></multipane-resizer>
      <div id="datapane" ref="datatable" :style="{ height: dataHeight, flexGrow: 1 }" v-if="showDataPane">
          <app-data-table></app-data-table>
      </div>
    </multipane>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { initMap, loadBaseLayers } from "./wms";
import appOverlay from "@/components/controls/FeatureInfoControl.vue";
import appDataTable from "@/components/analysis/DataTable.vue";
import { Multipane, MultipaneResizer } from "vue-multipane";

import * as L from "leaflet";

export default {
  props: ["id"],
  data() {
    return {
      map: null,
      mapConfig: this.$store.getters["maps/getMap"](this.id),
      info: null,
      selectedFeatures: [],
      selection: null,
      isAnalysisActive: false
    };
  },
  computed: {
    showPopover() {
      return this.selectedFeatures.length > 0 && !this.isAnalysisActive;
    },
    mapHeight() {
      if (
        this.isAnalysisActive &&
        this.$store.state.analysis.filteredData !== null
      ) {
        return "60%";
      } else {
        return "100%";
      }
    },
    dataHeight() {
      if (
        this.isAnalysisActive &&
        this.$store.state.analysis.filteredData !== null
      ) {
        return "40%";
      } else {
        return "0";
      }
    },
    showDataPane() {
      return this.$store.state.analysis.filteredData !== null;
    }
  },
  components: {
    appOverlay,
    appDataTable,
    Multipane,
    MultipaneResizer
  },
  methods: {
    initializeMap() {
      initMap(this);
      this.map.on("click", e => {
        this.selectedFeatures = [];
        if (this.selection) {
          this.map.removeLayer(this.selection);
        }
      });
      this.$root.$emit("map-init", this.map);
    },
    async loadBaseLayers() {
      const baseLayers = await loadBaseLayers(this.map);
      this.$root.$emit("base-layers-added", baseLayers);
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
    },
    resize() {
      this.$nextTick(() => {
        this.map.invalidateSize();
      });
    }
  },
  mounted() {
    this.initializeMap();
    this.loadBaseLayers();
  },
  created() {
    this.$root.$on("feature-selected", feature => {
      const lyr = this.$store.getters["maps/getLayer"](feature.typename);
      if (lyr && lyr.checked) {
        this.selectedFeatures.push(feature);
        this.selectedFeatures.reverse();
        this.addSelectedIndicator();
      }
    });
    this.$root.$on("changed::tab", $event => {
      if ($event.tabs[$event.currentTab].id === "analysis") {
        this.isAnalysisActive = true;
      } else {
        this.isAnalysisActive = false;
      }
      this.clearSelectedFeatures();
    });
  }
};
</script>
<style lang="scss" scoped>
#map {
  width: auto;
  min-height: 30%;
}
#datapane {
  overflow: auto;
  min-height: 30%;
}
#multipane {
  height: 100%;
}
</style>
