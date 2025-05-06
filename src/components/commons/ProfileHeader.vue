<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '@/components/utils/supabase'
import { getAvatarText } from '@/components/utils/helpers'
import { formActionDefault } from '../utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const userData = ref({
  initials: '',
  email: '',
  fullname: '',
})

const formAction = ref({
  ...formActionDefault,
})

// Logout functionality
const onLogout = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      formAction.value.formErrorMessage = 'Error signing out. Please try again.'
    } else {
      formAction.value.formSuccessMessage = 'Successfully signed out.'
      formAction.value.formStatus = 200
      router.replace('/') // Redirect only on successful logout
    }
  } catch (err) {
    console.error('Unexpected error during logout:', err)
    formAction.value.formErrorMessage = 'An unexpected error occurred during logout.'
  } finally {
    formAction.value.formProcess = false
  }
}

// Fetch user data
const getUser = async () => {
  try {
    // First get the authenticated user
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error fetching user:', error)
      return
    }

    if (data && data.user) {
      // Set email from auth data
      userData.value.email = data.user.email || 'No email provided'
      
      // Now fetch the user profile from the profiles table to get the full name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.error('Error fetching profile:', profileError)
      }
      
      if (profileData) {
        // Use first_name and last_name from the profiles table
        userData.value.fullname = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
      } else {
        // Fallback to metadata if profile not found
        const metadata = data.user.user_metadata || {}
        userData.value.fullname = `${metadata.firstname || metadata.first_name || ''} ${metadata.lastname || metadata.last_name || ''}`.trim()
      }
      
      // If fullname is still empty, use the email username as a fallback
      if (!userData.value.fullname) {
        const emailName = userData.value.email.split('@')[0]
        if (emailName) {
          // Convert email name to proper case
          userData.value.fullname = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        } else {
          userData.value.fullname = 'User'
        }
      }
      
      // Generate initials from the fullname
      userData.value.initials = getAvatarText(userData.value.fullname)
    }
  } catch (err) {
    console.error('Error in getUser function:', err)
  }
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <v-container style="height: auto" fluid>
    <v-row justify="center">
      <div class="mx-auto text-center">
        <!-- User Avatar -->
        <v-avatar color="purple" size="large" class="mt-5">
          <span class="text-h5">{{ userData.initials }}</span>
        </v-avatar>
        <!-- User Full Name -->
        <h3>{{ userData.fullname || 'User' }}</h3>
        <!-- User Email -->
        <p class="text-caption mt-1 my-5">
          {{ userData.email }}
        </p>
        <!-- Logout Button -->
        <v-btn color="purple-lighten-1" class="mt-3" @click="onLogout" :loading="formAction.formProcess">
          Logout
        </v-btn>
      </div>
    </v-row>
  </v-container>
</template>
