<template>
<div  class="animated fadeIn m-4">
  <app-spinner :loading="loading"></app-spinner>
  <div class="link mb-3 mt-3">
    <router-link to="/projects"><i class="fa fa-long-arrow-left"></i> Back to Projects</router-link>
  </div>
  <b-card :title="project.title">
    <span slot="header">
      <span><strong>Date of information:</strong> {{project.date | format-date }}</span>
      <div class="float-right">
        <b-badge variant="primary" class="mr-2"><span class="h6 font-weight-bold">{{ project.category__gn_description }}</span></b-badge>
      </div>
    </span>
    <!-- <div v-if="project.thumbnail_url" class="float-right">
      <img class="thumb m-2" :src="project.thumbnail_url"/>
    </div> -->
    <div class="d-flex">
        <strong>{{ project.category__gn_description }}</strong> &nbsp;|&nbsp;
        <strong>{{ project.supplemental_information }}</strong>
    </div>
    <div v-if="hasTemporalExtent" class="d-flex mt-2">
      <strong>Temporal Extent Start:</strong>&nbsp; {{ project.temporal_extent_start | format-date}} &nbsp;|&nbsp;
      <strong>Temporal Extent End: </strong>&nbsp; {{ project.temporal_extent_end | format-date }}
    </div>
    <div class="mt-2">
      <h4>Abstract</h4>
      <p v-line-clamp="{
        lines: 3,
        text: abstract
        }" class="card-text m-3">
      </p>
    </div>
    <div v-if="project.data_quality_statement">
      <h4>Data Quality Statement</h4>
      <p class="m-2">{{ layer.data_quality_statement }}</p>
    </div>
    <div v-if="project.purpose">
      <h4>Dataset Purpose</h4>
      <p class="m-2">{{ project.purpose }}</p>
    </div>
    <div class="d-flex mt-4">
      <h4>GeoData Layers</h4>
      <b-table :items="layers" :fields="['title', 'abstract']"></b-table>
      <div v-if="project.thumbnail_url" class="float-right">
      <img class="thumb ml-3" :src="project.thumbnail_url"/>
      <div class="m-3">
        <button class="btn btn-success" disabled>Map this Project</button>
      </div>
    </div>
    </div>

  </b-card>
</div>
</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
import * as _ from "lodash";
export default {
  data() {
    return {
      loading: true,
      project: null
    };
  },
  components: {
    appSpinner
  },
  computed: {
    layers() {
      const layers = _.filter(this.project.layers, layer => {
        return layer.group !== "background";
      });
      let params = [];
      layers.forEach(layer => {
        const param = JSON.parse(layer.layer_params);
        params.push(param.capability);
      });
      return params;
    },
    keywords() {
      return this.project.keywords.join(", ");
    },
    abstract() {
      return this.project.abstract;
    },
    hasTemporalExtent() {
      return (
        this.project.temporal_extent_start !== null &&
        this.project.temporal_extent_end !== null
      );
    }
  },
  created() {
    const id = parseInt(this.$route.params.id);
    console.log(id);
    this.project = this.$store.getters["geonode/getGeonodeMap"](id);
    this.loading = false;
  }
};
</script>
<style scoped>
.thumb {
  border: 1px solid lightgrey;
  border-radius: 4px;
}
</style>
