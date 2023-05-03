import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import { plugin as formKitPlugin, defaultConfig } from '@formkit/vue'
import { createMultiStepPlugin } from '@formkit/addons'
import '@formkit/themes/genesis'
import '@formkit/addons/css/multistep'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(formKitPlugin, defaultConfig({
    plugins: [createMultiStepPlugin()]
  }))
  .mount('#app')
