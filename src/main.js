import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import authPlugin from "./plugins/auth-plugin";

import './assets/styles/tailwind.css';
import { FontAwesomeIcon } from './plugins/font-awesome'


createApp(App)
    .use(router)
    .use(store)
    .use(authPlugin)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
