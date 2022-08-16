import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import store from './store'
import './api/interceptor'
import directive from './directive'
import svg from './assets/svg'

import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

createApp(App)
  .use(router)
  .use(store)
  .use(directive)
  .use(svg)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .mount('#app')
