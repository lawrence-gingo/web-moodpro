<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute
import { isAuthenticated } from '@/components/utils/supabase'
import ProfileHeader from '@/components/commons/ProfileHeader.vue'

const theme = ref('light')
const drawer = ref(false) // State for the drawer
const isLoggedIn = ref(false) // Define isLoggedIn as a ref
const icons = ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']

const route = useRoute() // Get the current route

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
  console.log('isLoggedIn:', isLoggedIn.value) // Debug log
}

onMounted(() => {
  getLoggedStatus()
})

// Check if the current route is register or login
const isAuthPage = computed(() => {
  return route.name === 'register' || route.name === 'login'
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <!-- Navigation Drawer -->
      <v-navigation-drawer v-if="!isAuthPage" v-model="drawer" app>
        <v-list>
          <v-list-item v-if="isLoggedIn">
            <!-- ProfileHeader first to show at the top when logged in -->
            <ProfileHeader />
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- App Bar -->
      <v-app-bar
        class="px-3"
        image="https://images.unsplash.com/photo-1734039176190-61264ba627c4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" v-if="!isAuthPage"></v-app-bar-nav-icon>
        <!-- Drawer toggle button -->
        <img
          src="/MoodBased-removebg-preview.png"
          class="mx-5"
          alt="MoodBased Logo"
          height="70px"
          width="70px"
        />
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <!-- Footer -->
      <v-footer border app class="text-center d-flex flex-column ga-2 py-4" color="grey-ligthen-1">
        <div class="d-flex ga-3">
          <v-btn
            v-for="icon in icons"
            :key="icon"
            :icon="icon"
            density="comfortable"
            variant="text"
          ></v-btn>
        </div>

        <div class="text-caption font-weight-regular opacity-60">MoodBased 2024</div>

        <v-divider></v-divider>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
#out {
  background-color: #cb4dc7;
  color: white;
  font-weight: bold;
  width: 100%;
}
</style>
