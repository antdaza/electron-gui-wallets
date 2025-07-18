<template>
  <div class="article-list">
    <div class="list-header q-pb-md">
      <h2>{{ $t("strings.recentArticles") }}</h2>
      <q-btn flat dense round icon="refresh" :loading="loading" @click="refresh" />
    </div>

    <q-inner-loading :visible="loading" :dark="theme == 'dark'">
      <q-spinner color="primary" :size="30" />
    </q-inner-loading>

    <template v-if="!loading">
      <ArticleCard
        v-for="article in articles"
        :key="article.tx_hash"
        :article="article"
        class="q-mb-sm"
        @click="selectArticle(article)"
      />

      <div v-if="articles.length === 0" class="empty-state">
        <i18n path="strings.noArticlesFound" tag="div" class="text-center q-pt-lg">
          <router-link place="publishLink" to="/articles/publish">{{ $t("strings.publishOneNow") }}</router-link>
        </i18n>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ArticleCard from "./ArticleCard.vue";

export default {
  name: "ArticleList",
  components: {
    ArticleCard
  },
  data() {
    return {
      loading: false,
      articles: []
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme
  }),
  mounted() {
    this.loadArticles();
  },
  methods: {
    loadArticles() {
      this.loading = true;
      this.$gateway
        .send("wallet", "search_articles", { limit: 10 })
        .then(({ results }) => {
          this.articles = results || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh() {
      this.loadArticles();
    },
    selectArticle(article) {
      this.$emit("select", article);
    }
  }
};
</script>

<style lang="scss" scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.empty-state {
  padding: 40px 0;
  color: var(--secondary-text);
}
</style>
