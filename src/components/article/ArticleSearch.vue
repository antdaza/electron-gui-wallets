<template>
  <div class="article-search">
    <div class="search-header q-pb-md">
      <q-input
        v-model="searchQuery"
        :dark="theme == 'dark'"
        :placeholder="$t('placeholders.searchArticles')"
        debounce="300"
        @input="search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <ArticleList v-if="searchResults.length > 0" :articles="searchResults" @select="showArticleDetails" />

    <div v-else-if="initialLoad" class="empty-results text-center q-pt-lg">
      <i18n path="strings.noArticlesFound" tag="div">
        <router-link place="publishLink" to="/articles/publish">{{ $t("strings.publishOneNow") }}</router-link>
      </i18n>
    </div>

    <q-dialog v-model="showDetails" full-width>
      <ArticleDetails v-if="selectedArticle" :article="selectedArticle" @verify="verifyContent" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ArticleList from "./ArticleList.vue";
import ArticleDetails from "./ArticleDetails.vue";

export default {
  name: "ArticleSearch",
  components: {
    ArticleList,
    ArticleDetails
  },
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      selectedArticle: null,
      showDetails: false,
      initialLoad: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme
  }),
  mounted() {
    this.search();
  },
  methods: {
    search() {
      this.$gateway
        .send("wallet", "search_articles", {
          query: this.searchQuery,
          limit: 20
        })
        .then(({ results }) => {
          this.searchResults = results || [];
          this.initialLoad = true;
        });
    },
    showArticleDetails(article) {
      this.selectedArticle = article;
      this.showDetails = true;
    },
    verifyContent(contentHash) {
      this.$emit("verify", contentHash);
      this.showDetails = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-header {
  border-bottom: 1px solid var(--border-color);
}

.empty-results {
  color: var(--secondary-text);
}
</style>
