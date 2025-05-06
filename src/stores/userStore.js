import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/components/utils/supabase'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  
  const profile = ref(null)
  const playlists = ref([])
  const likedTracks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function initialize() {
    if (!authStore.isAuthenticated()) return

    isLoading.value = true
    try {
      // Set a default profile based on auth user if available
      if (authStore.user) {
        // Extract name from email if available
        let firstName = ''
        let lastName = ''
        
        if (authStore.user.email) {
          // Try to extract a name from the email (part before @)
          const emailName = authStore.user.email.split('@')[0]
          
          // Convert email name to proper case and split if it contains dots or underscores
          if (emailName.includes('.')) {
            const nameParts = emailName.split('.')
            firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
            lastName = nameParts.length > 1 ? 
              nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ''
          } else if (emailName.includes('_')) {
            const nameParts = emailName.split('_')
            firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
            lastName = nameParts.length > 1 ? 
              nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ''
          } else {
            // Just use the email name as first name
            firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
          }
        }
        
        profile.value = {
          id: authStore.user.id,
          email: authStore.user.email,
          first_name: firstName,
          last_name: lastName
        }
      }
      
      try {
        // Try to get user profile
        await fetchProfile()
      } catch (profileErr) {
        console.warn('Error fetching profile, using default:', profileErr)
        // Continue with default profile
      }
      
      try {
        // Try to get user playlists
        await fetchPlaylists()
      } catch (playlistErr) {
        console.warn('Error fetching playlists:', playlistErr)
        // Continue without playlists
        playlists.value = []
      }
      
      try {
        // Try to get liked tracks
        await fetchLikedTracks()
      } catch (likesErr) {
        console.warn('Error fetching liked tracks:', likesErr)
        // Continue without liked tracks
        likedTracks.value = []
      }
    } catch (err) {
      error.value = err.message
      console.error('User store initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile() {
    try {
      if (!authStore.user || !authStore.user.id) {
        throw new Error('User not authenticated or missing ID')
      }
      
      // Check for pending profile data in localStorage (from registration)
      let pendingProfile = null
      try {
        const pendingProfileData = localStorage.getItem('pendingUserProfile')
        if (pendingProfileData) {
          pendingProfile = JSON.parse(pendingProfileData)
          // Clear the pending profile data after retrieving it
          localStorage.removeItem('pendingUserProfile')
        }
      } catch (e) {
        console.warn('Error retrieving pending profile data:', e)
      }
      
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authStore.user.id)
      
      if (profileError) {
        // If the profiles table doesn't exist, use default profile
        if (profileError.message.includes('does not exist')) {
          console.log('Profiles table does not exist, using default profile')
          // Just use the default profile we set in initialize
          return
        }
        throw profileError
      }
      
      if (data && data.length > 0) {
        // Use the first profile found
        profile.value = data[0]
        
        // Check if profile has empty first_name or last_name and update if needed
        if ((!profile.value.first_name || !profile.value.last_name) && pendingProfile) {
          // Update the profile with pending data
          await updateProfile({
            first_name: pendingProfile.first_name || profile.value.first_name || 'User',
            last_name: pendingProfile.last_name || profile.value.last_name || ''
          })
        } else if (!profile.value.first_name && !profile.value.last_name) {
          // Extract name from email if available
          let firstName = 'User'
          let lastName = ''
          
          if (authStore.user.email) {
            // Try to extract a name from the email (part before @)
            const emailName = authStore.user.email.split('@')[0]
            
            // Convert email name to proper case and split if it contains dots or underscores
            if (emailName.includes('.')) {
              const nameParts = emailName.split('.')
              firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
              lastName = nameParts.length > 1 ? 
                nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ''
            } else if (emailName.includes('_')) {
              const nameParts = emailName.split('_')
              firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
              lastName = nameParts.length > 1 ? 
                nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ''
            } else {
              // Just use the email name as first name
              firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
            }
            
            // Update the profile
            await updateProfile({
              first_name: firstName,
              last_name: lastName
            })
          }
        }
      } else {
        // No profile found, create one if possible
        console.log('No profile found, attempting to create one')
        try {
          // Extract name from email if available
          let firstName = pendingProfile?.first_name || 'User'
          let lastName = pendingProfile?.last_name || ''
          
          if (!firstName && !lastName && authStore.user.email) {
            // Try to extract a name from the email (part before @)
            const emailName = authStore.user.email.split('@')[0]
            
            // Convert email name to proper case and split if it contains dots or underscores
            if (emailName.includes('.')) {
              const nameParts = emailName.split('.')
              firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
              lastName = nameParts.length > 1 ? 
                nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ''
            } else if (emailName.includes('_')) {
              const nameParts = emailName.split('_')
              firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
              lastName = nameParts.length > 1 ? 
                nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ''
            } else {
              // Just use the email name as first name
              firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
            }
          }
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authStore.user.id,
              email: authStore.user.email,
              first_name: firstName,
              last_name: lastName,
              created_at: new Date()
            })
            .select()
          
          if (createError) {
            console.warn('Error creating profile:', createError)
            // Set a default profile
            profile.value = {
              id: authStore.user.id,
              email: authStore.user.email,
              first_name: firstName,
              last_name: lastName
            }
          } else if (newProfile && newProfile.length > 0) {
            profile.value = newProfile[0]
          }
        } catch (createErr) {
          console.warn('Error creating profile:', createErr)
          // Set a default profile
          profile.value = {
            id: authStore.user.id,
            email: authStore.user.email,
            first_name: 'User',
            last_name: ''
          }
        }
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err)
      // Don't throw, just continue with default profile
      profile.value = {
        id: authStore.user?.id,
        email: authStore.user?.email,
        first_name: 'User',
        last_name: ''
      }
    }
  }

  async function fetchPlaylists() {
    try {
      if (!authStore.user || !authStore.user.id) {
        console.warn('User not authenticated or missing ID, skipping playlists fetch')
        playlists.value = []
        return []
      }
      
      // Fetch the playlists
      const { data, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', authStore.user.id)
      
      if (playlistError) {
        if (playlistError.message.includes('does not exist')) {
          console.log('Playlists table does not exist, using empty array')
          playlists.value = []
          return []
        }
        console.warn('Error fetching playlists:', playlistError)
        playlists.value = []
        return []
      }
      
      if (!data || data.length === 0) {
        playlists.value = []
        return []
      }
      
      // Store the basic playlist data
      playlists.value = data.map(playlist => ({
        ...playlist,
        tracks: [] // Initialize empty tracks array for each playlist
      }))
      
      // For each playlist, fetch its tracks
      for (const playlist of playlists.value) {
        try {
          // Get the track IDs for this playlist
          const { data: playlistTracks, error: tracksError } = await supabase
            .from('playlist_tracks')
            .select('music_id')
            .eq('playlist_id', playlist.id)
          
          if (tracksError) {
            console.warn(`Error fetching tracks for playlist ${playlist.id}:`, tracksError)
            continue
          }
          
          if (!playlistTracks || playlistTracks.length === 0) {
            continue
          }
          
          // Get the actual track data
          const trackIds = playlistTracks.map(pt => pt.music_id)
          const { data: tracks, error: musicError } = await supabase
            .from('music')
            .select('*')
            .in('id', trackIds)
          
          if (musicError) {
            console.warn(`Error fetching music for playlist ${playlist.id}:`, musicError)
            continue
          }
          
          // Add tracks to the playlist
          playlist.tracks = tracks || []
        } catch (playlistErr) {
          console.error(`Error processing playlist ${playlist.id}:`, playlistErr)
        }
      }
      
      return playlists.value
    } catch (err) {
      console.error('Error in fetchPlaylists:', err)
      playlists.value = []
      return []
    }
  }

  async function fetchLikedTracks() {
    try {
      if (!authStore.user || !authStore.user.id) {
        console.warn('User not authenticated or missing ID, skipping liked tracks fetch')
        likedTracks.value = []
        return
      }
      
      const { data, error: likesError } = await supabase
        .from('liked_tracks')
        .select('music_id')
        .eq('user_id', authStore.user.id)
      
      if (likesError) {
        // If the liked_tracks table doesn't exist, just use an empty array
        if (likesError.message.includes('does not exist')) {
          console.log('Liked tracks table does not exist, using empty array')
          likedTracks.value = []
          return
        }
        console.warn('Error fetching liked tracks:', likesError)
        likedTracks.value = []
        return
      }
      
      // If we have liked tracks, fetch the actual track data
      if (data && data.length > 0) {
        const musicIds = data.map(item => item.music_id).filter(id => id)
        
        if (musicIds.length === 0) {
          console.log('No valid music IDs found in liked tracks')
          likedTracks.value = []
          return
        }
        
        try {
          const { data: tracksData, error: tracksError } = await supabase
            .from('music')
            .select('*')
            .in('id', musicIds)
          
          if (tracksError) {
            // If the music table doesn't exist, just use an empty array
            if (tracksError.message.includes('does not exist')) {
              console.log('Music table does not exist, using empty array')
              likedTracks.value = []
              return
            }
            console.warn('Error fetching liked music tracks:', tracksError)
            likedTracks.value = []
            return
          }
          
          likedTracks.value = tracksData || []
        } catch (musicErr) {
          console.error('Error fetching liked music tracks:', musicErr)
          likedTracks.value = []
        }
      } else {
        console.log('No liked tracks found')
        likedTracks.value = []
      }
    } catch (err) {
      console.error('Error in fetchLikedTracks:', err)
      likedTracks.value = []
      // Don't throw, just continue with empty liked tracks
    }
  }

  async function updateProfile(updates) {
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authStore.user.id)
      .select()
      .single()
    
    if (updateError) {
      error.value = updateError.message
      return { success: false, error: updateError.message }
    }
    
    profile.value = data
    return { success: true }
  }

  async function createPlaylist(name, description = '') {
    const { data, error: createError } = await supabase
      .from('playlists')
      .insert({
        user_id: authStore.user.id,
        name,
        description
      })
      .select()
      .single()
    
    if (createError) {
      error.value = createError.message
      return { success: false, error: createError.message }
    }
    
    playlists.value.push(data)
    return { success: true, playlist: data }
  }

  async function likeTrack(trackId) {
    // First mark the track as liked in the liked_tracks table
    const { error: likeError } = await supabase
      .from('liked_tracks')
      .insert({
        user_id: authStore.user.id,
        music_id: trackId
      })
    
    if (likeError) {
      error.value = likeError.message
      return { success: false, error: likeError.message }
    }
    
    // Fetch the track data
    const { data: track, error: trackError } = await supabase
      .from('music')
      .select('*')
      .eq('id', trackId)
      .single()
    
    if (trackError) {
      error.value = trackError.message
      return { success: false, error: trackError.message }
    }
    
    // Add to likedTracks array
    likedTracks.value.push(track)
    
    // Now determine which playlist to add the track to based on its mood
    try {
      // Ensure playlists are loaded
      if (playlists.value.length === 0) {
        await fetchPlaylists()
      }
      
      // Find the appropriate playlist based on the track's mood
      let targetPlaylistId = null
      
      if (track.mood_id) {
        // Get the mood name
        const { data: moodData } = await supabase
          .from('moods')
          .select('name')
          .eq('id', track.mood_id)
          .single()
        
        if (moodData) {
          const moodName = moodData.name.toLowerCase()
          
          // Match mood to playlist
          if (['happy', 'excited', 'energetic'].includes(moodName)) {
            // Find the "Workout Mix" playlist
            const workoutPlaylist = playlists.value.find(p => p.name === 'Workout Mix')
            if (workoutPlaylist) targetPlaylistId = workoutPlaylist.id
          } 
          else if (['calm', 'relaxed', 'romantic'].includes(moodName)) {
            // Find the "Chill Vibes" playlist
            const chillPlaylist = playlists.value.find(p => p.name === 'Chill Vibes')
            if (chillPlaylist) targetPlaylistId = chillPlaylist.id
          }
          else {
            // Default to "My Favorites" for other moods
            const favoritesPlaylist = playlists.value.find(p => p.name === 'My Favorites')
            if (favoritesPlaylist) targetPlaylistId = favoritesPlaylist.id
          }
        }
      }
      
      // If we couldn't determine a playlist or the mood doesn't match, use My Favorites
      if (!targetPlaylistId) {
        const favoritesPlaylist = playlists.value.find(p => p.name === 'My Favorites')
        if (favoritesPlaylist) targetPlaylistId = favoritesPlaylist.id
      }
      
      // Add track to the playlist if we found one
      if (targetPlaylistId) {
        // Check if track is already in this playlist to avoid duplicates
        const { data: existingTracks, error: checkError } = await supabase
          .from('playlist_tracks')
          .select('music_id')
          .eq('playlist_id', targetPlaylistId)
          .eq('music_id', trackId)
        
        if (!checkError && (!existingTracks || existingTracks.length === 0)) {
          // Add track to playlist
          const { error: insertError } = await supabase
            .from('playlist_tracks')
            .insert({
              playlist_id: targetPlaylistId,
              music_id: trackId
              // Remove the added_at field as it may not be in the schema
            })
            
          if (insertError) {
            console.error('Error adding track to playlist:', insertError)
          }
        }
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error adding track to playlist:', err)
      // Even if adding to playlist fails, we still marked it as liked
      return { success: true }
    }
  }

  async function unlikeTrack(trackId) {
    // Remove from liked_tracks table
    const { error: unlikeError } = await supabase
      .from('liked_tracks')
      .delete()
      .eq('user_id', authStore.user.id)
      .eq('music_id', trackId)
    
    if (unlikeError) {
      error.value = unlikeError.message
      return { success: false, error: unlikeError.message }
    }
    
    // Remove track from likedTracks array
    likedTracks.value = likedTracks.value.filter(track => track.id !== trackId)
    
    try {
      // Also remove the track from all playlists
      // First, get all user playlists
      if (playlists.value.length === 0) {
        await fetchPlaylists()
      }
      
      // Get playlist IDs
      const playlistIds = playlists.value.map(p => p.id)
      
      if (playlistIds.length > 0) {
        // Remove track from all playlists
        await supabase
          .from('playlist_tracks')
          .delete()
          .in('playlist_id', playlistIds)
          .eq('music_id', trackId)
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error removing track from playlists:', err)
      // Even if removing from playlists fails, we still marked it as unliked
      return { success: true }
    }
  }

  // Add a track to a specific playlist
  async function addTrackToPlaylist(playlistId, trackId) {
    try {
      if (!playlistId || !trackId) {
        return { success: false, error: 'Missing playlist ID or track ID' }
      }
      
      // Check if track already exists in this playlist to avoid duplicates
      const { data: existingTracks, error: checkError } = await supabase
        .from('playlist_tracks')
        .select('music_id')
        .eq('playlist_id', playlistId)
        .eq('music_id', trackId)
      
      if (checkError) {
        console.error('Error checking if track exists in playlist:', checkError)
        return { success: false, error: checkError.message }
      }
      
      // If track already exists in playlist, return success
      if (existingTracks && existingTracks.length > 0) {
        return { success: true, message: 'Track already in playlist' }
      }
      
      // Add track to playlist
      const { error: insertError } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: playlistId,
          music_id: trackId
        })
      
      if (insertError) {
        console.error('Error adding track to playlist:', insertError)
        return { success: false, error: insertError.message }
      }
      
      // Update the playlist in the local state
      const playlistIndex = playlists.value.findIndex(p => p.id === playlistId)
      if (playlistIndex !== -1) {
        // Fetch the track data
        const { data: track, error: trackError } = await supabase
          .from('music')
          .select('*')
          .eq('id', trackId)
          .single()
        
        if (!trackError && track) {
          // Add track to the playlist's tracks array if it doesn't already exist
          if (!playlists.value[playlistIndex].tracks) {
            playlists.value[playlistIndex].tracks = []
          }
          
          // Check if track is already in the array
          const trackExists = playlists.value[playlistIndex].tracks.some(t => t.id === trackId)
          if (!trackExists) {
            playlists.value[playlistIndex].tracks.push(track)
          }
        }
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error in addTrackToPlaylist:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    profile,
    playlists,
    likedTracks,
    isLoading,
    error,
    initialize,
    fetchProfile,
    fetchPlaylists,
    fetchLikedTracks,
    updateProfile,
    createPlaylist,
    likeTrack,
    unlikeTrack,
    addTrackToPlaylist,
    isTrackLiked: (trackId) => likedTracks.value.some(track => track.id === trackId)
  }
})
