import Vue from "vue";

export default new Vue({
  data: {
    map: null,
    userMap: null,
    baseLayers: [],
    wmsOverlays: [],
    wfsOverlays: []
  },
  methods: {
    addWFSOverlay(overlay) {
      this.wfsOverlays.push(overlay);
      overlay.layer.addTo(this.map);
      this.$emit("overlay-added", overlay.name);
    },
    removeWFSOverlay(overlay) {
      this.map.removeLayer(overlay.layer);
      this.wfsOverlays = this.wfsOverlays.filter(
        item => item.name !== overlay.name
      );
    },
    resetMap() {
      this.map = null;
      this.userMap = null;
      this.baseLayers = [];
      this.wmsOverlays = [];
      this.wfsOverlays = [];
    }
  }
});
