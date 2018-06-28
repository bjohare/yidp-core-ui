<template>
  <div>
    <div id="featureInfo" title="Selected Feature">&nbsp;</div>
    <b-popover :show.sync="showPopover" target="featureInfo" triggers="focus"
    title="Selected Feature"
    container="map" placement="auto">
      <template>
        <ul class="list">
          <li class="list-item" v-for="(item, key) in info" :key="key">
            <span><strong>{{ key }}: </strong></span><span>{{ item }}</span>
          </li>
        </ul>
      </template>
    </b-popover>
  </div>

</template>

<script>
export default {
  props: {
    info: null,
    showPopover: false
  }
};
</script>

<style>
/* .popover {
  position: absolute;
  background-color: #2f353a !important;
  color: white !important;
  opacity: 0.8;
  border-radius: 4px;
} */
</style>
