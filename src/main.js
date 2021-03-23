import Vue from 'vue';
import App from './App.vue';
import TuiPage from './tui-page';

Vue.config.productionTip = false;

Vue.use(TuiPage);
Vue.component('PageText', () => import('@/components/PageText.vue'));

new Vue({
  render: (h) => h(App),
}).$mount('#app');
