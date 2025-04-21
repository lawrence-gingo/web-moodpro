<script setup>
import { ref } from 'vue'

const icons = ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar
        class="px-3"
        image="https://images.unsplash.com/photo-1734039176190-61264ba627c4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="onClick"
        ></v-btn>

        <v-btn>
          Logout
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <slot name="content"></slot>
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
