<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')
const terms = ref(false)
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container class="d-flex justify-center align-center">
        <v-card
          class="text-center pa-6"
          max-width="460"
          elevation="12"
          style="border-radius: 24px; background: #ffffff"
        >
          <!-- Card Title -->
          <v-card-title class="text-h5 font-weight-bold d-flex flex-column align-center mb-4">
            <img
              src="/MoodBased-removebg-preview.png"
              alt="logo"
              width="90"
              height="90"
              class="mb-2"
            />
            <span style="color: #ba55d3;">Register to MoodBased</span>
          </v-card-title>

          <v-form>
            <!-- First Name -->
            <v-text-field
              v-model="first"
              color="purple"
              label="First name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            ></v-text-field>

            <!-- Last Name -->
            <v-text-field
              v-model="last"
              color="purple"
              label="Last name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            ></v-text-field>

            <!-- Email -->
            <v-text-field
              v-model="email"
              color="purple"
              label="Email"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            ></v-text-field>

            <!-- Password -->
            <v-text-field
              v-model="password"
              color="purple"
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            ></v-text-field>

            <!-- Terms Checkbox -->
            <v-checkbox
              v-model="terms"
              color="purple"
              label="I agree to the terms and conditions"
             
            ></v-checkbox>
          </v-form>

          <v-btn
            color="purple"
            size="large"
            rounded
            elevation="4"
            style="width: 100%; font-weight: bold; font-size: 16px"
            prepend-icon="mdi-check"
            :disabled="!terms"
            to="/"
          >
            Complete Registration
          </v-btn>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>

