import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const Admin = defineAsyncComponent(() => import('./view/Admin.js'));
const Login = defineAsyncComponent(() => import('./view/Login.js'));
const Shop = defineAsyncComponent(() => import('./view/Shop.js'));
const ShoppingCart = defineAsyncComponent(() => import('./view/ShoppingCart.js'));

const routes = [
  { path: '/', component: Shop },
  { path: '/shopping-cart', component: ShoppingCart },
  { path: '/admin', component: Admin },
  { path: '/login', component: Login },
];

const router = createRouter({
  history: createWebHistory('/ewa/g33/Jonas/'),
  routes,
});

export default router;