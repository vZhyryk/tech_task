import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './css/global_vars.css';

/** @type {import('vue').App} */
const app = createApp(App)

app.use(router)

app.mount('#app')
