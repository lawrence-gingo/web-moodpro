// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

// Import stores for initialization
import { useAuthStore } from './stores/authStore'
import { useUserStore } from './stores/userStore'
import { useMoodStore } from './stores/moodStore'

const app = createApp(App)
const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
})

app.use(pinia)
app.use(router)
app.use(vuetify)

// Initialize stores in sequence
const initializeApp = async () => {
  // Initialize auth store first
  const authStore = useAuthStore()
  await authStore.initialize()
  
  // Initialize user and mood stores after authentication
  const userStore = useUserStore()
  const moodStore = useMoodStore()
  
  await Promise.all([
    userStore.initialize(),
    moodStore.initialize()
  ])
}

// Mount app first, then initialize stores
app.mount('#app')
initializeApp().catch(error => console.error('Failed to initialize app:', error))
