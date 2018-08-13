<template>
  <div  class="animated fadeIn m-4">
    <app-spinner :loading="loading"></app-spinner>
    <div>Filter docs here...</div>
    <!-- <b-card-group deck class="mb-3" v-show="!loading"> -->
    <div class="mb-3" v-for="(doc, index) in documents" :key="index">
      <app-document-card :document="doc"></app-document-card>
    </div>
  <!-- </b-card-group> -->
  </div>
</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
import appDocumentCard from "./DocumentCard.vue";
export default {
  data() {
    return {
      documents: null,
      loading: false
    };
  },
  components: {
    appDocumentCard,
    appSpinner
  },
  methods: {
    async fetchGeonodeDocuments() {
      this.loading = true;
      this.documents = await this.$store.dispatch("geonode/fetchGeonodeDocuments");
      this.loading = false;
    }
  },
  created() {
    this.fetchGeonodeDocuments();
  }
};
</script>
<style>
</style>
