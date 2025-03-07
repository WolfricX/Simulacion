import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/HomeView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/home',
    name: 'home',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

// Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Obtener el token desde el localStorage
  console.log('Checking route access for:', to.name, 'Token:', token); // Debugging
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      console.log('No token found. Redirecting to login.');
      next({ name: 'login' });
    } else {
      console.log('Token found. Proceeding to the route.');
      next();
    }
  } else {
    next();
  }
});

export default router;
