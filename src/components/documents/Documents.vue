<template>
  <div  class="animated fadeIn m-4">
    <app-spinner :loading="loading"></app-spinner>
    <app-filter @change="filterData($event, 'text')"
                @selected="filterData($event, 'category')"
                @reset="fetchGeonodeDocuments"></app-filter>
    <div v-if="!loading">
      <div v-for="(doc, index) in paginatedData" :key="index">
        <app-document-card :document="doc"></app-document-card>
      </div>
      <b-alert variant="warning" show class="nodata" v-if="(documents.length === 0 && !loading)">No documents found.</b-alert>
      <div v-if="pageCount > 1">
        <b-pagination-nav align="center" base-url="#" :number-of-pages="pageCount" v-model="pageNum" />
      </div>
    </div>

  </div>
</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
import appDocumentCard from "./DocumentCard.vue";
import appFilter from "@/components/shared/Filter.vue";

export default {
  data() {
    return {
      documents: [],
      loading: false,
      pageNum: 0,
      size: 10
    };
  },
  components: {
    appDocumentCard,
    appSpinner,
    appFilter
  },
  computed: {
    paginatedData() {
      const start = this.pageNum * this.size;
      const end = start + this.size;
      return this.documents.slice(start, end);
    },
    pageCount() {
      let l = this.documents.length;
      let s = this.size;
      return Math.floor(l / s);
    }
  },
  methods: {
    async filterData(value, type) {
      this.loading = true;
      this.pageNum = 0;
      this.documents = await this.$store.dispatch(
        "geonode/filterGeonodeLayers",
        {
          value: value,
          type: type
        }
      );
      this.loading = false;
    },
    async fetchGeonodeDocuments() {
      this.loading = true;
      this.documents = [];
      this.documents = await this.$store.dispatch(
        "geonode/fetchGeonodeDocuments"
      );
      this.loading = false;
    },
    next() {
      this.pageNum++;
    },
    prev() {
      this.pageNum--;
    }
  },
  created() {
    this.fetchGeonodeDocuments();
  }
};
</script>
<style scoped>
.nodata {
  max-width: 95%;
  min-width: 95%;
  margin: 0 auto;
}
</style>
