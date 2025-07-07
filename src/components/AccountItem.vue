<script lang="ts" setup>
import {ref, watch, computed, onMounted} from 'vue';
import type {Account} from '../types/account';

const props = defineProps<{
  modelValue: Account;
}>();
const emit = defineEmits(['update:modelValue', 'delete']);

const localAccount = ref({...props.modelValue});

const showPasswordField = computed(() => localAccount.value.type === 'Локальная');

const errors = ref({
  login: '',
  password: '',
});

watch(localAccount, () => {
  validate();
  emit('update:modelValue', {...localAccount.value});
}, {deep: true});

onMounted(()=>{
  validate();
})

function parseLabels(raw: string): { text: string }[] {
  return raw.split(';').map(el => el.trim()).filter(Boolean).map(text => ({text}));
}

function validate() {
  let valid = true;

  errors.value.login = '';
  errors.value.password = '';

  if (!localAccount.value.login || localAccount.value.login.length > 100) {
    errors.value.login = 'Обязательное поле (макс. 100 символов)';
    valid = false;
  }

  if (
      localAccount.value.type === 'Локальная' &&
      (!localAccount.value.password || localAccount.value.password.length > 100)
  ) {
    errors.value.password = 'Обязательное поле (макс. 100 символов)';
    valid = false;
  }

  localAccount.value.isValid = valid;
}
</script>


<template>
  <v-card class="mb-4 pa-4" :color="!localAccount.isValid ? 'error-lighten-4' : ''">
    <v-row dense class="row">
      <v-col cols="12" md="3">
        <v-text-field
            label="Метка"
            maxlength="50"
            :model-value="localAccount.labels.map(l => l.text).join('; ')"
            @blur="(e: any) => localAccount.labels = parseLabels(e.target.value)"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
            label="Тип записи"
            v-model="localAccount.type"
            :items="['Локальная', 'LDAP']"
        />
      </v-col>
      <v-col cols="12" md="3" class="field">
        <v-text-field
            required
            label="Логин"
            v-model="localAccount.login"
            maxlength="100"
            :error="!localAccount.isValid && !localAccount.login"
            :error-messages="errors.login"
        />
      </v-col>
      <v-col cols="12" md="3" v-if="showPasswordField">
        <v-text-field
            required
            label="Пароль"
            v-model="localAccount.password"
            type="password"
            maxlength="100"
            :error="!localAccount.isValid && !localAccount.password"
            :error-messages="errors.password"
        />
      </v-col>
      <v-col cols="12" md="1" class="d-flex align-center">
        <v-btn icon @click="$emit('delete')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.field {
  max-width: 100%;
  flex: 1;
}

.row {
  align-items: start;
}

.v-card:first-of-type {
  border-top: 1px solid #24242414;
}
</style>
