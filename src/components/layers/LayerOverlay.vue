<template>
  <b-alert ref="info" id="featureInfo" v-if="showPopover" dismissible show class="alert-light">
    <div class="h4 mr-4"><strong>Selected Features</strong></div>
    <div v-for="(feature, index) in features" :key="index" class="mb-2">
      <div class="med"><strong>Layer: </strong>{{ feature.name }}</div>
      <ul class="list-group">
        <li class="list-item" v-for="(item, key) in feature.properties" :key="key">
          <span class="small"><strong>{{ key }}: </strong></span><span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </b-alert>
</template>

<script>
export default {
  props: ["features", "showPopover"]
};
</script>

<style scoped>
#featureInfo {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 900;
  font-size: 10pt;
  font-weight: 500;
  height: 100%;
  opacity: 0.95;
  padding: 1rem;
  overflow: scroll;
  color: black !important;
}
ul.list-group {
  list-style-type: none;
}
</style>
