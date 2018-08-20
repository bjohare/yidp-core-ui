<template>
    <b-card
    :title="layer.title"
    :img-alt="layer.title" class="mb-4">
      <span slot="header">
        <span><strong>Date of information:</strong> {{layer.date | format-date }}</span>
        <div class="float-right">
          <b-badge variant="primary" class="mr-2"><span class="h6 font-weight-bold">{{ layer.category__gn_description }}</span></b-badge>
          <i v-if="isActive" class="fa fa-check-circle fa-lg mt-2 text-success"></i>
        </div>
      </span>
      <span><strong>{{ layer.category__gn_description }}</strong></span> |
      <span><strong>{{ layer.supplemental_information }}</strong></span>
      <p v-line-clamp="{
        lines: 3,
        text: abstract,
        expanded: more
      }" class="card-text mt-2">
      </p>
      <div v-if="clampAbstract">
        <span class="toggle" @click="toggle()">{{ toggleText }}</span><br/><br/>
      </div>
      <router-link :to="{ name: 'Layer', params: {id: layer.id}}">
        <b-button variant="primary">
          View Details
        </b-button>
      </router-link>
      <b-button v-show="isActive" variant="success" class="m-md-2" @click="removeLayer(layer)">Remove from Map</b-button>
      <b-button v-show="!isActive" variant="primary" class="m-md-2" @click="addLayer(layer)">Add to Map</b-button>
      <b-dropdown id="ddown1" text="Download" variant="primary" right>
        <b-dropdown-item :href="downloadLayer('SHAPE-ZIP')">Zipped Shapefile</b-dropdown-item>
        <b-dropdown-item :href="downloadLayer('csv')">CSV</b-dropdown-item>
        <b-dropdown-item :href="downloadLayer('excel')">Excel</b-dropdown-item>
        <b-dropdown-item :href="downloadLayer('json')">GeoJSON</b-dropdown-item>
        <b-dropdown-item :href="downloadMap('kml')">KML</b-dropdown-item>
        <b-dropdown-item :href="downloadMap('application/pdf')">PDF</b-dropdown-item>
        <b-dropdown-item :href="downloadMap('image/png')" target="_blank">PNG</b-dropdown-item>
      </b-dropdown>
      <span slot="footer">
          <i class="fa fa-tags fa-lg text-primary mr-2"></i>&nbsp;<em>{{ keywords }}</em>
      </span>
    </b-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    layer: null,
    selected: null,
    wmsUrl: "",
    wfsUrl: ""
  },
  data() {
    return {
      more: false,
      accessToken: this.$store.state.authentication.accessToken.access_token
    };
  },
  computed: {
    ...mapGetters({
      selectedLayers: "maps/getLayers"
    }),
    keywords() {
      return this.layer.keywords.join(", ");
    },
    abstract() {
      return this.layer.abstract;
    },
    toggleText() {
      return this.more === true ? "Read less" : "Read more";
    },
    clampAbstract() {
      return this.layer.abstract.length > 300;
    },
    isActive() {
      return this.selectedLayers.find(lyr => {
        return lyr.typename === this.layer.typename;
      });
    }
  },
  methods: {
    toggle() {
      this.more = !this.more;
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
    addLayer(layer) {
      this.$store.dispatch("maps/addLayer", layer);
    },
    removeLayer(layer) {
      this.$store.dispatch("maps/removeLayer", layer.typename);
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  max-width: 95%;
  min-width: 95%;
  margin: 0 auto;
}
.card-title {
  font-size: 2em;
}
.doc-link {
  text-decoration: none;
}
.toggle {
  cursor: pointer;
  color: #20a8d8;
}
</style>
