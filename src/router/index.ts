import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { ValidateTokenService } from '@/services/userService';


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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

// Navigation guard to protect routes that require authentication
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token'); // Obtener el token desde el localStorage
  console.log('Checking route access for:', to.name, 'Token:', token); // Debugging
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      console.log('No token found. Redirecting to login.');
      next({ name: 'login' });
    } else {
      try {
        await ValidateTokenService(token);
        console.log('Token is valid. Proceeding to the route.');
        next();
      } catch {
        console.log('Invalid or expired token. Redirecting to login.');
        localStorage.removeItem('token');
        next({ name: 'login' });
      }
    }
  } else {
    next();
  }
});

export default router
