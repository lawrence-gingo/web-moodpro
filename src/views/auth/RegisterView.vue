<script lang="ts" setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: ''
}

const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const terms = ref(false)
const refVForm = ref()

const onSubmit = () => {
  // handle registration logic here
  console.log('Submitted:', formData.value)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
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

          <v-form ref="refVForm" @submit.prevent="onFormSubmit">
            <!-- First Name -->
            <v-text-field
              v-model="formData.firstname"
              color="purple"
              label="First name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            />

            <!-- Last Name -->
            <v-text-field
              v-model="formData.lastname"
              color="purple"
              label="Last name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            />

            <!-- Email -->
            <v-text-field
              v-model="formData.email"
              color="purple"
              label="Email"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            />

            <!-- Password -->
            <v-text-field
              v-model="formData.password"
              color="purple"
              label="Password"
              placeholder="Enter your password"
              :type="isPasswordVisible ? 'text' : 'password'"
              append-inner-icon="mdi-eye"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            />

            <!-- Confirm Password -->
            <v-text-field
              v-model="formData.password_confirmation"
              color="purple"
              label="Confirm Password"
              placeholder="Repeat your password"
              :type="isPasswordConfirmVisible ? 'text' : 'password'"
              append-inner-icon="mdi-eye"
              @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              hide-details
            />

            <!-- Terms Checkbox -->
            <v-checkbox
              v-model="terms"
              color="purple"
              label="I agree to the terms and conditions"
            />

            <v-btn
              type="submit"
              color="purple"
              size="large"
              rounded
              elevation="4"
              style="width: 100%; font-weight: bold; font-size: 16px"
              prepend-icon="mdi-check"
              :disabled="!terms"
            >
              Complete Registration
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>
