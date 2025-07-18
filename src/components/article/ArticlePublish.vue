<template>
  <div class="article-publish">
    <div class="q-pa-md">
      <i18n path="strings.articlePublishDescription" tag="div" class="description q-mb-lg">
        <b place="minAmount">0.01 ANTD</b>
      </i18n>

      <AntdField :label="$t('fieldLabels.articleTitle')" :error="$v.title.$error" :disabled="publish_status.sending">
        <q-input
          v-model.trim="title"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.articleTitle')"
          :disabled="publish_status.sending"
          hide-underline
          maxlength="128"
          @blur="$v.title.$touch"
        />
      </AntdField>

      <AntdField
        :label="$t('fieldLabels.articleContent')"
        :error="$v.content.$error"
        :disabled="publish_status.sending"
        class="q-mt-md"
      >
        <q-input
          v-model.trim="content"
          type="textarea"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.articleContent')"
          :disabled="publish_status.sending"
          hide-underline
          maxlength="3000"
          rows="5"
          @blur="$v.content.$touch"
        />
      </AntdField>

      <AntdField
        :label="$t('fieldLabels.articlePublisher')"
        :error="$v.publisher.$error"
        :disabled="publish_status.sending"
        class="q-mt-md"
      >
        <q-input
          v-model.trim="publisher"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.articlePublisher')"
          :disabled="publish_status.sending"
          hide-underline
          maxlength="64"
          @blur="$v.publisher.$touch"
        />
      </AntdField>

      <AntdField
        :label="$t('fieldLabels.recipientAddress')"
        :error="$v.address.$error"
        :disabled="publish_status.sending"
        class="q-mt-md"
      >
        <q-input
          v-model.trim="address"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.recipientAddress')"
          :disabled="publish_status.sending"
          hide-underline
          @blur="$v.address.$touch"
        />
      </AntdField>

      <AntdField
        :label="$t('fieldLabels.amount')"
        :error="$v.amount.$error"
        :disabled="publish_status.sending"
        class="q-mt-md"
      >
        <q-input
          v-model.trim="amount"
          type="number"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.amount')"
          :disabled="publish_status.sending"
          hide-underline
          min="0.01"
          step="0.01"
          @blur="$v.amount.$touch"
        />
      </AntdField>

      <q-field class="q-pt-sm">
        <q-btn
          color="primary"
          :label="$t('buttons.publishArticle')"
          :disabled="publish_status.sending"
          @click="publish"
        />
      </q-field>
    </div>

    <q-inner-loading :visible="publish_status.sending" :dark="theme == 'dark'">
      <q-spinner color="primary" :size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
import AntdField from "components/antd_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "ArticlePublish",
  components: {
    AntdField
  },
  mixins: [WalletPassword],
  data() {
    return {
      title: "",
      content: "",
      publisher: "",
      address: "",
      amount: "0.01"
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    publish_status: state => state.gateway.article_status.publish
  }),
  validations: {
    title: {
      required,
      maxLength: maxLength(128)
    },
    content: {
      required,
      maxLength: maxLength(3000)
    },
    publisher: {
      required,
      maxLength: maxLength(64)
    },
    address: { required },
    amount: { required }
  },
  watch: {
    publish_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        switch (this.publish_status.code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message: this.publish_status.message || this.$t("notification.positive.articlePublished")
            });
            this.$v.$reset();
            this.resetForm();
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message: this.publish_status.message || this.$t("notification.errors.articlePublishFailed")
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    publish() {
      this.$v.$touch();

      if (this.$v.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidArticleFields")
        });
        return;
      }

      this.showPasswordConfirmation({
        title: this.$t("dialog.publishArticle.title"),
        noPasswordMessage: this.$t("dialog.publishArticle.message"),
        ok: {
          label: this.$t("dialog.publishArticle.ok")
        }
      })
        .then(password => {
          this.$store.commit("gateway/set_article_status", {
            publish: {
              code: 1,
              message: "Publishing article...",
              sending: true
            }
          });
          this.$gateway.send("wallet", "publish_article", {
            password,
            title: this.title.trim(),
            content: this.content.trim(),
            publisher: this.publisher.trim(),
            address: this.address.trim(),
            amount: this.amount
          });
        })
        .catch(() => {});
    },
    resetForm() {
      this.title = "";
      this.content = "";
      this.publisher = "";
      // Keep address and amount for convenience
    }
  }
};
</script>

<style lang="scss">
.article-publish {
  .q-field {
    margin-bottom: 16px;
  }

  .char-count {
    font-size: 0.8em;
    color: var(--q-color-secondary);
    text-align: right;
    margin-top: 4px;
  }
}
</style>
