<template>
<transition name="fade" mode="out-in">
  <div>
    <div v-for="(category, index) in categories" :key="index">
      {{ category.identifier }}
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: ["mapConfig", "map"],
  data() {
    return {
      categories: []
    };
  },
  methods: {
    async fetchGeonodeCategories() {
      let categories = await this.$store.dispatch(
        "geonode/fetchGeonodeCategories",
        this
      );
    }
  },
  created() {
    this.fetchGeonodeCategories();
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
