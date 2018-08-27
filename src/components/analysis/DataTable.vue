<template>
  <div id="dataTable" v-if="show" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <b-table :items="items"></b-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["show"],
  computed: {
    ...mapGetters({
      filteredData: "analysis/getFilteredData"
    }),
    items() {
      let items = [];
      this.filteredData.features.forEach(feature => {
        items.push(feature.properties);
      });
      return items;
    }
  },
  methods: {
    handleEvents($event, type) {
      if ($event.type === "click" || $event.type === "dblclick") {
        $event.preventDefault();
      }
      $event.stopPropagation();
    }
  }
};
</script>
<style lang="scss" scoped>
#dataTable {
  background-color: white;
  z-index: 900;
  font-size: 10pt;
  font-weight: 500;
  width: 100%;
  opacity: 0.95;
  padding: 1rem;
  color: black !important;
  overflow: auto;
}
.table {
  overflow: auto;
}
</style>
