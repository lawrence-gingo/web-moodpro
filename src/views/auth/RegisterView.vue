<script setup>
import { ref } from 'vue'

const first = ref(null)
const last = ref(null)
const email = ref(null)
const password = ref(null)
const terms = ref(false)
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
          <v-card class="mx-auto text-center my-5" max-width="450" outlined elevation="24">
            <!-- Card Title -->
            <v-card-title class="text-h5 font-weight-bold mt-5">
              <div>
                <img src="/moodbaselogo.png" alt="logo" width="100px" height="100px" srcset="">
              </div>
              Register to MoodBased!
            </v-card-title>

            <v-container>
              <!-- First Name -->
              <v-text-field
                v-model="first"
                color="primary"
                label="First name"
                variant="outlined"
                rounded
              ></v-text-field>

              <!-- Last Name -->
              <v-text-field
                v-model="last"
                color="primary"
                label="Last name"
                variant="outlined"
                rounded
              ></v-text-field>

              <!-- Email -->
              <v-text-field
                v-model="email"
                color="primary"
                label="Email"
                variant="outlined"
                rounded
              ></v-text-field>

              <!-- Password -->
              <v-text-field
                v-model="password"
                color="primary"
                label="Password"
                placeholder="Enter your password"
                variant="outlined"
                rounded
              ></v-text-field>

              <!-- Terms Checkbox -->
              <v-checkbox
                v-model="terms"
                color="secondary"
                label="I agree to site terms and conditions"
              ></v-checkbox>
            </v-container>

            <v-divider></v-divider>

            <!-- Registration Button -->
            <v-card-actions>
              <v-spacer></v-spacer>

              <RouterLink to="/">
                <v-btn class="text-center px-6 py-3"
                color="success"
                rounded
                elevation="2"
                large
                prepend-icon="mdi-chevron-right">
                  Complete Registration

                </v-btn>
              </RouterLink>
            </v-card-actions>
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
