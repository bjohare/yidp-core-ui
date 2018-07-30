<template>
  <b-tabs>
    <b-tab>
      <template slot="title">
        <i class='icon-layers' v-b-tooltip.hover.left title="Map Layers"></i>
      </template>
      <div v-if="!show">No map selected.</div>
      <app-layer-switcher></app-layer-switcher>
    </b-tab>
    <b-tab>
      <template slot="title">
        <i class='fa fa-bar-chart fa-lg' v-b-tooltip.hover.left title="Map Analysis"></i>
      </template>
      <div class="message" v-if="!show">No map selected.</div>
      <div class="p-3">
        <div class="message" v-if="show">
          <div class="py-3 pb-5 mr-3 float-left">
            Analysis tools here..
          </div>
        </div>
      </div>
    </b-tab>
    <b-tab>
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
    appMapDescription
  },
  created() {
    const _vm = this;
    this.$root.$on("map-init", map => {
      _vm.loadUserMap();
    });
  }
};
</script>
