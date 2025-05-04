import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import MainView from '@/views/auth/MainView.vue'
import ProfileHeader from '@/components/commons/ProfileHeader.vue'
import AlertNotification from '@/components/commons/AlertNotification.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileHeader
    },
    {
      path: '/alert',
      name: 'alert',
      component: AlertNotification
    },
  ]
})

export default router
