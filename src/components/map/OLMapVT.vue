<template>
  <div>
    <div id="map" class="map"></div>
    <app-overlay :info="info" :showPopover="showPopover"></app-overlay>
  </div>
</template>
<script>
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import VectorTile from "ol/layer/vectortile";
import VectorTileSource from "ol/source/vectortile";
import format from "ol";
import Vector from "ol/layer/vector";
import XYZ from "ol/source/xyz";
// import TileWMS from "ol/source/tilewms";
// import GeoJSON from "ol/format/geojson";
// import VectorSource from "ol/source/vector";
import tilegrid from "ol/tilegrid";
import proj from "ol/proj";
import WMSGetFeatureInfo from "ol/format/wmsgetfeatureinfo";
import Overlay from "ol/overlay";
import Style from "ol/style/style";
import Stroke from "ol/style/stroke";
import Text from "ol/style/text";
import Circle from "ol/style/circle";
import Fill from "ol/style/fill";
import Cluster from "ol/source/cluster";
import Select from "ol/interaction/select";
import MVT from "ol/format/mvt";

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
      showPopover: false
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
    async showGetFeatureInfo(url, coordinate) {
      this.showPopover = false;
      const featureInfo = this.map.getOverlayById("featureInfoOverlay");
      featureInfo.setPosition(coordinate);
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
        this.showPopover = true;
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
    // const view = new View({
    //   extent: proj.transformExtent(this.maxExtent, "EPSG:4326", "EPSG:3857"),
    //   center: proj.fromLonLat(this.center),
    //   zoom: this.zoom,
    //   minZoom: this.minZoom
    // });
    // this.map = new Map({
    //   target: "map",
    //   layers: [
    //     new TileLayer({
    //       source: new XYZ({
    //         url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //       })
    //     })
    //   ],
    //   view: view
    // });

    // const hospitals = new VectorSource({
    //   format: new GeoJSON(),
    //   url: function(extent) {
    //     return (
    //       "http://yidp-geonode.geoweb.io/geoserver/wfs?service=WFS&" +
    //       "version=1.1.0&request=GetFeature&typename=healthsites&" +
    //       "outputFormat=application/json&srsname=EPSG:3857"
    //     );
    //   }
    // });

    // const styleCache = {};
    // function pointStyle(feature) {
    //   const size = feature.get("features").length;
    //   let style = styleCache[size];
    //   if (!style) {
    //     style = new Style({
    //       image: new Circle({
    //         radius: 15,
    //         stroke: new Stroke({
    //           color: "white",
    //           width: 2
    //         }),
    //         fill: new Fill({
    //           color: "red"
    //         })
    //       }),
    //       text: new Text({
    //         text: size.toString(),
    //         fill: new Fill({
    //           color: "#fff"
    //         })
    //       })
    //     });
    //     styleCache[size] = style;
    //   }
    //   return [style];
    // }

    var styleSimple = new Style({
      fill: new Fill({
        color: "#ADD8E6"
      }),
      stroke: new Stroke({
        color: "#880000",
        width: 1
      })
    });

    function simpleStyle(feature) {
      return styleSimple;
    }

    var layer = "geonode:healthsites";
    var projectionEPSG = "900913";
    this.map = new Map({
      target: "map",
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: "EPSG:900913"
      }),
      layers: [
        new VectorTile({
          style: simpleStyle,
          source: new VectorTileSource({
            // tilePixelRatio: 1, // oversampling when > 1
            tileGrid: tilegrid.createXYZ({ maxZoom: 19 }),
            format: new MVT(),
            tileSize: 512,
            url:
              "http://yidp-geonode.geoweb.io/geoserver/gwc/service/tms/1.0.0/" +
              layer +
              "@EPSG%3A" +
              projectionEPSG +
              "@pbf/{z}/{x}/{-y}.pbf"
          })
        })
      ]
    });

    // var simple = new Style({
    //   fill: new Fill({
    //     color: "#ADD8E6"
    //   }),
    //   stroke: new Stroke({
    //     color: "#880000",
    //     width: 1
    //   })
    // });

    // function simpleStyle(feature) {
    //   return simple;
    // }

    // const projectionEpsgNo = "900913";
    // const hospitals = new VectorTile({
    //   style: simpleStyle,
    //   source: new VectorTile({
    //     // tilePixelRatio: 1, // oversampling when > 1
    //     tileGrid: tilegrid.createXYZ({ maxZoom: 19 }),
    //     format: new MVT(),
    //     url:
    //       "http://yidp-geonode.geoweb.io/geoserver/gwc/service/tms/1.0.0/geonode:healthsites" +
    //       "@EPSG%3A" +
    //       projectionEpsgNo +
    //       "@pbf/{z}/{x}/{-y}.pbf"
    //   })
    // });

    // const clusterSource = new Cluster({
    //   distance: 40,
    //   source: hospitals
    // });

    // const vector = new Vector({
    //   source: clusterSource,
    //   style: pointStyle
    // });
    // this.map.addLayer(hospitals);

    // const featureInfo = new Overlay({
    //   id: "featureInfoOverlay",
    //   element: document.getElementById("featureInfo")
    // });
    // this.map.addOverlay(featureInfo);

    // this.map.on("moveend", event => {
    //   const position = {
    //     zoom: event.map.getView().getZoom(),
    //     center: proj.toLonLat(event.map.getView().getCenter())
    //   };
    //   this.$store.dispatch("map/saveMapPosition", position);
    // });

    // var select = new Select({
    //   layers: [vector]
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
