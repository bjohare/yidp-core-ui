<template>
  <div class="message p-3">
    <div class="mb-3 mr-3">
      <b-form-group label="Filter by:">
        <b-form-radio-group stacked name="layers" v-for="(layer, index) in layers" :key="index" v-model="filterLayer">
          <b-form-radio class="layer m-1" :value="layer.value" @change="selectLayer(layer)">{{layer.name}}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <div v-if="!selectedLayer">Select a feature on the map.</div>
      <div class="mt-2 mb-2" v-if="selectedLayer">
        <strong>Filter by: </strong><em>{{ selectedLayer.feature.properties.name_en }}</em>
        <i class="fa fa-close fa-sm ml-2" @click="clearSelectedLayer"></i>
      </div>
      <b-form-group label="Select data layer:" class="h5" v-if="selectedLayer">
        <b-form-select class="mb-3" v-model="dataLayer" @input="describeFeature">
          <template slot="first">
            <option :value="null" disabled>-- Select the data to filter --</option>
          </template>
          <option v-for="(option, index) in options" :key="index" :value="option.value">
            {{ option.text }}
          </option>
        </b-form-select>
      </b-form-group>
      <b-button v-if="dataLayer !== null" variant="primary" @click="filterData">Filter Data</b-button>
    </div>
    <div id="filteredData" v-if="filteredData">
     Found {{ filteredData.totalFeatures }} features.
    </div>
  </div>
</template>
<script>
import { Stretch } from "vue-loading-spinner";
import axios from "axios";
import * as L from "leaflet";
import { filterStyle, selectedFilterStyle } from "@/components/maps/styles";
import { filterWMSLayer } from "@/components/maps/wms";
import { filterWFSLayer, describeFeatureType } from "./wfs";
import { mapGetters } from "vuex";

import WKT from "terraformer-wkt-parser";
export default {
  props: ["tabs", "mapConfig", "map"],
  data() {
    return {
      featureGroup: L.featureGroup(),
      layers: [],
      wmsLayers: [],
      filterLayer: "admin1",
      dataLayer: null,
      selectedLayer: null
    };
  },
  computed: {
    options() {
      let options = [];
      let layers = this.$store.state.maps.layers.slice();
      layers.reverse().forEach(layer => {
        if (layer.checked) {
          let opt = { value: layer.typename, text: layer.title };
          options.push(opt);
        }
      });
      return options;
    },
    mapLayers() {
      return this.$store.state.maps.layers;
    },
    ...mapGetters({
      filteredData: "analysis/getFilteredData"
    })
  },
  methods: {
    async loadAnalysisLayers() {
      let layers = [];
      layers[0] = await axios.get("/assets/layers/yem_admin_0.geojson");
      layers[1] = await axios.get("/assets/layers/yem_admin_1.geojson");
      layers[2] = await axios.get("/assets/layers/yem_admin_2.geojson");
      this.featureGroup.setZIndex(200);
      let options = {
        style: filterStyle,
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name_en, {
            sticky: true,
            className: "analysis-tooltip"
          });
          layer.on("click", e => {
            this.selectFilter(e.target);
            if (this.dataLayer) {
              this.filterData();
            }
          });
        }
      };
      var admin0 = L.geoJSON(layers[0].data, options);
      var admin1 = L.geoJSON(layers[1].data, options);
      var admin2 = L.geoJSON(layers[2].data, options);
      admin1.addTo(this.featureGroup);
      const admin0Layer = {
        name: "National Level",
        value: "admin0",
        layer: admin0
      };
      const admin1Layer = {
        name: "Governorate Level",
        value: "admin1",
        layer: admin1
      };
      const admin2Layer = {
        name: "District Level",
        value: "admin2",
        layer: admin2
      };
      this.layers.push(admin0Layer);
      this.layers.push(admin1Layer);
      this.layers.push(admin2Layer);
    },
    selectLayer(layer) {
      this.featureGroup.clearLayers();
      this.featureGroup.addLayer(layer.layer);
      this.clearSelectedLayer();
    },
    selectFilter(layer) {
      if (this.selectedLayer) {
        this.selectedLayer.setStyle(filterStyle);
      }
      this.selectedLayer = layer;
      layer.setStyle(selectedFilterStyle);
      layer.bringToFront();
    },
    clearSelectedLayer() {
      this.$root.$emit("clear-filter", this.dataLayer);
      if (this.selectedLayer) this.selectedLayer.setStyle(filterStyle);
      this.selectedLayer = null;
      this.dataLayer = null;
      this.clearFilteredLayers();
      this.$store.dispatch("analysis/saveFilteredData", null);
    },
    clearFilteredLayers() {
      this.wmsLayers.forEach(layer => {
        layer.removeFrom(this.map);
      });
      this.wmsLayers = [];
      this.featureGroup.eachLayer(layer => {
        layer.eachLayer(lyr => {
          lyr.redraw();
        });
      });
      this.map.invalidateSize();
    },
    getLayer(typename) {
      return this.mapLayers.find(layer => {
        return layer.typename === typename;
      });
    },
    async filterData() {
      this.clearFilteredLayers();
      this.$root.$emit("filter-wms", this.dataLayer);
      const wkt = WKT.convert(this.selectedLayer.toGeoJSON().geometry);
      const query = "CQL_FILTER=WITHIN(the_geom, " + wkt + ")";
      const layer = this.getLayer(this.dataLayer);
      const filtered = filterWMSLayer(this, layer, query);
      const data = await filterWFSLayer(this, layer, query);
      this.$store.dispatch("analysis/saveFilteredData", data);
      filtered.addTo(this.map);
      this.wmsLayers.push(filtered);
      this.map.fitBounds(this.selectedLayer.getBounds());
      this.map.invalidateSize();
    },
    async describeFeature(typename) {
      const data = await describeFeatureType(typename);
    }
  },
  components: {
    appSpinner: Stretch
  },
  created() {
    const _vm = this;
    this.loadAnalysisLayers();
    this.$root.$on("changed::tab", $event => {
      if ($event.tabs[$event.currentTab].id === "analysis") {
        this.featureGroup.addTo(_vm.map);
      } else this.featureGroup.removeFrom(_vm.map);
      _vm.clearSelectedLayer();
    });
    this.$root.$on("map-destroy", () => {
      _vm.clearSelectedLayer();
    });
  }
};
</script>
<style>
.analysis-tooltip {
  font-size: 10pt;
  font-weight: 600;
}
.layer label {
  font-size: 11pt;
  font-weight: 600;
}
label.custom-control-label::after {
  margin-bottom: 10px;
}
</style>
