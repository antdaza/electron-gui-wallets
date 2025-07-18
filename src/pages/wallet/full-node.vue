<template>
  <q-page class="full-node-page">
    <div class="header row items-center justify-center q-pt-md">
      <q-btn-toggle
        v-model="screen"
        toggle-color="primary"
        color="accent"
        :options="[
          {
            label: $t('titles.fullNode.myStakes'),
            value: 'myStakes'
          },
          {
            label: $t('titles.fullNode.staking'),
            value: 'staking'
          },
          {
            label: $t('titles.fullNode.registration'),
            value: 'registration'
          }
        ]"
      />
    </div>
    <ServiceNodeUnlock v-if="screen === 'myStakes'" />
    <ServiceNodeStaking v-if="screen === 'staking'" />
    <ServiceNodeRegistration v-if="screen === 'registration'" />
  </q-page>
</template>

<script>
import ServiceNodeStaking from "components/full_node/full_node_staking";
import ServiceNodeRegistration from "components/full_node/full_node_registration";
import ServiceNodeUnlock from "components/full_node/full_node_unlock";
export default {
  components: {
    ServiceNodeStaking,
    ServiceNodeRegistration,
    ServiceNodeUnlock
  },
  data() {
    return {
      screen: "staking"
    };
  }
};
</script>

<style lang="scss"></style>
