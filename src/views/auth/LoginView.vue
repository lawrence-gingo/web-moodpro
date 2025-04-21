<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <AppLayout>
    <template #content
      ><v-card class="mx-auto text-center pt-5" max-width="450" outlined elevation="24">
        <v-card-title class="text-h5 font-weight-bold">
          <div>
            <img src="/moodbaselogo.png" alt="logo" width="100px" height="100px" />
          </div>
          Login to MoodBased!
        </v-card-title>

        <v-container>
          <v-text-field
            v-model="email"
            color="primary"
            label="Email Address"
            placeholder="Enter your email"
            variant="outlined"
            class="mb-4"
            rounded
          ></v-text-field>

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

        <v-card-actions class="d-flex justify-center mt-5">
          <v-btn
            class="text-center px-6 py-3"
            color="success"
            rounded
            elevation="2"
            large
            prepend-icon="mdi-chevron-right"
            to="/main"
          >
            LOGIN
          </v-btn>
        </v-card-actions>

        <br />
        <span class="text-body-2">Don't have an account? </span>
        <RouterLink to="/register" class="text-decoration-none font-weight-medium text-success">
          Sign up
        </RouterLink>
        <br /><br /> </v-card
    ></template>
  </AppLayout>
</template>
