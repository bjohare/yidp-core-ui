<template>
  <!-- add conditonal rendering based on selected route here..
  we shouldn't show these tabs if wer're not looking at a map..
  -->
  <b-tabs ref="tabs">
    <b-tab id="layers" ref="layers">
      <template slot="title">
        <i class='icon-layers' v-b-tooltip.hover.left title="Map Layers"></i>
      </template>
      <div v-if="!show">No map selected.</div>
      <app-layer-switcher :userMap="userMap" :map="map"></app-layer-switcher>
    </b-tab>
    <b-tab id="analysis" ref="analysis">
      <template slot="title">
        <i class='fa fa-bar-chart fa-lg' v-b-tooltip.hover.left title="Map Analysis"></i>
      </template>
      <app-analysis-panel :show="show" :tabs="this.$refs.tabs"></app-analysis-panel>
    </b-tab>
    <b-tab id="details" ref="details">
      <template slot="title">
        <i class='fa fa-info fa-lg' v-b-tooltip.hover.left title="Map Information"></i>
      </template>
      <div class="message" v-if="!show">No map selected.</div>
      <app-map-description :map="mapDescription" :show="show"></app-map-description>
    </b-tab>
    <b-tab id="settings" ref="settings">
      <template slot="title">
        <i class='fa fa-cog fa-lg' v-b-tooltip.hover.left title="Settings"></i>
      </template>
      <div class="message"><button class="btn btn-primary m-5">Reset Application.</button></div>
    </b-tab>
  </b-tabs>
</template>

<script>
import { Switch as cSwitch } from "@coreui/vue";
import appLayerSwitcher from "@/components/layers/LayerSwitcher.vue";
import appMapDescription from "@/components/map/MapDescription.vue";
import appAnalysisPanel from "@/components/analysis/AnalysisPanel.vue";
export default {
  name: "DefaultAside",
  data() {
    return {
      show: false,
      map: null,
      mapDescription: null,
      userMap: null,
      showLayersTab: true
    };
  },
  methods: {
    async loadUserMap() {
      const id = this.$route.params.id;
      this.userMap = this.$store.getters["usermaps/getUserMap"](id);
      const payload = { vm: this, mapId: this.userMap.id };
      this.mapDescription = await this.$store.dispatch(
        "geonode/fetchGeonodeMapDescription",
        payload
      );
      this.show = true;
    }
  },
  components: {
    cSwitch,
    appLayerSwitcher,
    appMapDescription,
    appAnalysisPanel
  },
  created() {
    const _vm = this;
    this.$root.$on("map-init", map => {
      _vm.map = map;
      _vm.loadUserMap();
    });
    this.$root.$on("map-destroy", () => {
      this.show = false;
    });
  }
};
</script>
