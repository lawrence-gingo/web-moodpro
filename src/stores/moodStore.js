import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/components/utils/supabase'
import { useAuthStore } from './authStore'

export const useMoodStore = defineStore('mood', () => {
  const authStore = useAuthStore()
  
  const moods = ref([])
  const tracks = ref([])
  const currentMood = ref(null)
  const currentPlaylist = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function initialize() {
    isLoading.value = true
    try {
      // Fetch all moods
      await fetchMoods()
      
      // Fetch all tracks
      await fetchTracks()
      
      // Set default mood if available
      if (moods.value.length > 0) {
        setCurrentMood(moods.value[0].id)
      }
    } catch (err) {
      error.value = err.message
      console.error('Mood store initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMoods() {
    const { data, error: moodsError } = await supabase
      .from('moods')
      .select('*')
    
    if (moodsError) throw moodsError
    
    moods.value = data
  }

  async function fetchTracks() {
    const { data, error: tracksError } = await supabase
      .from('music')
      .select('*')
    
    if (tracksError) throw tracksError
    
    tracks.value = data
  }

  function setCurrentMood(moodId) {
    currentMood.value = moods.value.find(mood => mood.id === moodId) || null
    
    // Update playlist based on selected mood
    if (currentMood.value) {
      currentPlaylist.value = tracks.value.filter(track => track.mood_id === moodId)
    } else {
      currentPlaylist.value = []
    }
  }

  async function getRecommendedTracks(moodId) {
    isLoading.value = true
    error.value = null
    
    try {
      if (!moodId) {
        console.warn('No mood ID provided for getRecommendedTracks')
        return []
      }
      
      // Set the current mood
      setCurrentMood(moodId)
      
      console.log(`Fetching tracks for mood ID: ${moodId}`)
      
      // First try to get tracks directly from the music table
      const { data: moodTracks, error } = await supabase
        .from('music')
        .select('*')
        .eq('mood_id', moodId)
      
      if (error) {
        console.error('Error fetching tracks:', error)
        
        // If there's an error, it might be because the table doesn't exist or has a different structure
        // Let's try a more generic query
        try {
          const { data: tracksAlt, error: errorAlt } = await supabase
            .from('music')
            .select('*')
          
          if (errorAlt) {
            console.error('Error with alternative track fetch:', errorAlt)
            return []
          }
          
          // If we got tracks but no mood_id field, just return all tracks
          if (tracksAlt && tracksAlt.length > 0) {
            console.log(`Found ${tracksAlt.length} tracks in total, no mood filtering applied`)
            currentPlaylist.value = tracksAlt
            return tracksAlt
          }
          
          return []
        } catch (altErr) {
          console.error('Error in alternative track fetch:', altErr)
          return []
        }
      }
      
      // If we successfully got tracks for this mood
      if (moodTracks && moodTracks.length > 0) {
        console.log(`Found ${moodTracks.length} tracks for mood ID: ${moodId}`)
        currentPlaylist.value = moodTracks
        return moodTracks
      } else {
        console.log(`No tracks found for mood ID: ${moodId}`)
        currentPlaylist.value = []
        return []
      }
    } catch (err) {
      console.error('Error in getRecommendedTracks:', err)
      error.value = err.message
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function addMood(name, description = '') {
    if (!authStore.isAuthenticated()) {
      error.value = 'You must be logged in to create a mood'
      return { success: false, error: 'Authentication required' }
    }
    
    const { data, error: createError } = await supabase
      .from('moods')
      .insert({
        name,
        description,
        created_at: new Date()
      })
      .select()
      .single()
    
    if (createError) {
      error.value = createError.message
      return { success: false, error: createError.message }
    }
    
    moods.value.push(data)
    return { success: true, mood: data }
  }

  async function addTrack(title, artist, album, genre, moodId) {
    if (!authStore.isAuthenticated()) {
      error.value = 'You must be logged in to add a track'
      return { success: false, error: 'Authentication required' }
    }
    
    const { data, error: createError } = await supabase
      .from('music')
      .insert({
        title,
        artist,
        album,
        genre,
        mood_id: moodId
      })
      .select()
      .single()
    
    if (createError) {
      error.value = createError.message
      return { success: false, error: createError.message }
    }
    
    tracks.value.push(data)
    
    // If this track belongs to the current mood, add it to the current playlist
    if (currentMood.value && currentMood.value.id === moodId) {
      currentPlaylist.value.push(data)
    }
    
    return { success: true, track: data }
  }

  return {
    moods,
    tracks,
    currentMood,
    currentPlaylist,
    isLoading,
    error,
    initialize,
    fetchMoods,
    fetchTracks,
    setCurrentMood,
    getRecommendedTracks,
    addMood,
    addTrack
  }
})
