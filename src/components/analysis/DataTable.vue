<template>
<b-alert id="dataTable" show class="alert-light"
  @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
  <b-table :items="items"></b-table>
</b-alert>
</template>
<script>
import { mapGetters } from "vuex";

export default {
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
  position: absolute;
  bottom: 0;
  margin: 0;
  left: 0;
  z-index: 900;
  font-size: 10pt;
  font-weight: 500;
  height: 100%;
  width: 100%;
  opacity: 0.95;
  padding: 1rem;
  color: black !important;
  box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: 0px;
  // overflow: auto;
}
</style>
