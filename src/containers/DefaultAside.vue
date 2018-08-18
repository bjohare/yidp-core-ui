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
      <app-layers :mapConfig="mapConfig" :map="map"></app-layers>
    </b-tab>
    <b-tab id="analysis" ref="analysis">
      <template slot="title">
        <i class='fa fa-bar-chart fa-lg' v-b-tooltip.hover.left title="Map Analysis"></i>
      </template>
      <app-analysis-panel :show="show" :tabs="this.$refs.tabs" :mapConfig="mapConfig"></app-analysis-panel>
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
      <div class="message">
        <div class="alert alert-danger">Click to reset all application state.
          <br/>This will clear all layer selections and log you out.
          <router-link to="/account/login">
            <button class="btn btn-danger mt-2" @click="resetApplicationState">Reset Application State</button>
          </router-link>
          </div>
        </div>
    </b-tab>
  </b-tabs>
</template>

<script>
import { Switch as cSwitch } from "@coreui/vue";
import appLayers from "@/components/controls/Layers.vue";
import appMapDescription from "@/components/maps/MapDescription.vue";
import appAnalysisPanel from "@/components/analysis/AnalysisPanel.vue";
export default {
  name: "DefaultAside",
  data() {
    return {
      show: false,
      map: null,
      mapDescription: null,
      mapConfig: null,
      showLayersTab: true
    };
  },
  methods: {
    loadMapConfig() {
      const id = this.$route.params.id;
      this.mapConfig = this.$store.getters["maps/getMap"](id);
    },
    async loadMapDescription() {
      const mapId = this.mapConfig.id;
      if (mapId !== "default") {
        const payload = { mapId: mapId };
        this.mapDescription = await this.$store.dispatch(
          "geonode/fetchGeonodeMapDescription",
          payload
        );
      } else {
        this.mapDescription = { id: "default" };
      }
    },
    resetApplicationState() {
      this.$store.dispatch("maps/resetState");
      this.$store.dispatch("geonode/resetState");
      this.$store.dispatch("projects/resetState");
      this.$store.dispatch("authentication/logout");
    }
  },
  components: {
    cSwitch,
    appLayers,
    appMapDescription,
    appAnalysisPanel
  },
  created() {
    this.loadMapConfig();
    this.loadMapDescription();
    const _vm = this;
    this.$root.$on("map-init", map => {
      _vm.show = true;
    });
    this.$root.$on("map-destroy", () => {
      _vm.show = false;
    });
  }
};
</script>
