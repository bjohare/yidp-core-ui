<template>
    <b-card
    :title="document.title" :img-src="document.thumbnail_url"
    :img-alt="document.title"
    style="max-width: 15rem;"
    border-variant="info">
    <h5><b-badge variant="primary">{{ document.category__gn_description }}</b-badge></h5><br>
    <p class="card-text">
      {{ document.abstract }}
    </p>
    <router-link :to="{ name: 'Document', params: {id: document.id}}">
      <b-button variant="primary">
        View this Document
      </b-button>
    </router-link>
    <em slot="footer">
      {{ document.date_type | capitalize }}: {{ document.date | format-date }}</em>
    </b-card>
</template>
<script>
export default {
  props: {
    document: null
  }
};
</script>
<style lang="scss" scoped>
.badge {
  position: absolute;
  top: 20px;
  right: 20px;
}
img {
  // width: 50%;
  // height: 50%;
}
</style>
