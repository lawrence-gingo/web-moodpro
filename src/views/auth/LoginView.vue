<script setup>
import { ref } from 'vue'
import AlertNotification from '@/components/commons/AlertNotification.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

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
    // Use authStore instead of direct Supabase calls
    const result = await authStore.login(
      formData.value.email,
      formData.value.password
    )

    if (!result.success) {
      console.error('Login error:', result.error)
      formAction.value.formErrorMessage = result.error || 'Login failed. Please try again.'
    } else {
      console.log('Login successful')
      formAction.value.formSuccessMessage = 'Logged in successfully!'
      
      // Check if there's pending profile data from registration
      try {
        const pendingProfileData = localStorage.getItem('pendingUserProfile')
        if (pendingProfileData) {
          const profileData = JSON.parse(pendingProfileData)
          // Update the user profile with the stored data
          await userStore.updateProfile(profileData)
          // Clear the pending data after successful update
          localStorage.removeItem('pendingUserProfile')
          console.log('Applied pending profile data')
        }
      } catch (err) {
        console.warn('Error applying pending profile data:', err)
      }
      
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
  <div class="login-page">
    <!-- Alert Notifications -->
    <AlertNotification
      :formSuccessMessage="formAction.formSuccessMessage"
      :formErrorMessage="formAction.formErrorMessage"
    ></AlertNotification>
    
    <!-- Login Container -->
    <div class="login-container">
      <!-- Left Side - Decorative -->
      <div class="login-decorative-side">
        <div class="app-branding">
          <div class="app-logo">
            <span class="music-note">♫</span>
          </div>
          <h1 class="app-name">MoodPro</h1>
        </div>
        <div class="app-tagline">
          <h2>Music for Every Mood</h2>
          <p>Discover tracks that match exactly how you feel</p>
        </div>
        <div class="decorative-circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>
      
      <!-- Right Side - Login Form -->
      <div class="login-form-side">
        <div class="login-form-container">
          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">Sign in to continue to your account</p>
          
          <form @submit.prevent="onFormSubmit" class="login-form">
            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                id="email"
                v-model="formData.email"
                type="email" 
                placeholder="Enter your email"
                required
              />
            </div>
            
            <!-- Password Field -->
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password"
                v-model="formData.password"
                type="password" 
                placeholder="Enter your password"
                required
              />
            </div>
            
            <!-- Login Button -->
            <button 
              type="submit" 
              class="login-button"
              :disabled="formAction.formProcess"
            >
              <span v-if="!formAction.formProcess">Sign In</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
          
          <div class="form-footer">
            <p>Don't have an account? 
              <RouterLink to="/register" class="signup-link">Sign up</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.login-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left side - Decorative */
.login-decorative-side {
  flex: 1;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.app-branding {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.app-logo {
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.music-note {
  font-size: 2.5rem;
}

.app-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.app-tagline {
  max-width: 400px;
  z-index: 1;
}

.app-tagline h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.app-tagline p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}

.decorative-circles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 5%;
}

/* Right side - Login Form */
.login-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form-container {
  max-width: 400px;
  width: 100%;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #6a11cb;
  outline: none;
  box-shadow: 0 0 0 2px rgba(106, 17, 203, 0.2);
}

.login-button {
  padding: 14px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(106, 17, 203, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  color: #666;
}

.signup-link {
  color: #6a11cb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #2575fc;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-decorative-side {
    padding: 30px;
    min-height: 250px;
  }
  
  .app-branding {
    margin-bottom: 20px;
  }
  
  .app-logo {
    width: 40px;
    height: 40px;
  }
  
  .music-note {
    font-size: 1.8rem;
  }
  
  .app-name {
    font-size: 1.8rem;
  }
  
  .app-tagline h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .app-tagline p {
    font-size: 1rem;
  }
  
  .login-form-side {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
}
</style>
