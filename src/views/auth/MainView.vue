<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMoodStore } from '@/stores/moodStore'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { supabase } from '@/components/utils/supabase'
import { seedAllData, seedPlaylists, addTracksToPlaylist } from '@/components/utils/seedData'

// Initialize stores
const moodStore = useMoodStore()
const userStore = useUserStore()

// Extract reactive state from stores
const { moods, currentPlaylist, isLoading, error } = storeToRefs(moodStore)
const { likedTracks } = storeToRefs(userStore)

// Local state
const selectedMoodId = ref(null)
const showPlaylistModal = ref(false)
const selectedTrackId = ref(null)
const addToPlaylistStatus = ref({
  loading: false,
  success: false,
  error: null
})

// Computed property for current mood name
const selectedMoodName = computed(() => {
  if (!selectedMoodId.value) return ''
  const found = moods.value.find(m => m.id === selectedMoodId.value)
  return found ? found.name : ''
})

// Function to handle mood selection
async function selectMood(moodId) {
  selectedMoodId.value = moodId
  await moodStore.getRecommendedTracks(moodId)
}

// Check if a track is liked by the user
const isTrackLiked = (trackId) => {
  return likedTracks.value.some(track => track.id === trackId)
}

// Function to toggle like status
async function toggleLike(trackId) {
  if (isTrackLiked(trackId)) {
    await userStore.unlikeTrack(trackId)
  } else {
    await userStore.likeTrack(trackId)
  }
}

// Function to open the playlist selection modal
function openPlaylistModal(trackId) {
  selectedTrackId.value = trackId
  showPlaylistModal.value = true
  // Reset status
  addToPlaylistStatus.value = {
    loading: false,
    success: false,
    error: null
  }
}

// Function to close the playlist selection modal
function closePlaylistModal() {
  showPlaylistModal.value = false
  selectedTrackId.value = null
}

// Function to add the selected track to a playlist
async function addToPlaylist(playlistId) {
  if (!selectedTrackId.value || !playlistId) return
  
  addToPlaylistStatus.value.loading = true
  addToPlaylistStatus.value.error = null
  addToPlaylistStatus.value.success = false
  
  try {
    const result = await userStore.addTrackToPlaylist(playlistId, selectedTrackId.value)
    
    if (result.success) {
      addToPlaylistStatus.value.success = true
      // Close the modal after a short delay
      setTimeout(() => {
        closePlaylistModal()
      }, 1500)
    } else {
      addToPlaylistStatus.value.error = result.error || 'Failed to add track to playlist'
    }
  } catch (err) {
    console.error('Error adding track to playlist:', err)
    addToPlaylistStatus.value.error = err.message || 'An unexpected error occurred'
  } finally {
    addToPlaylistStatus.value.loading = false
  }
}

// Set initial mood when moods are loaded
watchEffect(() => {
  if (moods.value.length > 0 && !selectedMoodId.value) {
    selectedMoodId.value = moods.value[0].id
    selectMood(selectedMoodId.value)
  }
})

