<template>
  <div id="featureInfo" v-if="showPopover">
    <!-- <div>Selected Feature</div> -->
    <ul class="list">
      <li class="list-item" v-for="(item, key) in info.feature.properties" :key="key">
        <span><strong>{{ key }}: </strong></span><span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["info", "showPopover"]
};
</script>

<style scoped>
#featureInfo {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 900;
  background-color: #2f353a !important;
  color: white !important;
  opacity: 0.8;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 1rem;
  font-size: small;
  height: 100%;
}
</style>
