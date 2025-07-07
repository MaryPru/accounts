<script setup lang="ts">
import {ref} from 'vue';
import {useAccountStore} from '../stores/accountStore';
import AccountItem from './AccountItem.vue';

const store = useAccountStore();

function createAccount() {
  const hasInvalid = store.accounts.some(acc => acc.isValid === false);

  if (hasInvalid) {
    notify('Сначала заполните предыдущую учётную запись');
    return;
  }

  store.addAccount({
    id: crypto.randomUUID(),
    labels: [],
    type: 'Локальная',
    login: '',
    password: '',
    isValid: false,
  });
}

const snackbar = ref(false);
const snackbarMessage = ref('');

function notify(message: string) {
  snackbarMessage.value = message;
  snackbar.value = true;
}

</script>

<template>
  <v-container>

    <div class="form__row mb-4">
      <span>Учетные записи</span>
      <v-btn @click="createAccount" color="gray" class="mb-4 form__button">
        <v-icon start>mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-alert
        density="compact"
        type="info"
        variant="tonal"
        class="mb-4"
        icon="mdi-help-circle-outline"
    >
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель <code>;</code>
    </v-alert>

    <v-snackbar v-model="snackbar" color="error" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>

    <TransitionGroup name="fade-list" tag="div">
      <AccountItem
          v-for="account in store.accounts"
          :key="account.id"
          :model-value="account"
          @update:modelValue="store.updateAccount"
          @delete="store.removeAccount(account.id)"
      />
    </TransitionGroup>

  </v-container>
</template>


<style scoped lang="scss">
.form {
  &__row {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 20px;
  }

  &__button {
    margin-bottom: 0 !important;
    outline: none;

    .v-btn__content > .v-icon--start {
      margin-right: 0;
    }
  }
}

.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>