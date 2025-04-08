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
        <v-container>
          <v-card
            class="mx-auto text-center pt-5"
            max-width="400"
            title="Login to MoodPro!"
            outlined
          >
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
            <v-card-actions class="d-flex justify-center">
              <v-btn class="text-center px-6 py-3" color="success" rounded elevation="2" large>
                LOGIN
                <v-icon icon="mdi-chevron-right" class="ml-2"></v-icon>
              </v-btn>
            </v-card-actions>
            
            <v-divider >
              <span class="text-body-2">Don't have an account? </span>
              <RouterLink
                to="/register"
                class="text-decoration-none font-weight-medium text-success"
              >
                Sign up
              </RouterLink>
            </v-divider>
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

        <div class="text-caption font-weight-regular opacity-60">MoodPro 2024</div>

        <v-divider></v-divider>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
