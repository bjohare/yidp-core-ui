<template>
    <b-card
    :title="map.title" :img-src="map.thumbnail_url"
    :img-alt="map.title"
    style="max-width: 20rem;"
    border-variant="info">
    <h5><b-badge variant="primary">{{ map.category__gn_description }}</b-badge></h5><br>
    <p class="card-text">
      {{ map.abstract }}
    </p>

    <router-link :to="{ name: 'map', params: {id: map.id}}">
      <b-button variant="primary">
        View this Map
      </b-button>
    </router-link>
    <em slot="footer">
      {{ map.date_type | capitalize }}: {{ map.date | format-date }}</em>
    </b-card>
</template>
<script>
export default {
  props: {
    map: null
  }
};
</script>
<style lang="scss" scoped>
.badge {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
