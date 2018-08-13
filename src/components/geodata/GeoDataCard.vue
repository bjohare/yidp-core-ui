<template>
  <b-card
    :title="layer.title"
    :img-alt="layer.title">
    <span slot="header">
      <strong>Date of information:</strong> {{layer.date | format-date }}
      <h5><b-badge variant="primary" class="h5">{{ layer.category__gn_description }}</b-badge></h5>
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
    <button class="btn btn-primary m-md-2">Add to Map</button>
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
        <i class="fa fa-tag fa-lg"></i>&nbsp;<em>{{ keywords }}</em>
    </span>
  </b-card>
</template>
<script>
export default {
  props: {
    layer: null,
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
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  max-width: 90%;
  min-width: 90%;
  margin-bottom: 2em;
}
.card-title {
  font-size: 2em;
}
.badge {
  position: absolute;
  top: 20px;
  right: 20px;
}
.doc-link {
  text-decoration: none;
}
.toggle {
  cursor: pointer;
  color: #20a8d8;
}
img {
  // width: 50%;
  // height: 50%;
}
</style>
