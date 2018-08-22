<template>
<div>
  <div v-if="showMapAside">
    <app-map-panels :map="map"></app-map-panels>
  </div>
  <div v-if="showDashboardAside">
    <b-tabs>
      <b-tab id="dashboard" ref="dashboard">
        <template slot="title">
          <i class='fa fa-info fa-lg' v-b-tooltip.hover.left title="Dashboard Information"></i>
        </template>
        <div>Dashboard info here..</div>
      </b-tab>
    </b-tabs>
  </div>
  <div v-if="showProjectAside">
    <b-tabs>
      <b-tab id="projects" ref="projects">
        <template slot="title">
          <i class='fa fa-info fa-lg' v-b-tooltip.hover.left title="Project Information"></i>
        </template>
        <div class="m-3">
          <h2>Projects</h2>
          <p>A curated list of projects relating to the crisis in Yemen. A project is a grouped set of
            documents and geospatial data relating to an aspect of the crisis in Yemen.
          </p>
          <p>Click <em>Open Project</em> to work with a project.</p>
        </div>
      </b-tab>
    </b-tabs>
  </div>
  <div v-if="showGeodataAside">
    <b-tabs>
      <b-tab id="geodata" ref="geodata">
        <template slot="title">
          <i class='fa fa-info fa-lg' v-b-tooltip.hover.left title="Geodata Information"></i>
        </template>
        <div class="m-3">
          <h2>GeoData</h2>
          <p>A curated list of geodata relating to the crisis in Yemen. GeoData can be filtered
            by free text or by Sector/Cluster.
          </p>
          <p>Click <em>View Details</em> to view more details about a dataset. Click <em>Add to Map / Remove from Map</em> to
            add or remove a dataset to / from the current map.
          </p>
          <p>Data is availble for download in the following formats:
            <ul>
              <li>Zipped Shapefile</li>
              <li>CSV</li>
              <li>Excel</li>
              <li>GeoJSON</li>
              <li>KML</li>
              <li>PDF</li>
              <li>PNG</li>
            </ul>
          </p>
        </div>
      </b-tab>
    </b-tabs>
  </div>
  <div v-if="showDocumentsAside">
    <b-tabs>
      <b-tab id="documents" ref="documents">
        <template slot="title">
          <i class='fa fa-info fa-lg' v-b-tooltip.hover.left title="Documents Information"></i>
        </template>
        <div class="m-3">
          <h2>Documents</h2>
          <div>A curated list of documents available for download and links to documents in other repositories.</div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</div>

</template>

<script>
import appMapPanels from "@/components/maps/MapPanels.vue";

export default {
  name: "DefaultAside",
  data() {
    return {
      map: null,
      showMapAside: false,
      showProjectAside: false,
      showDashboardAside: false,
      showGeodataAside: false,
      showDocumentsAside: false
    };
  },
  watch: {
    $route() {
      this.$route.name === "Map"
        ? (this.showMapAside = true)
        : (this.showMapAside = false);
      this.$route.name === "Dashboard"
        ? (this.showDashboardAside = true)
        : (this.showDashboardAside = false);
      this.$route.name === "GeoData"
        ? (this.showGeodataAside = true)
        : (this.showGeodataAside = false);
      this.$route.name === "Projects"
        ? (this.showProjectAside = true)
        : (this.showProjectAside = false);
      this.$route.name === "Documents"
        ? (this.showDocumentsAside = true)
        : (this.showDocumentsAside = false);
    }
  },
  components: {
    appMapPanels
  },
  created() {
    const _vm = this;
    this.$root.$on("map-init", map => {
      _vm.map = map;
      _vm.showMapAside = true;
    });
  }
};
</script>
