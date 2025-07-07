<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AccountForm from "./components/AccountForm.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <v-app>
    <div v-if="isLoading" class="loader">
      <v-progress-circular
          indeterminate
          color="primary"
          size="64"
      />
    </div>

    <div v-else>
      <AccountForm/>
    </div>
  </v-app>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 10;
}
</style>
