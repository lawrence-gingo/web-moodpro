import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import MainView from '@/views/auth/MainView.vue'
import ProfileHeader from '@/components/commons/ProfileHeader.vue'
import AlertNotification from '@/components/commons/AlertNotification.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ForbiddenView from '@/views/ForbiddenView.vue'
import { isAuthenticated } from '@/components/utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileHeader,
      meta: { requiresAuth: true }
    },
    {
      path: '/alert',
      name: 'alert',
      component: AlertNotification,
      meta: { requiresAuth: false }
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { requiresAuth: false }
    }
  ]
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  // Skip navigation guard for error pages
  if (to.name === 'not-found' || to.name === 'forbidden') {
    return next()
  }
  
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isUserAuthenticated = await isAuthenticated()
    
    // Store authentication state in localStorage for quick access
    localStorage.setItem('isAuthenticated', isUserAuthenticated)
    
    if (requiresAuth && !isUserAuthenticated) {
      // Redirect to forbidden page if trying to access a protected route without authentication
      console.log('Access forbidden: Authentication required')
      next({ name: 'forbidden' })
    } else if (isUserAuthenticated && (to.name === 'login' || to.name === 'register')) {
      // Redirect to main if trying to access login/register while already authenticated
      console.log('Already authenticated, redirecting to main')
      next({ name: 'main' })
    } else {
      // Otherwise proceed as normal
      next()
    }
  } catch (error) {
    console.error('Navigation guard error:', error)
    // In case of any error, redirect to login for safety
    next({ name: 'login' })
  }
})

export default router
