<script setup>
import { ref } from 'vue'

const first = ref(null)
const last = ref(null)
const email = ref(null)
const password = ref(null)
const terms = ref(false)
const icons = [
    'mdi-facebook',
    'mdi-twitter',
    'mdi-linkedin',
    'mdi-instagram',
  ]

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded" max-height="300">
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
          <v-card class="mx-auto" max-width="344" title="User Registration">
            <v-container>
              <v-text-field
                v-model="first"
                color="primary"
                label="First name"
                variant="underlined"
              ></v-text-field>

              <v-text-field
                v-model="last"
                color="primary"
                label="Last name"
                variant="underlined"
              ></v-text-field>

              <v-text-field
                v-model="email"
                color="primary"
                label="Email"
                variant="underlined"
              ></v-text-field>

              <v-text-field
                v-model="password"
                color="primary"
                label="Password"
                placeholder="Enter your password"
                variant="underlined"
              ></v-text-field>

              <v-checkbox
                v-model="terms"
                color="secondary"
                label="I agree to site terms and conditions"
              ></v-checkbox>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="success">
                Complete Registration

                <v-icon icon="mdi-chevron-right" end></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-main>

      <v-footer border app class="text-center d-flex flex-column ga-2 py-4" color="indigo-lighten-1">
        <div class="d-flex ga-3">
          <v-btn
            v-for="icon in icons"
            :key="icon"
            :icon="icon"
            density="comfortable"
            variant="text"
          ></v-btn>
        </div>

        <v-divider class="my-2" thickness="2" width="50"></v-divider>

        <div class="text-caption font-weight-regular opacity-60">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo
          interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed
          massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi
          vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui
          sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius
          natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        </div>

        <v-divider></v-divider>

        <div>{{ new Date().getFullYear() }} — <strong>Vuetify</strong></div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