onMounted(async () => {
  console.log('MainView mounted')
  isLoading.value = true
  
  try {
    // First try to load existing moods and tracks
    await moodStore.fetchMoods()
    await moodStore.fetchTracks()
    
    // Check if there are any moods in the database
    if (moods.value.length === 0) {
      console.log('No moods found in database, seeding initial data...')
      
      // Seed the database with initial data
      const seedResult = await seedAllData()
      console.log('Seed result:', seedResult)
      
      // Refresh the moods and tracks after seeding
      await moodStore.fetchMoods()
      await moodStore.fetchTracks()
      
      if (seedResult.success) {
        console.log('Database seeded successfully')
      } else {
        console.warn('Database seeding had issues:', seedResult.message || seedResult.error)
      }
    }
    
    // If we have moods now, select the first one
    if (moods.value.length > 0) {
      console.log(`Found ${moods.value.length} moods, selecting the first one`)
      selectedMoodId.value = moods.value[0].id
      await selectMood(selectedMoodId.value)
    } else {
      console.warn('No moods available after seeding attempt')
      error.value = 'No mood categories available. Please try again later.'
    }
    
    // Seed playlists for the user if they don't exist
    const authStore = useAuthStore()
    if (authStore.user && authStore.user.id) {
      // Check if user has playlists
      const userPlaylists = await userStore.fetchPlaylists()
      
      if (!userPlaylists || userPlaylists.length === 0) {
        console.log('No playlists found for user, seeding initial playlists...')
        
        // Create sample playlists
        const playlists = await seedPlaylists(authStore.user.id)
        
        if (playlists && playlists.length > 0) {
          console.log(`Created ${playlists.length} playlists for user`)
          
          // Get all tracks to add to playlists
          const { data: allTracks, error: tracksError } = await supabase
            .from('music')
            .select('id')
            .limit(15)
          
          if (!tracksError && allTracks && allTracks.length > 0) {
            // Add some tracks to the first playlist
            const trackIds = allTracks.map(track => track.id)
            
            // Add first 5 tracks to first playlist
            if (trackIds.length >= 5 && playlists[0]) {
              await addTracksToPlaylist(playlists[0].id, trackIds.slice(0, 5))
            }
            
            // Add next 5 tracks to second playlist if it exists
            if (trackIds.length >= 10 && playlists[1]) {
              await addTracksToPlaylist(playlists[1].id, trackIds.slice(5, 10))
            }
            
            // Add remaining tracks to third playlist if it exists
            if (trackIds.length >= 15 && playlists[2]) {
              await addTracksToPlaylist(playlists[2].id, trackIds.slice(10, 15))
            }
          }
        }
      } else {
        console.log(`User already has ${userPlaylists.length} playlists`)
      }
    }
    
    // Load user playlists and liked tracks
    await userStore.fetchPlaylists()
    await userStore.fetchLikedTracks()
    
    // Ensure profile is properly loaded
    if (!userStore.profile) {
      await userStore.fetchProfile()
    }
  } catch (err) {
    console.error('Error initializing MainView:', err)
    error.value = 'Failed to load music data. Please try again.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="app-container">
        <!-- User Welcome Section -->
        <div class="user-welcome" v-if="userStore.profile">
          <h2>Welcome, {{ userStore.profile.first_name }} {{ userStore.profile.last_name }}</h2>
          <p class="welcome-subtitle">Find the perfect music for your mood</p>
        </div>

        <div class="main-content">
          <!-- Mood Selector Column -->
          <div class="mood-section">
            <div class="section-header">
              <h2 class="section-title">Your Mood</h2>
              <p class="section-subtitle">How are you feeling today?</p>
            </div>

            <div class="mood-grid">
              <button
                v-for="mood in moods"
                :key="mood.id"
                @click="selectMood(mood.id)"
                :class="['mood-button', { active: selectedMoodId === mood.id }]"
              >
                {{ mood.name }}
              </button>
            </div>
            <button v-if="selectedMoodId" class="find-button" @click="selectMood(selectedMoodId)">
              <span class="button-icon">🎵</span> Find Music
            </button>
          </div>

          <!-- Playlist Column -->
          <div class="playlist-section">
            <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner"></div>
              <p>Loading your recommendations...</p>
            </div>
            <div v-else-if="error" class="error-container">
              <p>{{ error }}</p>
            </div>
            <div v-else class="playlist-container">
              <div class="section-header">
                <h2 class="section-title">Recommended for "{{ selectedMoodName }}"</h2>
                <p class="section-subtitle">Tracks that match your current mood</p>
              </div>
              
              <p v-if="currentPlaylist.length === 0" class="no-tracks">
                No tracks found for this mood. Try another mood or add some tracks!
              </p>
              <ul v-else class="track-list">
                <li v-for="track in currentPlaylist" :key="track.id" class="track-card">
                  <div class="track-image">
                    <div class="album-placeholder">
                      <span class="music-icon">🎵</span>
                    </div>
                  </div>
                  <div class="track-info">
                    <div class="track-title">{{ track.title }}</div>
                    <div class="track-artist">{{ track.artist }}</div>
                    <div class="track-details">
                      <span class="track-album">{{ track.album }}</span>
                      <span class="track-genre">{{ track.genre }}</span>
                    </div>
                  </div>
                  <div class="track-actions">
                    <button 
                      @click="toggleLike(track.id)" 
                      :class="['like-button', { liked: isTrackLiked(track.id) }]"
                      :title="isTrackLiked(track.id) ? 'Remove from favorites' : 'Add to favorites'"
                    >
                      <span v-if="isTrackLiked(track.id)">❤️</span>
                      <span v-else>🤍</span>
                    </button>
                    <button 
                      @click="openPlaylistModal(track.id)" 
                      class="add-to-playlist-button"
                      title="Add to playlist"
                    >
                      <span>➕</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- User Playlists Section -->
        <div class="playlists-section" v-if="userStore.playlists && userStore.playlists.length > 0">
          <div class="section-header">
            <h2 class="section-title">Your Playlists</h2>
            <p class="section-subtitle">Collections you've created</p>
          </div>
          
          <div class="playlists-grid">
            <div v-for="playlist in userStore.playlists" :key="playlist.id" class="playlist-card">
              <div class="playlist-header">
                <h3 class="playlist-title">{{ playlist.name }}</h3>
                <p class="playlist-description">{{ playlist.description }}</p>
              </div>
              
              <div class="playlist-tracks" v-if="playlist.tracks && playlist.tracks.length > 0">
                <ul class="track-list">
                  <li v-for="track in playlist.tracks" :key="track.id" class="track-card">
                    <div class="track-image">
                      <div class="album-placeholder">
                        <span class="music-icon">🎵</span>
                      </div>
                    </div>
                    <div class="track-info">
                      <div class="track-title">{{ track.title }}</div>
                      <div class="track-artist">{{ track.artist }}</div>
                      <div class="track-details">
                        <span class="track-album">{{ track.album }}</span>
                        <span class="track-genre">{{ track.genre }}</span>
                      </div>
                    </div>
                    <div class="track-actions">
                      <button 
                        @click="toggleLike(track.id)" 
                        :class="['like-button', { liked: isTrackLiked(track.id) }]"
                        :title="isTrackLiked(track.id) ? 'Remove from favorites' : 'Add to favorites'"
                      >
                        <span v-if="isTrackLiked(track.id)">❤️</span>
                        <span v-else>🤍</span>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div class="empty-playlist" v-else>
                <p>No tracks in this playlist yet</p>
                <p class="empty-hint">Like tracks with matching moods to add them here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Playlist Selection Modal -->
      <div v-if="showPlaylistModal" class="modal-overlay" @click="closePlaylistModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Add to Playlist</h3>
            <button class="modal-close" @click="closePlaylistModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <p class="modal-subtitle">Select a playlist to add this track to:</p>
            
            <div v-if="addToPlaylistStatus.loading" class="modal-loading">
              <div class="loading-spinner"></div>
              <p>Adding track to playlist...</p>
            </div>
            
            <div v-else-if="addToPlaylistStatus.success" class="modal-success">
              <p>✅ Track added to playlist successfully!</p>
            </div>
            
            <div v-else-if="addToPlaylistStatus.error" class="modal-error">
              <p>❌ {{ addToPlaylistStatus.error }}</p>
            </div>
            
            <div v-else class="playlist-selection">
              <div 
                v-for="playlist in userStore.playlists" 
                :key="playlist.id" 
                class="playlist-option"
                @click="addToPlaylist(playlist.id)"
              >
                <h4 class="playlist-option-title">{{ playlist.name }}</h4>
                <p class="playlist-option-description">{{ playlist.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  gap: 30px;
  background-color: #f8f9fa;
}

.user-welcome {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(106, 17, 203, 0.2);
}

.user-welcome h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.mood-section, .playlist-section {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.playlist-section {
  flex: 2;
  min-width: 500px;
}

.section-header {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.section-subtitle {
  font-size: 1rem;
  color: #666;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.mood-button {
  padding: 15px;
  border: 2px solid #eaeaea;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-align: center;
  font-weight: 500;
  color: #444;
}

.mood-button:hover {
  border-color: #6a11cb;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(106, 17, 203, 0.15);
}

.mood-button.active {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border-color: transparent;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(106, 17, 203, 0.25);
}

.find-button {
  padding: 15px 25px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: auto;
  align-self: center;
}

.button-icon {
  font-size: 1.2rem;
}

.find-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(106, 17, 203, 0.25);
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(106, 17, 203, 0.1);
  border-left-color: #6a11cb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #e74c3c;
  font-size: 1.1rem;
  text-align: center;
  padding: 20px;
}

.no-tracks {
  text-align: center;
  color: #666;
  margin: 40px 0;
  font-size: 1.1rem;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.track-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.track-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.track-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.track-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.album-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border-radius: 8px;
}

.music-icon {
  font-size: 1.8rem;
}

.track-info {
  flex: 1;
}

.track-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
}

.track-artist {
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
}

.track-details {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #777;
}

.track-album, .track-genre {
  display: inline-block;
}

.track-genre::before {
  content: '•';
  margin-right: 5px;
}

.track-actions {
  display: flex;
  gap: 10px;
  margin-left: 15px;
}

.like-button, .add-to-playlist-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.like-button:hover, .add-to-playlist-button:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.like-button.liked {
  background-color: #fff0f0;
}

.add-to-playlist-button {
  background-color: #f0f8ff;
  font-size: 1.2rem;
}

/* Favorites Section */
.favorites-section {
  margin-top: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.favorites-content {
  margin-top: 20px;
}

/* Playlists Section */
.playlists-section {
  margin-top: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.playlist-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.playlist-header {
  margin-bottom: 15px;
}

.playlist-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.playlist-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.playlist-tracks {
  margin-top: 15px;
}

.playlist-tracks .track-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

.playlist-tracks .track-card {
  background-color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}

.empty-playlist {
  text-align: center;
  padding: 20px 0;
  color: #888;
}

.empty-hint {
  font-size: 0.85rem;
  margin-top: 5px;
  color: #aaa;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-subtitle {
  margin-top: 0;
  margin-bottom: 20px;
  color: #666;
}

.playlist-selection {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.playlist-option {
  padding: 15px;
  border-radius: 10px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-option:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.playlist-option-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.playlist-option-description {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.modal-loading, .modal-success, .modal-error {
  text-align: center;
  padding: 20px 0;
}

.modal-success {
  color: #28a745;
}

.modal-error {
  color: #dc3545;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .mood-section, .playlist-section {
    min-width: 100%;
  }
  
  .modal-content {
    width: 95%;
    max-height: 70vh;
  }
}

.error {
  color: #e53935;
}

.title {
  font-size: 50px;
  margin-bottom: 12px;
  color: #a601a1;
}
</style>
