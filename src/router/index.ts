import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const Login = () => import('../views/LoginMain.vue');
const DashboardLayout = () => import('../views/DashboardLayout.vue');
const DashboardHome = () => import('../views/dashboard/DashboardHome.vue');
const Inventory = () => import('../views/dashboard/InventaryProduct.vue');
const Register = () => import('../views/dashboard/RegisterProduct.vue');
// Define las rutas usando el tipo RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }, // Usa la meta definida en router.d.ts
  },
  {
    path: '/dashboard',
    name: 'DashboardLayout',
    component: DashboardLayout,
    redirect: { name: 'DashboardHome' },
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: DashboardHome
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Inventory
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
