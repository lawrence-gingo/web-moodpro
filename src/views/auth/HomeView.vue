<script setup>
import { ref } from 'vue'

const theme = ref('light')
const moodSuggestions = ref([
  { title: 'Energy', image: 'happy.jpg' },
  { title: 'Chill Beats', image: 'chill.jpg' },
  { title: 'Focus Mode', image: 'focus.jpg' },
  { title: 'Sad & Soulful', image: 'sad.jpg' },
  { title: 'Workout Pump', image: 'workout.jpg' },
  { title: 'liveness', image: 'liveness.jpg' },
  { title: 'Instrumental', image: 'instrumental.jpg' },
])

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-app :theme="theme">
    <!-- App Bar -->
    <v-app-bar flat class="px-6">
      <v-img src="/logo.png" max-height="32" max-width="120" class="me-6"></v-img>
      <v-btn text>Home</v-btn>
      <v-btn text>History</v-btn>
      <v-btn text>Library</v-btn>
      <v-spacer />
      <v-btn
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        text
        @click="toggleTheme"
      >
        Toggle Theme
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="pa-4">
      <v-container>
        <!-- Hero Section -->
        <v-sheet rounded elevation="6" class="pa-10 mb-10 d-flex align-center" style="background: linear-gradient(to right, #1e1e2f, #2b2b40); color: white;">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Mood-Based Soundtrack</h1>
            <p class="mb-4">Tailored for you based on how you feel</p>
            <v-btn color="primary" size="large" prepend-icon="mdi-play-circle-outline">Play Now</v-btn>
          </div>
          <v-img src="/moodbaselogo.png" max-height="200" max-width="200" class="ms-auto d-none d-md-block" />
        </v-sheet>

        <!-- Mood Suggestions -->
        <h2 class="text-h6 font-weight-bold mb-4">Suggestions Based on Your Mood</h2>
        <v-row dense>
          <v-col
            v-for="mood in moodSuggestions"
            :key="mood.title"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card elevation="2" class="rounded-lg">
              <v-img :src="`/moods/${mood.image}`" height="160px" cover />
              <v-card-title>{{ mood.title }}</v-card-title>
              <v-card-actions>
                <v-btn color="success" variant="flat" block>
                  Listen
                  <v-icon icon="mdi-chevron-right" end />
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="text-center pa-6" color="grey-lighten-4">
      <div class="text-caption">&copy; {{ new Date().getFullYear() }} MoodBased Music</div>
    </v-footer>
  </v-app>
</template>

<style scoped>
.v-application {
  background-color: #121212;
}
</style>
