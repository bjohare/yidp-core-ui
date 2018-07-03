<template>
  <div>
    <div id="map" class="map"></div>
    <app-overlay :info="info" :showPopover="showPopover"></app-overlay>
  </div>
</template>
<script>
import { initMap, loadVectors } from "./wfs_map";

import appOverlay from "../Overlay.vue";

import { mapState } from "vuex";

export default {
  data() {
    return {
      layers: [],
      info: null,
      showPopover: false
    };
  },
  computed: {
    ...mapState("map", {
      mapTitle: state => state.geonodeMap.title,
      wmsBaseUrl: state => state.wmsBaseUrl,
      geonodeMap: state => state.map,
      zoom: state => state.zoom,
      center: state => state.center,
      maxExtent: state => state.maxExtent,
      minZoom: state => state.minZoom
    })
  },
  methods: {
    // async showGetFeatureInfo(url, coordinate) {
    //   this.showPopover = false;
    //   const featureInfo = this.map.getOverlayById("featureInfoOverlay");
    //   featureInfo.setPosition(coordinate);
    //   this.info = null;
    //   console.log(url);
    //   const response = await axios.get(url);
    //   const data = response.data;
    //   const features = new WMSGetFeatureInfo().readFeatures(data);
    //   if (features.length) {
    //     const props = features[0].getProperties();
    //     const geomName = features[0].getGeometryName();
    //     delete props[geomName];
    //     this.info = props;
    //     this.showPopover = true;
    //   }
    // }
  },
  components: {
    appOverlay
  },
  mounted() {
    initMap(this);
    loadVectors(this);

    // //

    // const featureInfo = new Overlay({
    //   id: "featureInfoOverlay",
    //   element: document.getElementById("featureInfo")
    // });
    // this.map.addOverlay(featureInfo);

    // this.map.on("moveend", event => {
    //   const position = {
    //     zoom: event.map.getView().getZoom(),
    //     center: toLonLat(event.map.getView().getCenter())
    //   };
    //   this.$store.dispatch("map/saveMapPosition", position);
    // });

    // var select = new Select({
    //   layers: vectors
    // });

    // this.map.addInteraction(select);

    // var selectedFeatures = select.getFeatures();
    // selectedFeatures.on("add", function(event) {
    //   var feature = event.target.item(0);
    //   console.log(feature);
    // });
    // this.map.on("singleclick", event => {
    //   const viewResolution = view.getResolution();
    //   const url = wmsSource.getGetFeatureInfoUrl(
    //     event.coordinate,
    //     viewResolution,
    //     "EPSG:3857",
    //     { INFO_FORMAT: "text/xml" }
    //   );
    //   if (url) {
    //     this.showGetFeatureInfo(url, event.coordinate);
    //   }
    // });
  }
};
</script>
<style>
@import "ol/ol.css";

html,
body {
  margin: 0;
  height: 100%;
}
#map {
  /* position: absolute; */
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
