<template>
  <b-container>
    <b-modal id="layerPicker" v-bind="modal" @ok="addLayers">
      Select a category below..
        <b-row v-for="(sub, index) in categoryGrid" :key="index">
            <b-col v-for="(category, idx) in sub" :key="idx" class="m-1">
                <b-list-group-item button @click="selectLayer(category)" :disabled="category.layers_count === 0"
                :active="isSelected(category.identifier)">
                  <i class="fa fa-lg" :class="category.fa_class"></i><span class="ml-3">{{ category.gn_description }}</span>
                  <br/><h5><b-badge :variant="variant(category.layers_count)" pill>{{ category.layers_count}} Layers</b-badge></h5>
                </b-list-group-item>
            </b-col>
        </b-row>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  props: ["userMap", "selected"],
  data() {
    return {
      modal: {
        title: "Add Overlays",
        centered: true,
        size: "lg",
        headerBgVariant: "info",
        lazy: true
      },
      categories: [],
      selectedLayers: new Set([])
    };
  },
  computed: {
    categoryGrid() {
      const grid = [];
      let sub = null;
      this.categories.forEach((category, index) => {
        if (index % 4 === 0) {
          sub = [];
          grid.push(sub);
        }
        sub.push(category);
      });
      return grid;
    }
  },
  methods: {
    async fetchGeonodeCategories() {
      const categories = await this.$store.dispatch(
        "geonode/fetchGeonodeCategories",
        this
      );
      this.categories = categories;
      // set the pre-selected layers if any
      this.categories.forEach(category => {
        if (this.selected.indexOf(category.identifier) !== -1) {
          this.selectedLayers.add(category);
        }
      });
    },
    variant(count) {
      return count === 0 ? "secondary" : "success";
    },
    selectLayer(category) {
      if (!this.selectedLayers.has(category)) {
        this.selectedLayers.add(category);
      } else {
        this.selectedLayers.delete(category);
      }
      event.currentTarget.classList.toggle("active");
    },
    async addLayers() {
      this.$emit("selected", Array.from(this.selectedLayers));
    },
    isSelected(category) {
      return this.selected.indexOf(category) !== -1;
    }
  },
  created() {
    this.fetchGeonodeCategories();
  }
};
</script>

<style scoped>
.list-group-item.disabled {
  background-color: #f7f4f4;
}
</style>
