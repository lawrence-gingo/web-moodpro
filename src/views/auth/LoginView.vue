<script setup>
import { ref } from 'vue'

const email = ref(null)
const password = ref(null)
const icons = ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container class="mt-16">
          <v-card class="mx-auto text-center pt-5" max-width="450" outlined elevation="24">
            <!-- Card Title -->
            <v-card-title class="text-h5 font-weight-bold">
              <div>
                <img src="/moodbaselogo.png" alt="logo" width="100px" height="100px" />
              </div>

              Login to MoodBased!
            </v-card-title>

            <v-container>
              <!-- Email Field -->
              <v-text-field
                v-model="email"
                color="primary"
                label="Email Address"
                placeholder="Enter your email"
                variant="outlined"
                class="mb-4"
                rounded
              ></v-text-field>

              <!-- Password Field -->
              <v-text-field
                v-model="password"
                color="primary"
                label="Password"
                placeholder="Enter your password"
                variant="outlined"
                class="mb-4"
                type="password"
                rounded
              ></v-text-field>
            </v-container>

            <v-divider></v-divider>

            <!-- Login Button -->
            <v-card-actions class="d-flex justify-center mt-5">
              <v-btn
                class="text-center px-6 py-3"
                color="success"
                rounded
                elevation="2"
                large
                prepend-icon="mdi-chevron-right"
              >
                LOGIN
              </v-btn>
            </v-card-actions>
            <br>
            <span class="text-body-2">Don't have an account? </span>
            <RouterLink to="/register" class="text-decoration-none font-weight-medium text-success">
              Sign up
            </RouterLink>
            <br>
            <br>
          </v-card>
        </v-container>
      </v-main>

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
