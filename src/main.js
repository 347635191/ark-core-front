import './assets/css/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/dark.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'virtual:windi.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'nprogress/nprogress.css'
import '@/guards'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
