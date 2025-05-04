<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { requiredValidator, emailValidator, passwordValidator } from '@/components/utils/validators'
import { ref } from 'vue'
import { supabase } from '@/components/utils/supabase.js'
import { useRouter } from 'vue-router'


const router = useRouter()
// Form data with proper binding
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  terms: false,
})

const formAction = ref({
  formProcess: false,
  formSuccessMessage: '',
  formErrorMessage: '',
  formStatus: null,
})

const onSubmit = async () => {
  formAction.value.formProcess = true
  formAction.value.formSuccessMessage = ''
  formAction.value.formErrorMessage = ''

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          firstname: formData.value.firstname,
          lastname: formData.value.lastname,
        },
      },
    })

    if (error) {
      console.error("Registration error:", error)
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status
    } else if (data) {
      console.log("Registration successful:", data)
      formAction.value.formSuccessMessage = 'Registration successful! Please check your email to verify your account.'
      router.replace('/login')
    }
  } catch (err) {
    console.error("Unexpected error:", err)
    formAction.value.formErrorMessage = 'An unexpected error occurred. Please try again.'
  } finally {
    formAction.value.formProcess = false
  }
}

const onFormSubmit = () => {
  // Basic validation
  if (!formData.value.firstname || !formData.value.lastname ||
      !formData.value.email || !formData.value.password ||
      !formData.value.terms) {
    formAction.value.formErrorMessage = 'Please fill out all fields and accept the terms.'
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    formAction.value.formErrorMessage = 'Please enter a valid email address.'
    return
  }

  // Password validation (minimum 6 characters)
  if (formData.value.password.length < 6) {
    formAction.value.formErrorMessage = 'Password must be at least 6 characters long.'
    return
  }

  onSubmit()
}

</script>

<template>
  <AppLayout>
    <template #content>
      <div v-if="formAction.formSuccessMessage" class="mb-4">
        <v-alert type="success" variant="tonal">
          {{ formAction.formSuccessMessage }}
        </v-alert>
      </div>
      <div v-if="formAction.formErrorMessage" class="mb-4">
        <v-alert type="error" variant="tonal">
          {{ formAction.formErrorMessage }}
        </v-alert>
      </div>
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
            <span style="color: #ba55d3">Register to MoodBased</span>
          </v-card-title>

          <v-form @submit.prevent="onFormSubmit">
            <!-- First Name -->
            <v-text-field
              v-model="formData.firstname"
              color="purple"
              label="First name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              :error-messages="!formData.firstname && formAction.formErrorMessage ? 'First name is required' : ''"
              required
            ></v-text-field>

            <!-- Last Name -->
            <v-text-field
              v-model="formData.lastname"
              color="purple"
              label="Last name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              :error-messages="!formData.lastname && formAction.formErrorMessage ? 'Last name is required' : ''"
              required
            ></v-text-field>

            <!-- Email -->
            <v-text-field
              v-model="formData.email"
              color="purple"
              label="Email"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              :error-messages="formAction.formErrorMessage && formAction.formErrorMessage.includes('email') ? formAction.formErrorMessage : ''"
              :rules="[requiredValidator, emailValidator]"
            ></v-text-field>

            <!-- Password -->
            <v-text-field
              v-model="formData.password"
              color="purple"
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              rounded
              :error-messages="formAction.formErrorMessage && formAction.formErrorMessage.includes('password') ? formAction.formErrorMessage : ''"
                :rules="[requiredValidator, passwordValidator]"
            ></v-text-field>

            <!-- Terms Checkbox -->
            <v-checkbox
              v-model="formData.terms"
              color="purple"
              label="I agree to the terms and conditions"
              :error-messages="!formData.terms && formAction.formErrorMessage ? 'You must agree to the terms' : ''"
            ></v-checkbox>
          </v-form>

          <v-btn
            color="purple"
            size="large"
            rounded
            elevation="4"
            style="width: 100%; font-weight: bold; font-size: 16px"
            prepend-icon="mdi-check"
            :disabled="!formData.terms"
            :loading="formAction.formProcess"
            @click="onFormSubmit"
          >
            Complete Registration
          </v-btn>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>
