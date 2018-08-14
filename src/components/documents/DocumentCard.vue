<template>
  <b-card
    :title="document.title"
    :img-alt="document.title"
    class="mb-4">
    <span slot="header">
      <strong>Date of information:</strong> {{document.date | format-date }}
      <h5><b-badge pill variant="primary">{{ document.category__gn_description }}</b-badge></h5>
    </span>
    <p v-line-clamp="{
      lines: 3,
      text: abstract,
      expanded: more
    }" class="card-text">
    </p>
    <div v-if="clampAbstract">
      <span class="toggle" @click="toggle()">{{ toggleText }}</span><br/><br/>
    </div>
    <a class="doc-link" :href="document.doc_url" v-if="hasExternalLink" target="_blank">
        <strong><i class="fa fa-link fa-lg"></i> Open Link</strong>
    </a>
    <a class="doc-link" :href="'http://yidp-geonode.geoweb.io' + document.detail_url + '/download'" v-if="!hasExternalLink">
      <img class="thumbnail" :src="document.thumbnail_url" width="50px" height="50px"/><strong><i class="fa fa-download fa-lg"></i> Download Document</strong>
    </a>
    <span slot="footer">
        <i class="fa fa-tag fa-lg"></i>&nbsp;<em>{{ keywords }}</em>
    </span>
  </b-card>
</template>
<script>
export default {
  props: {
    document: null
  },
  data() {
    return {
      more: false
    };
  },
  computed: {
    hasExternalLink() {
      return this.document.doc_url !== null;
    },
    keywords() {
      return this.document.keywords.join(", ");
    },
    abstract() {
      return this.document.abstract;
    },
    toggleText() {
      return this.more === true ? "Read less" : "Read more";
    },
    clampAbstract() {
      return this.document.abstract.length > 300;
    }
  },
  methods: {
    toggle() {
      this.more = !this.more;
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  max-width: 90%;
  min-width: 90%;
  margin: 0 auto;
}
.card-title {
  font-size: 2em;
}
.badge {
  position: absolute;
  top: 20px;
  right: 20px;
}
.doc-link {
  text-decoration: none;
}
.toggle {
  cursor: pointer;
  color: #20a8d8;
}
.thumbnail {
  margin: 5px;
}
</style>
