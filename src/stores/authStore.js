import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/components/utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const session = ref(null)

  async function initialize() {
    isLoading.value = true
    try {
      // Get the current session
      const { data, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError
      
      session.value = data.session
      
      if (data.session) {
        try {
          // Get user profile
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
          
          if (userError) {
            // If the profiles table doesn't exist, just use the session user data
            if (userError.message.includes('does not exist')) {
              console.log('Profiles table does not exist, using session user data')
              user.value = data.session.user
            } else {
              throw userError
            }
          } else if (userData && userData.length > 0) {
            // Use the first profile found
            user.value = userData[0]
          } else {
            // No profile found, use session data
            console.log('No profile found for user, using session data')
            user.value = data.session.user
          }
        } catch (profileErr) {
          console.warn('Error fetching user profile:', profileErr)
          // Fall back to using session user data
          user.value = data.session.user
        }
      }
    } catch (err) {
      error.value = err.message
      console.error('Auth store initialization error:', err)
    } finally {
      isLoading.value = false
    }

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
    })
  }

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      
      session.value = data.session
      user.value = data.user
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function register(email, password) {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (signUpError) throw signUpError
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      error.value = signOutError.message
      return { success: false, error: signOutError.message }
    }
    
    user.value = null
    session.value = null
    
    return { success: true }
  }

  return {
    user,
    session,
    isLoading,
    error,
    initialize,
    login,
    register,
    logout,
    isAuthenticated: () => !!session.value
  }
})
