import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import authPlugin from "./plugins/auth-plugin";
// import "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import './assets/styles/tailwind.css';
import { FontAwesomeIcon } from './plugins/font-awesome'


createApp(App)
    .use(router)
    .use(store)
    .use(authPlugin)
    .component("font-awsome-icon", FontAwesomeIcon)
    .mount('#app')
