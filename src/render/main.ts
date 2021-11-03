import { createApp } from "vue"
import App from './App.vue'
import "./globe.less"
import router from "@/router"
const vm = createApp(App)
vm.use(router);
vm.mount('#app')
