import VueRouter from 'vue-router';
import Vue from 'vue';

import Home from '@/pages/home';
import Login from '@/pages/login';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
];

Vue.use(VueRouter);

// 需要实例
export default new VueRouter({
  routes,
});