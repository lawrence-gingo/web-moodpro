<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AlertNotification from '@/components/commons/AlertNotification.vue'

const router = useRouter()
const authStore = useAuthStore()
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
    // Use authStore for registration
    const result = await authStore.register(
      formData.value.email,
      formData.value.password
    )

    if (!result.success) {
      console.error("Registration error:", result.error)
      formAction.value.formErrorMessage = result.error
    } else {
      // Store user profile data in localStorage to be used after verification
      // We don't update the profile now because the user isn't fully authenticated yet
      try {
        localStorage.setItem('pendingUserProfile', JSON.stringify({
          first_name: formData.value.firstname,
          last_name: formData.value.lastname,
          email: formData.value.email
        }))
      } catch (err) {
        console.warn('Could not save profile data to localStorage:', err)
      }
      
      console.log("Registration successful")
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
  <div class="register-page">
    <!-- Alert Notifications -->
    <AlertNotification
      :formSuccessMessage="formAction.formSuccessMessage"
      :formErrorMessage="formAction.formErrorMessage"
    ></AlertNotification>
    
    <!-- Register Container -->
    <div class="register-container">
      <!-- Left Side - Decorative -->
      <div class="register-decorative-side">
        <div class="app-branding">
          <div class="app-logo">
            <span class="music-note">♫</span>
          </div>
          <h1 class="app-name">MoodPro</h1>
        </div>
        <div class="app-tagline">
          <h2>Join Our Music Community</h2>
          <p>Create an account to discover personalized music recommendations based on your mood</p>
        </div>
        <div class="decorative-circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>
      
      <!-- Right Side - Register Form -->
      <div class="register-form-side">
        <div class="register-form-container">
          <h2 class="register-title">Create Account</h2>
          <p class="register-subtitle">Fill in your details to get started</p>
          
          <form @submit.prevent="onFormSubmit" class="register-form">
            <!-- First Name Field -->
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input 
                id="firstname"
                v-model="formData.firstname"
                type="text" 
                placeholder="Enter your first name"
                required
              />
            </div>
            
            <!-- Last Name Field -->
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input 
                id="lastname"
                v-model="formData.lastname"
                type="text" 
                placeholder="Enter your last name"
                required
              />
            </div>
            
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
                placeholder="Create a password (min. 6 characters)"
                required
              />
            </div>
            
            <!-- Terms Checkbox -->
            <div class="form-checkbox">
              <input 
                id="terms"
                v-model="formData.terms"
                type="checkbox" 
                required
              />
              <label for="terms">I agree to the terms and conditions</label>
            </div>
            
            <!-- Register Button -->
            <button 
              type="submit" 
              class="register-button"
              :disabled="formAction.formProcess"
            >
              <span v-if="!formAction.formProcess">Create Account</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
          
          <div class="form-footer">
            <p>Already have an account? 
              <RouterLink to="/login" class="signin-link">Sign in</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.register-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left side - Decorative */
.register-decorative-side {
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

/* Right side - Register Form */
.register-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.register-form-container {
  max-width: 400px;
  width: 100%;
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.register-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.register-form {
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

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.form-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #6a11cb;
}

.form-checkbox label {
  font-size: 0.9rem;
  color: #555;
}

.register-button {
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

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(106, 17, 203, 0.3);
}

.register-button:disabled {
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

.signin-link {
  color: #6a11cb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.signin-link:hover {
  color: #2575fc;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }
  
  .register-decorative-side {
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
  
  .register-form-side {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 1.8rem;
  }
}
</style>
