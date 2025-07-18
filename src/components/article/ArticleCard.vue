<template>
  <div class="article-card" @click="$emit('click')">
    <div class="article-card-header">
      <div class="article-title">{{ article.title }}</div>
      <div class="article-publisher">{{ article.publisher }}</div>
    </div>

    <div class="article-card-meta">
      <div class="article-date">{{ formattedDate }}</div>
      <div class="article-tx-hash">{{ shortHash }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "src/utils/format";

export default {
  name: "ArticleCard",
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      theme: state => state.gateway.app.config.appearance.theme
    }),
    formattedDate() {
      return formatDate(this.article.timestamp);
    },
    shortHash() {
      return (
        this.article.tx_hash.substring(0, 6) + "..." + this.article.tx_hash.substring(this.article.tx_hash.length - 4)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.article-card {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-color);
  }

  &-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .article-title {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 70%;
    }

    .article-publisher {
      color: var(--secondary-text);
      font-size: 0.9em;
    }
  }

  &-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: var(--secondary-text);

    .article-date {
      flex: 1;
    }

    .article-tx-hash {
      font-family: monospace;
    }
  }
}
</style>
