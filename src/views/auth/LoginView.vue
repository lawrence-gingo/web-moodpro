<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { requiredValidator, emailValidator, passwordValidator } from '@/components/utils/validators'

const email = ref('')
const password = ref('')
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container class="d-flex justify-center align-center" style="min-height: 100vh">
        <v-card
          class="text-center pa-6"
          max-width="460"
          elevation="12"
          style="border-radius: 24px; background: #ffffff"
        >
          <v-card-title class="text-h5 font-weight-bold d-flex flex-column align-center mb-4">
            <img
              src="/MoodBased-removebg-preview.png"
              alt="logo"
              width="90"
              height="90"
              class="mb-2"
            />
            <span style="color: #ba55d3">Login to MoodBased</span>
          </v-card-title>

          <v-text-field
            v-model="email"
            color="purple"
            label="Email Address"
            placeholder="Enter your email"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            rounded
            hide-details
            :rules="[requiredValidator, emailValidator]"
          ></v-text-field>

          <v-text-field
            v-model="password"
            color="purple"
            label="Password"
            placeholder="Enter your password"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            type="password"
            rounded
            hide-details
            :rules="[requiredValidator, passwordValidator]"
          ></v-text-field>

          <v-btn
            class="mt-2 mb-5"
            color="purple"
            size="large"
            rounded
            elevation="4"
            style="width: 100%; font-weight: bold; font-size: 16px"
            prepend-icon="mdi-login"
            to="/main"
          >
            Login
          </v-btn>

          <v-divider class="my-4"></v-divider>

          <div class="text-body-2">
            Don't have an account?
            <RouterLink
              to="/register"
              class="font-weight-medium"
              style="color: #6c63ff; text-decoration: none"
            >
              Sign up
            </RouterLink>
          </div>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>
