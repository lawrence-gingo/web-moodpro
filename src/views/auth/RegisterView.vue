<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content
      ><v-card class="mx-auto text-center my-5" max-width="450" outlined elevation="24">
        <!-- Card Title -->
        <v-card-title class="text-h5 font-weight-bold mt-5">
          <div>
            <img src="/moodbaselogo.png" alt="logo" width="100px" height="100px" srcset="" />
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
            <v-btn
              class="text-center px-6 py-3"
              color="success"
              rounded
              elevation="2"
              large
              prepend-icon="mdi-chevron-right"
            >
              Complete Registration
            </v-btn>
          </RouterLink>
        </v-card-actions>
      </v-card></template
    >
  </AppLayout>
</template>
