<template>
  <div class="message p-3" v-if="show">
    <div class="pb-5 mr-3 float-left">
      <b-form-group label="Select filter layer:" class="h5">
        <b-form-radio-group stacked name="layers" v-for="(layer, index) in layers" :key="index" v-model="filterLayer">
          <b-form-radio class="layer" :value="layer.value" @change="selectLayer(layer)">{{layer.name}}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <div v-if="!selectedLayer">Select a feature on the map.</div>
      <div class="mt-2 mb-2" v-if="selectedLayer">
        <strong>Filter by: </strong><em>{{ selectedLayer.feature.properties.name_en }}</em>
        <i class="fa fa-close fa-sm ml-2" @click="clearSelectedLayer"></i>
      </div>
      <b-form-group label="Select data layer:" class="h5" v-if="selectedLayer">
        <b-form-select class="mb-3" v-model="dataLayer">
          <template slot="first">
            <option :value="null" disabled>-- Please select the input layer --</option>
          </template>
          <optgroup v-for="(group, name) in options" :key="name" :label="name">
            <option v-for="(option, index) in group" :key="index" :value="option.value">
              {{ option.text }}
            </option>
          </optgroup>
        </b-form-select>
      </b-form-group>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import * as L from "leaflet";
import { filterStyle, selectedFilterStyle } from "@/components/map/styles";
export default {
  props: ["show", "tabs", "userMap", "map"],
  data() {
    return {
      featureGroup: L.featureGroup(),
      layers: [],
      filterLayer: "admin1",
      dataLayer: null,
      selectedLayer: null,
      options: {}
    };
  },
  computed: {
    // datalyers() {
    //   let layers = this.userMap.layers;
    //   layers.forEach(layer => {
    //     this.options[layer.name] = [];
    //     layer.layers.forEach(subLayer => {
    //       let opt = { value: subLayer.name, text: subLayer.name };
    //       this.options[layer.name].push(opt);
    //     });
    //   });
  },
  watch: {
    "userMap.layers": function(layers) {
      layers.forEach(layer => {
        this.options[layer.name] = [];
        layer.layers.forEach(subLayer => {
          let opt = { value: subLayer.name, text: subLayer.name };
          this.options[layer.name].push(opt);
        });
      });
      console.log(this.options);
    }
  },
  methods: {
    async loadAnalysisLayers() {
      let layers = [];
      layers[0] = await axios.get("/assets/layers/yem_admin_1.geojson");
      layers[1] = await axios.get("/assets/layers/yem_admin_2.geojson");
      this.featureGroup.setZIndex(2000);
      let options = {
        style: filterStyle,
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name_en, {
            sticky: true,
            className: "analysis-tooltip"
          });
          layer.on("click", e => {
            this.selectFilter(e.target);
            // prevent featureinfo from showing..
          });
        }
      };
      var admin1 = L.geoJSON(layers[0].data, options);
      var admin2 = L.geoJSON(layers[1].data, options);
      admin1.addTo(this.featureGroup);
      const admin1Layer = {
        name: "Yemen Governorate Boundaries",
        value: "admin1",
        layer: admin1
      };
      const admin2Layer = {
        name: "Yemen District Boundaries",
        value: "admin2",
        layer: admin2
      };
      this.layers.push(admin1Layer);
      this.layers.push(admin2Layer);
    },
    selectLayer(layer) {
      this.featureGroup.clearLayers();
      this.featureGroup.addLayer(layer.layer);
    },
    selectFilter(layer) {
      if (this.selectedLayer) {
        this.selectedLayer.setStyle(filterStyle);
      }
      this.selectedLayer = layer;
      layer.setStyle(selectedFilterStyle);
    },
    clearSelectedLayer() {
      if (this.selectedLayer) this.selectedLayer.setStyle(filterStyle);
      this.selectedLayer = null;
    }
  },
  created() {
    const _vm = this;
    this.$root.$on("map-init", map => {
      if (_vm.layers.length === 0) {
        _vm.loadAnalysisLayers();
      }
    });
    this.$root.$on("changed::tab", $event => {
      if ($event.tabs[$event.currentTab].id === "analysis") {
        this.featureGroup.addTo(_vm.map);
      } else this.featureGroup.removeFrom(_vm.map);
      _vm.selectedLayer = null;
    });
    this.$root.$on("map-destroy", () => {
      _vm.selectedLayer = null;
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
