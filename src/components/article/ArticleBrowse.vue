<template>
  <div class="article-browse">
    <div class="search-section q-pb-md">
      <ArticleSearch @search="handleSearch" />
    </div>

    <div class="list-section">
      <ArticleList :articles="filteredArticles" :loading="loading" @select="showArticleDetails" />
    </div>

    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="3em" />
    </q-inner-loading>
  </div>
</template>

<script>
import ArticleSearch from "./ArticleSearch";
import ArticleList from "./ArticleList";

export default {
  name: "ArticleBrowse",
  components: {
    ArticleSearch,
    ArticleList
  },
  data() {
    return {
      loading: false,
      allArticles: [],
      searchQuery: "",
      initialLoad: true
    };
  },
  computed: {
    filteredArticles() {
      if (!this.searchQuery) return this.allArticles;
      return this.allArticles.filter(article => {
        const searchText = `${article.title} ${article.publisher}`.toLowerCase();
        return searchText.includes(this.searchQuery.toLowerCase());
      });
    }
  },
  mounted() {
    this.loadArticles();
  },
  methods: {
    async loadArticles() {
      this.loading = true;
      try {
        const response = await this.$gateway.send("wallet", "search_articles", { limit: 50 });
        this.allArticles = response.results || [];
        this.initialLoad = false;
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: this.$t("notification.errors.failedToLoadArticles")
        });
      } finally {
        this.loading = false;
      }
    },
    handleSearch(query) {
      this.searchQuery = query;
      // If we have local articles, filter them
      // Otherwise trigger a new search
      if (!this.allArticles.length) {
        this.loadArticles();
      }
    },
    showArticleDetails(article) {
      this.$router.push({
        name: "article-details",
        params: { txHash: article.tx_hash }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-browse {
  position: relative;
  min-height: 200px;

  .search-section {
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 16px;
  }
}
</style>
