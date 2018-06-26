<template>
    <div id="map" class="map"></div>
</template>
<script>
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import XYZ from "ol/source/xyz";
import TileWMS from "ol/source/tilewms";
import proj from "ol/proj";
import WMSCapabilities from "ol/format/wmscapabilities";

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

    const parser = new WMSCapabilities();
    const config = {
      auth: {
        username: "admin",
        password: "geoserver"
      }
    };
    this.axios
      .get("http://yidp-geonode.geoweb.io/geoserver/rest/layers.json", config)
      .then(resp => {
        console.log(resp);
      });
    this.axios
      .get(
        "http://yidp-geonode.geoweb.io/geoserver/geonode/ows?service=WMS&version=1.0.0&request=GetCapabilities"
      )
      .then(resp => {
        const result = parser.read(resp.data);
        const Layers = result.Capability.Layer.Layer;
        console.log(Layers);
      });
    this.axios
      .get("http://yidp-geonode.geoweb.io/api/maps?title=YemenMap")
      .then(resp => {
        console.log(resp);
      });
    var yemenAdmin = new TileLayer({
      source: new TileWMS({
        url: "http://yidp-geonode.geoweb.io/geoserver/geonode/ows?service=WMS?",
        params: {
          LAYERS: "geonode:yem_admin1",
          VERSION: "1.1.1",
          FORMAT: "image/png",
          TILED: true
        }
      })
    });
    this.map.addLayer(yemenAdmin);
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
