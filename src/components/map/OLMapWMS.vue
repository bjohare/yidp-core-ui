<template>
  <div>
    <div id="map" class="map"></div>
    <app-overlay :info="info" :pixel="pixel"></app-overlay>
  </div>
</template>
<script>
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import XYZ from "ol/source/xyz";
import TileWMS from "ol/source/tilewms";
import proj from "ol/proj";
import WMSGetFeatureInfo from "ol/format/wmsgetfeatureinfo";
import axios from "axios";
// import * as methods from "./methods";
import appOverlay from "./Overlay.vue";

import { mapState } from "vuex";

export default {
  data() {
    return {
      map: null,
      layers: [],
      maxExtent: [35, 10, 66, 28],
      minZoom: 5,
      info: null,
      pixel: {}
    };
  },
  computed: {
    ...mapState("map", {
      mapTitle: state => state.title,
      wmsBaseUrl: state => state.wmsBaseUrl,
      geonodeMap: state => state.map,
      zoom: state => state.zoom,
      center: state => state.center
    })
  },
  methods: {
    async showGetFeatureInfo(url, pixel) {
      this.info = null;
      console.log(url);
      const response = await axios.get(url);
      const data = response.data;
      const features = new WMSGetFeatureInfo().readFeatures(data);
      if (features.length) {
        const props = features[0].getProperties();
        const geomName = features[0].getGeometryName();
        delete props[geomName];
        this.info = props;
        this.pixel = pixel;
        this.$root.$emit("bv::show::popover", "map");
      }
    }
  },
  components: {
    appOverlay
  },
  created() {
    this.$store.dispatch("map/fetchGeonodeMap");
    this.$store.dispatch("map/fetchWMSCapabilities");
  },
  mounted() {
    const view = new View({
      extent: proj.transformExtent(this.maxExtent, "EPSG:4326", "EPSG:3857"),
      center: proj.fromLonLat(this.center),
      zoom: this.zoom,
      minZoom: this.minZoom
    });
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          })
        })
      ],
      view: view
    });

    const wmsSource = new TileWMS({
      url: this.wmsBaseUrl,
      params: {
        LAYERS: "yem_admin1,healthsites",
        VERSION: "1.3.0",
        FORMAT: "image/png",
        TILED: true
      }
    });

    var yemen = new TileLayer({
      source: wmsSource
    });

    this.map.addLayer(yemen);

    this.map.on("moveend", event => {
      const position = {
        zoom: event.map.getView().getZoom(),
        center: proj.toLonLat(event.map.getView().getCenter())
      };
      this.$store.dispatch("map/saveMapPosition", position);
    });

    this.map.on("singleclick", event => {
      const viewResolution = view.getResolution();
      const url = wmsSource.getGetFeatureInfoUrl(
        event.coordinate,
        viewResolution,
        "EPSG:3857",
        { INFO_FORMAT: "text/xml" }
      );
      if (url) {
        this.showGetFeatureInfo(url, event.pixel);
      }
    });
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
