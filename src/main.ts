import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createPinia } from 'pinia';

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {useAccountStore} from "./stores/accountStore.ts";


const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
});

const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.mount('#app');

const store = useAccountStore();
store.$subscribe((mutation, state) => {
    localStorage.setItem('accounts', JSON.stringify(state.accounts));
});