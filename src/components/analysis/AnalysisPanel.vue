<template>
  <div class="message p-3" v-if="show">
    <div class="pb-5 mr-3 float-left">
      <b-form-group label="Select filter layer..." class="h4">
      <b-form-radio-group stacked name="layers" v-for="(layer, index) in layers" :key="index" v-model="selected">
        <b-form-radio class="layer" :value="layer.value" @change="selectLayer(layer)">{{layer.name}}</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import * as L from "leaflet";
import { filterStyle } from "@/components/map/styles";
export default {
  props: ["show"],
  data() {
    return {
      map: null,
      featureGroup: L.featureGroup(),
      layers: [],
      selected: "admin1"
    };
  },
  methods: {
    async loadAnalysisLayers() {
      let layers = [];
      layers[0] = await axios.get("/assets/layers/yem_admin_1.geojson");
      layers[1] = await axios.get("/assets/layers/yem_admin_2.geojson");
      this.featureGroup.setZIndex(2000);
      let options = {
        style: filterStyle,
        onEachFeature: function(feature, layer) {
          layer.bindTooltip(feature.properties.name_en, {
            sticky: true,
            className: "analysis-tooltip"
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
    }
  },
  created() {
    const _vm = this;
    this.$root.$on("map-init", map => {
      _vm.map = map;
      if (_vm.layers.length === 0) {
        _vm.loadAnalysisLayers();
      }
    });
    this.$root.$on("changed::tab", $event => {
      if ($event.tabs[$event.currentTab].id === "analysis") {
        this.featureGroup.addTo(this.map);
      } else this.featureGroup.removeFrom(this.map);
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
