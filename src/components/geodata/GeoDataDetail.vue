<template>
<div>
  <app-spinner :loading="loading"></app-spinner>
  <div class="link mb-3 mt-3">
    <router-link to="/geodata"><i class="fa fa-long-arrow-left"></i> Back to GeoData</router-link>
  </div>
  <div v-if="!loading">
    <b-card
    :title="layer.title"
    :img-alt="layer.title" class="mb-4">
      <span slot="header">
        <span><strong>Date of information:</strong> {{layer.date | format-date }}</span>
        <div class="float-right">
          <b-badge variant="primary" class="mr-2"><span class="h6 font-weight-bold">{{ layer.category.gn_description }}</span></b-badge>
          <i v-if="isSelected(layer)" class="fa fa-check-circle fa-lg mt-2 text-success text-lg"></i>
        </div>
      </span>
      <div v-if="layer.thumbnail_url" class="d-flex float-right">
        <img class="thumb m-2" :src="layer.thumbnail_url" width="100px" height="100px"/>
      </div>
      <div class="d-flex">
        <strong>{{ layer.category.gn_description }}</strong> &nbsp;|&nbsp;
        <strong>{{ layer.supplemental_information }}</strong>
      </div>
      <div v-if="hasTemporalExtent" class="d-flex mt-2">
        <strong>Temporal Extent Start:</strong>&nbsp; {{ layer.temporal_extent_start | format-date}} &nbsp;|&nbsp;
        <strong>Temporal Extent End: </strong>&nbsp; {{ layer.temporal_extent_end | format-date }}
      </div>

      <div class="mb-3 mt-3">
        <button v-if="isSelected(layer)" class="btn btn-success m-md-2" @click="removeLayer(layer); isSelected(layer)">Remove from Map</button>
        <button v-show="!isSelected(layer)" class="btn btn-primary m-md-2" @click="addLayer(layer); isSelected(layer)">Add to Map</button>
        <b-dropdown id="ddown1" text="Download" variant="primary" right>
          <b-dropdown-item :href="downloadLayer('SHAPE-ZIP')">Zipped Shapefile</b-dropdown-item>
          <b-dropdown-item :href="downloadLayer('csv')">CSV</b-dropdown-item>
          <b-dropdown-item :href="downloadLayer('excel')">Excel</b-dropdown-item>
          <b-dropdown-item :href="downloadLayer('json')">GeoJSON</b-dropdown-item>
          <b-dropdown-item :href="downloadMap('kml')">KML</b-dropdown-item>
          <b-dropdown-item :href="downloadMap('application/pdf')">PDF</b-dropdown-item>
          <b-dropdown-item :href="downloadMap('image/png')" target="_blank">PNG</b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="mt-2">
        <h4>Abstract</h4>
        <p v-line-clamp="{
          lines: 3,
          text: abstract
          }" class="card-text m-2">
        </p>
      </div>
      <div v-if="layer.data_quality_statement">
        <h4>Data Quality Statement</h4>
        <p class="m-2">{{ layer.data_quality_statement }}</p>
      </div>
      <div v-if="layer.purpose">
        <h4>Dataset Purpose</h4>
        <p class="m-2">{{ layer.purpose }}</p>
      </div>
      <div class="extents">
        <h4>Extents</h4>
        <div id="map"></div>
      </div>

      <!-- <div v-for="(link, idx) in layer.links" :key="idx">
        <a :href="link.url" target="_blank">{{ link.name}}</a>
      </div> -->
      <span slot="footer">
          <i class="fa fa-tag fa-lg"></i>&nbsp;<em>{{ keywords }}</em>
      </span>
    </b-card>
  </div>
</div>

</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
import * as L from "leaflet";
export default {
  data() {
    return {
      loading: false,
      layer: null,
      accessToken: this.$store.state.authentication.accessToken.access_token
    };
  },
  components: {
    appSpinner
  },
  computed: {
    selectedLayers() {
      return this.$store.getters["maps/getLayers"];
    },
    keywords() {
      return this.layer.keywords.join(", ");
    },
    abstract() {
      return this.layer.abstract;
    },
    hasTemporalExtent() {
      return (
        this.layer.temporal_extent_start !== null &&
        this.layer.temporal_extent_end !== null
      );
    }
  },
  methods: {
    createExtentMap() {
      const mapDefaults = {
        zoom: 7,
        center: [15.51, 48.47]
      };
      const map = L.map("map").setView(mapDefaults.center, mapDefaults.zoom);
      var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      var osmAttrib =
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {
        attribution: osmAttrib,
        zIndex: 200
      });
      osm.addTo(map);
      var latlngs = [
        [this.layer.bbox_y0, this.layer.bbox_x1],
        [this.layer.bbox_y1, this.layer.bbox_x1],
        [this.layer.bbox_y1, this.layer.bbox_x0],
        [this.layer.bbox_y0, this.layer.bbox_x0]
      ];
      var polygon = L.polygon(latlngs, { color: "red", opacity: 0.65 }).addTo(
        map
      );
      map.fitBounds(polygon.getBounds());
    },
    async loadLayer() {
      this.loading = true;
      const id = this.$route.params.id;
      this.layer = await this.$store.dispatch("geonode/fetchGeonodeLayer", id);
      this.featureType = await this.$store.dispatch(
        "geonode/fetchGeoserverFeatureType",
        this.layer.typename
      );
      this.loading = false;
      const vm = this;
      this.$nextTick().then(function() {
        vm.createExtentMap();
      });
    },
    toggle() {
      this.more = !this.more;
    },
    isSelected(layer) {
      const found = this.selectedLayers.find(lyr => {
        return lyr.typename === layer.typename;
      });
      return found !== undefined;
    },
    downloadLayer(type) {
      return (
        "http://yidp-geonode.geoweb.io/geoserver/wfs?outputFormat=" +
        type +
        "&service=WFS&srs=EPSG%3A4326&request=GetFeature&format_options=charset%3AUTF-8&typename=" +
        this.layer.typename +
        "&version=1.0.0&access_token=" +
        this.accessToken
      );
    },
    downloadMap(type) {
      if (type === "kml") {
        return (
          "http://yidp-geonode.geoweb.io/geoserver/wms/kml?layers=" +
          this.layer.typename +
          "&mode=download&access_token=" +
          this.accessToken
        );
      } else {
        return (
          "http://yidp-geonode.geoweb.io/geoserver/wms?layers=" +
          this.layer.typename +
          "&service=WMS&format=" +
          type +
          "&request=GetMap&height=550&width=1015&bbox=41.816047679776800%2C12.111091026427500%2C54.530538817078300%2C18.999998902728900" +
          "&srs=EPSG%3A4326&access_token=" +
          this.accessToken
        );
      }
    },
    addLayer(selectedLayer) {
      let layer = this.$store.getters["maps/getLayer"](selectedLayer.typename);
      if (!layer) {
        this.$store.dispatch("maps/addLayer", selectedLayer);
      }
    },
    removeLayer(layer) {
      this.$store.dispatch("maps/removeLayer", layer.typename);
    }
  },
  created() {
    this.loadLayer();
  }
};
</script>
<style scoped>
.card {
  max-width: 90%;
  min-width: 90%;
  margin: 0 auto;
}
.card-title {
  font-size: 2em;
}
.link {
  max-width: 90%;
  min-width: 90%;
  margin: 0 auto;
}
.thumb {
  border: 1px solid lightgrey;
}
.extents {
  margin-top: 15px;
}
#map {
  width: 500px;
  height: 350px;
  border: 1px solid lightgrey;
  margin-top: 10px;
}
</style>
