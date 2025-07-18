<template>
  <div class="article-details">
    <div class="article-header q-pb-md">
      <h2 class="article-title">{{ article.title }}</h2>
      <div class="article-meta">
        <span class="article-publisher">{{ $t("strings.publishedBy") }} {{ article.publisher }}</span>
        <span class="article-date">{{ formattedDate }}</span>
      </div>
    </div>

    <div class="article-content-section q-pb-md">
      <h3 class="section-title">{{ $t("strings.contentHash") }}</h3>
      <div class="content-hash">{{ article.content_hash }}</div>
    </div>

    <div class="article-tx-section q-pb-md">
      <h3 class="section-title">{{ $t("strings.transactionDetails") }}</h3>
      <div class="tx-meta">
        <div class="tx-meta-item">
          <span class="tx-meta-label">{{ $t("fieldLabels.txHash") }}:</span>
          <span class="tx-meta-value">{{ article.tx_hash }}</span>
        </div>
        <div class="tx-meta-item">
          <span class="tx-meta-label">{{ $t("fieldLabels.blockHeight") }}:</span>
          <span class="tx-meta-value">{{ article.height }}</span>
        </div>
      </div>
    </div>

    <div class="article-actions">
      <q-btn color="primary" :label="$t('buttons.verifyContent')" @click="verifyContent" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "src/utils/format";

export default {
  name: "ArticleDetails",
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
    }
  },
  methods: {
    verifyContent() {
      this.$emit("verify", this.article.content_hash);
    }
  }
};
</script>

<style lang="scss" scoped>
.article-details {
  .article-header {
    border-bottom: 1px solid var(--border-color);

    .article-title {
      margin-bottom: 8px;
    }

    .article-meta {
      display: flex;
      justify-content: space-between;
      color: var(--secondary-text);
      font-size: 0.9em;
    }
  }

  .section-title {
    font-size: 1.1em;
    margin-bottom: 8px;
    color: var(--secondary-text);
  }

  .content-hash {
    word-break: break-all;
    font-family: monospace;
    padding: 8px;
    background-color: var(--bg-color);
    border-radius: 4px;
  }

  .tx-meta {
    &-item {
      display: flex;
      margin-bottom: 4px;
    }

    &-label {
      font-weight: 500;
      min-width: 120px;
      color: var(--secondary-text);
    }

    &-value {
      word-break: break-all;
    }
  }

  .article-actions {
    margin-top: 16px;
    text-align: right;
  }
}
</style>
