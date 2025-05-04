<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { requiredValidator, emailValidator, passwordValidator } from '@/components/utils/validators'
import { supabase } from '@/components/utils/supabase.js'
import AlertNotification from '@/components/commons/AlertNotification.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data for login
const formData = ref({
  email: '',
  password: '',
})

// Default state for form actions
const formActionDefault = {
  formProcess: false,
  formSuccessMessage: '',
  formErrorMessage: '',
  formStatus: null,
}

// Reactive state for form actions
const formAction = ref({
  ...formActionDefault,
})

// Function to handle login submission
const onSubmit = async () => {
  if (!formData.value.email || !formData.value.password) {
    formAction.value.formErrorMessage = 'Please fill in all required fields.'
    return
  }

  formAction.value = {
    ...formActionDefault,
    formProcess: true
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.value.email,
      password: formData.value.password,
    })

    if (error) {
      console.error('Login error:', error)
      formAction.value.formErrorMessage = error.message || 'Login failed. Please try again.'
      formAction.value.formStatus = error.status
    } else if (data) {
      console.log('Login successful:', data)
      formAction.value.formSuccessMessage = 'Logged in successfully!'
      router.push('/main') // Navigate to the main page after successful login
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    formAction.value.formErrorMessage = 'An unexpected error occurred. Please try again later.'
  } finally {
    formAction.value.formProcess = false
  }
}

// Function to validate and submit the form
const onFormSubmit = () => {
  if (!formData.value.email || !formData.value.password) {
    formAction.value.formErrorMessage = 'Please fill in all required fields.'
    return
  }

  onSubmit() // Call the login submission function
}
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- Alert Notifications -->
      <AlertNotification
        :formSuccessMessage="formAction.formSuccessMessage"
        :formErrorMessage="formAction.formErrorMessage"
      ></AlertNotification>
      <!-- Login Form -->
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

          <!-- Email Field -->
          <v-text-field
            v-model="formData.email"
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

          <!-- Password Field -->
          <v-text-field
            v-model="formData.password"
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

          <!-- Login Button -->
          <v-btn
            class="mt-2 mb-5"
            color="purple"
            size="large"
            rounded
            elevation="4"
            style="width: 100%; font-weight: bold; font-size: 16px"
            prepend-icon="mdi-login"
            :loading="formAction.formProcess"
            :disabled="formAction.formProcess"
            @click="onFormSubmit"
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
