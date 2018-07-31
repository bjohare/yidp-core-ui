<template>
  <b-tabs>
    <b-tab id="layers">
      <template slot="title">
        <i class='icon-layers' v-b-tooltip.hover.left title="Map Layers"></i>
      </template>
      <div v-if="!show">No map selected.</div>
      <app-layer-switcher></app-layer-switcher>
    </b-tab>
    <b-tab id="analysis">
      <template slot="title">
        <i class='fa fa-bar-chart fa-lg' v-b-tooltip.hover.left title="Map Analysis"></i>
      </template>
      <app-analysis-panel :show="show"></app-analysis-panel>
    </b-tab>
    <b-tab id="details">
      <template slot="title">
        <i class='fa fa-info fa-lg' v-b-tooltip.hover.left title="Map Information"></i>
      </template>
      <div class="message" v-if="!show">No map selected.</div>
      <app-map-description :map="mapDescription" :show="show"></app-map-description>
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
      mapDescription: null,
      userMap: null,
      showLayersTab: true
    };
  },
  computed: {},
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
      _vm.loadUserMap();
    });
  }
};
</script>
