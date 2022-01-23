import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import router from './router'
// import './element-variables.scss'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
  store,
  components: { App },
}).$mount('#app')
