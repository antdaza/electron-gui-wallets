<template>
  <q-page class="articles-page">
    <div class="header row items-center justify-center q-pt-md">
      <q-btn-toggle
        v-model="activeTab"
        toggle-color="primary"
        color="secondary"
        :options="[
          {
            label: $t('titles.articles.browse'),
            value: 'browse',
            icon: 'search'
          },
          {
            label: $t('titles.articles.publish'),
            value: 'publish',
            icon: 'edit'
          }
        ]"
      />
    </div>

    <div class="tab-content q-pa-md">
      <ArticleSearch
        v-if="activeTab === 'browse'"
        ref="articleSearch"
        @select="showArticleDetails"
      />
      <ArticleList
        v-if="activeTab === 'browse'"
        :articles="articles"
        class="q-mt-md"
        @select="showArticleDetails"
      />

      <ArticlePublish
        v-else-if="activeTab === 'publish'"
        @published="handleArticlePublished"
      />
    </div>

    <q-dialog v-model="showDetailsDialog" full-width>
      <ArticleDetails
        v-if="selectedArticle"
        :article="selectedArticle"
        @close="showDetailsDialog = false"
        @verify="handleVerifyContent"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import ArticleSearch from "components/article/ArticleSearch";
import ArticleList from "components/article/ArticleList";
import ArticleDetails from "components/article/ArticleDetails";
import ArticlePublish from "components/article/ArticlePublish";

export default {
  name: "WalletArticles",
  components: {
    ArticleSearch,
    ArticleList,
    ArticleDetails,
    ArticlePublish
  },
  data() {
    return {
      activeTab: "browse",
      articles: [],
      selectedArticle: null,
      showDetailsDialog: false
    };
  },
  methods: {
    showArticleDetails(article) {
      this.selectedArticle = article;
      this.showDetailsDialog = true;
    },
    handleArticlePublished(newArticle) {
      console.log("New article published:", newArticle);
      this.activeTab = "browse";

      this.$nextTick(() => {
        try {
          const searchComponent = this.$refs.articleSearch;
          if (searchComponent && typeof searchComponent.search === "function") {
            searchComponent.search();
          }
        } catch (error) {
          console.error("Error refreshing article search:", error);
        }
      });
    },
    handleVerifyContent(contentHash) {
      console.log("Verifying content hash:", contentHash);
      this.$q.notify({
        type: "info",
        message: this.$t("notification.article.verificationStarted")
      });
      // Additional logic here
    }
  }
};
</script>

<style lang="scss">
.articles-page {
  .header {
    margin-bottom: 16px;
  }

  .tab-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .q-btn-toggle {
    border-radius: 4px;
    overflow: hidden;

    .q-btn {
      padding: 8px 16px;
      min-width: 180px;

      .q-btn__content {
        flex-direction: row;
        justify-content: center;

        .q-icon {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
