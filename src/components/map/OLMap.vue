<template>
    <div id="map" class="map"></div>
</template>
<script>
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import XYZ from "ol/source/xyz";
import proj from "ol/proj";

export default {
  data() {
    return {
      map: null,
      layers: [],
      center: [50, 18],
      maxExtent: [35, 10, 66, 28],
      zoom: 6,
      minZoom: 5
    };
  },
  mounted() {
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          })
        })
      ],
      view: new View({
        extent: proj.transformExtent(this.maxExtent, "EPSG:4326", "EPSG:3857"),
        center: proj.fromLonLat(this.center),
        zoom: this.zoom,
        minZoom: this.minZoom
      })
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
