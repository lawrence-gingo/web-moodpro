import { supabase } from './supabase'

// Sample moods data
const moodsData = [
  { name: 'Happy', description: 'Upbeat and joyful music to boost your mood' },
  { name: 'Sad', description: 'Melancholic tunes for when you need to feel your emotions' },
  { name: 'Energetic', description: 'High-energy tracks to get you moving' },
  { name: 'Calm', description: 'Peaceful music to help you relax and unwind' },
  { name: 'Romantic', description: 'Love songs and heartfelt melodies' },
  { name: 'Angry', description: 'Intense music to channel your frustration' },
  { name: 'Relaxed', description: 'Laid-back tunes for chilling out' },
  { name: 'Fearful', description: 'Atmospheric tracks with a touch of suspense' },
  { name: 'Excited', description: 'Celebratory music for special moments' }
]

// Function to seed moods data
export async function seedMoods() {
  try {
    // Check if moods already exist
    const { data: existingMoods, error: checkError } = await supabase
      .from('moods')
      .select('id, name')
    
    if (checkError) {
      console.error('Error checking moods:', checkError)
      return []
    }
    
    if (existingMoods && existingMoods.length > 0) {
      console.log(`${existingMoods.length} moods already exist in the database`)
      return existingMoods
    }
    
    // Insert moods directly without foreign key references
    const simplifiedMoodsData = moodsData.map(mood => ({
      name: mood.name,
      description: mood.description
    }))
    
    const { data, error } = await supabase
      .from('moods')
      .insert(simplifiedMoodsData)
      .select()
    
    if (error) {
      console.error('Error inserting moods batch:', error)
      
      // Fall back to inserting one by one if batch insert fails
      console.log('Trying to insert moods one by one...')
      const insertedMoods = []
      
      for (const mood of simplifiedMoodsData) {
        const { data: singleData, error: singleError } = await supabase
          .from('moods')
          .insert(mood)
          .select()
        
        if (singleError) {
          console.warn(`Error inserting mood ${mood.name}:`, singleError)
          continue
        }
        
        if (singleData && singleData.length > 0) {
          insertedMoods.push(singleData[0])
        }
      }
      
      console.log(`Successfully seeded ${insertedMoods.length} moods individually`)
      return insertedMoods
    }
    
    console.log(`Successfully seeded ${data.length} moods in batch`)
    return data
  } catch (err) {
    console.error('Error seeding moods:', err)
    return []
  }
}

// Function to seed tracks for a specific mood
export async function seedTracksForMood(moodId, moodName) {
  try {
    if (!moodId) {
      console.error('Cannot seed tracks: Missing mood ID')
      return []
    }
    
    // Check if tracks already exist for this mood
    const { data: existingTracks, error: checkError } = await supabase
      .from('music')
      .select('id, title')
      .eq('mood_id', moodId)
    
    if (checkError) {
      console.error('Error checking existing tracks:', checkError)
      return []
    }
    
    if (existingTracks && existingTracks.length > 0) {
      console.log(`${existingTracks.length} tracks already exist for mood: ${moodName}`)
      return existingTracks
    }
    
    // Sample tracks based on mood
    let tracksToInsert = []
    
    switch(moodName) {
      case 'Happy':
        tracksToInsert = [
          { title: 'Sunshine Vibes', album: 'Joyful Beats', artist: 'Joy Beats', genre: 'Pop', mood_id: moodId },
          { title: 'Cheer Up!', album: 'Smiley Sounds', artist: 'Smiley Sounds', genre: 'Pop', mood_id: moodId },
          { title: 'Bubble Pop', album: 'Fun Factory', artist: 'Fun Factory', genre: 'Pop', mood_id: moodId },
          { title: 'Bright Morning', album: 'Daylight Tunes', artist: 'Morning Vibes', genre: 'Pop', mood_id: moodId },
          { title: 'Happiness Overload', album: 'Feel Good', artist: 'Jolly Crew', genre: 'Pop', mood_id: moodId }
        ]
        break
      case 'Sad':
        tracksToInsert = [
          { title: 'Blue Hour', album: 'Lonely Nights', artist: 'Tearful Tunes', genre: 'Ballad', mood_id: moodId },
          { title: 'Midnight Rain', album: 'Dark Hours', artist: 'The Echo', genre: 'Alternative', mood_id: moodId },
          { title: 'Quiet Room', album: 'Melancholy', artist: 'Solitary Notes', genre: 'Ambient', mood_id: moodId },
          { title: 'Fading Light', album: 'Lonely Heart', artist: 'Sad Souls', genre: 'Ballad', mood_id: moodId },
          { title: 'Tears in the Rain', album: 'Solitude Sound', artist: 'Soul Echo', genre: 'Alternative', mood_id: moodId }
        ]
        break
      case 'Energetic':
        tracksToInsert = [
          { title: 'Power Surge', album: 'Electric Energy', artist: 'Electro Drive', genre: 'Electronic', mood_id: moodId },
          { title: 'Go Go Go!', album: 'Upbeat Pulse', artist: 'Upbeat Unit', genre: 'Pop', mood_id: moodId },
          { title: 'Rush Hour', album: 'High Energy', artist: 'Vibe Masters', genre: 'Electronic', mood_id: moodId },
          { title: 'Jump Higher', album: 'Adrenaline Rush', artist: 'Energy Pulse', genre: 'Pop', mood_id: moodId },
          { title: 'Energy Flow', album: 'Charged', artist: 'Vibe Squad', genre: 'Electronic', mood_id: moodId }
        ]
        break
      case 'Calm':
        tracksToInsert = [
          { title: 'Tranquility', album: 'Peaceful Sounds', artist: 'Serenity Sounds', genre: 'Ambient', mood_id: moodId },
          { title: 'Lost in Thought', album: 'Mindful Melodies', artist: 'Mindful Melodies', genre: 'Ambient', mood_id: moodId },
          { title: 'Peaceful Dreams', album: 'Relaxation', artist: 'Harmony Collective', genre: 'Ambient', mood_id: moodId },
          { title: 'Calm Waters', album: 'Stillness', artist: 'Silent Waves', genre: 'Ambient', mood_id: moodId },
          { title: 'Evening Breeze', album: 'Gentle Winds', artist: 'Soft Winds', genre: 'Ambient', mood_id: moodId }
        ]
        break
      case 'Romantic':
        tracksToInsert = [
          { title: 'Love Song', album: 'Heart Beats', artist: 'Love Sound', genre: 'Pop', mood_id: moodId },
          { title: 'Sweet Dreams', album: 'Romantic Nights', artist: 'Dream Sound', genre: 'Pop', mood_id: moodId },
          { title: 'Forever', album: 'Timeless Love', artist: 'Eternity Sound', genre: 'Pop', mood_id: moodId },
          { title: 'My Heart', album: 'Love Letters', artist: 'Heart Beat', genre: 'Pop', mood_id: moodId },
          { title: 'Dreamy Eyes', album: 'Lover Boy', artist: 'Dream Maker', genre: 'Pop', mood_id: moodId }
        ]
        break
      default:
        tracksToInsert = [
          { title: `${moodName} Track 1`, album: `${moodName} Album`, artist: 'Various Artists', genre: 'Mixed', mood_id: moodId },
          { title: `${moodName} Track 2`, album: `${moodName} Album`, artist: 'Various Artists', genre: 'Mixed', mood_id: moodId },
          { title: `${moodName} Track 3`, album: `${moodName} Album`, artist: 'Various Artists', genre: 'Mixed', mood_id: moodId }
        ]
    }
    
    // Try batch insert first
    const { data, error } = await supabase
      .from('music')
      .insert(tracksToInsert)
      .select()
    
    if (error) {
      console.error('Error batch inserting tracks:', error)
      
      // Fall back to inserting tracks one by one
      console.log('Trying to insert tracks one by one...')
      const insertedTracks = []
      
      for (const track of tracksToInsert) {
        const { data: singleData, error: singleError } = await supabase
          .from('music')
          .insert(track)
          .select()
        
        if (singleError) {
          console.warn(`Error inserting track ${track.title}:`, singleError)
          continue
        }
        
        if (singleData && singleData.length > 0) {
          insertedTracks.push(singleData[0])
        }
      }
      
      console.log(`Successfully seeded ${insertedTracks.length} tracks individually for mood: ${moodName}`)
      return insertedTracks
    }
    
    console.log(`Successfully seeded ${data.length} tracks in batch for mood: ${moodName}`)
    return data
  } catch (err) {
    console.error(`Error seeding tracks for mood ${moodName}:`, err)
    return []
  }
}

// Function to seed playlists for a user
export async function seedPlaylists(userId) {
  try {
    if (!userId) {
      console.error('Cannot seed playlists: Missing user ID')
      return []
    }
    
    // Check if playlists already exist for this user
    const { data: existingPlaylists, error: checkError } = await supabase
      .from('playlists')
      .select('id, name')
      .eq('user_id', userId)
    
    if (checkError) {
      console.error('Error checking playlists:', checkError)
      return []
    }
    
    if (existingPlaylists && existingPlaylists.length > 0) {
      console.log(`${existingPlaylists.length} playlists already exist for user`)
      return existingPlaylists
    }
    
    // Sample playlists to create
    const playlistsToCreate = [
      { name: 'My Favorites', description: 'All my favorite tracks', user_id: userId },
      { name: 'Workout Mix', description: 'Energetic tracks for workouts', user_id: userId },
      { name: 'Chill Vibes', description: 'Relaxing music for downtime', user_id: userId }
    ]
    
    // Try batch insert first
    const { data, error } = await supabase
      .from('playlists')
      .insert(playlistsToCreate)
      .select()
    
    if (error) {
      console.error('Error batch inserting playlists:', error)
      
      // Fall back to inserting one by one
      console.log('Trying to insert playlists one by one...')
      const insertedPlaylists = []
      
      for (const playlist of playlistsToCreate) {
        const { data: singleData, error: singleError } = await supabase
          .from('playlists')
          .insert(playlist)
          .select()
        
        if (singleError) {
          console.warn(`Error inserting playlist ${playlist.name}:`, singleError)
          continue
        }
        
        if (singleData && singleData.length > 0) {
          insertedPlaylists.push(singleData[0])
        }
      }
      
      console.log(`Successfully seeded ${insertedPlaylists.length} playlists individually`)
      return insertedPlaylists
    }
    
    console.log(`Successfully seeded ${data.length} playlists in batch`)
    return data
  } catch (err) {
    console.error('Error seeding playlists:', err)
    return []
  }
}

// Function to add tracks to a playlist
export async function addTracksToPlaylist(playlistId, trackIds) {
  try {
    if (!playlistId || !trackIds || trackIds.length === 0) {
      console.error('Cannot add tracks to playlist: Missing playlist ID or track IDs')
      return []
    }
    
    // Check if tracks already exist in this playlist to avoid conflicts
    const { data: existingTracks, error: checkError } = await supabase
      .from('playlist_tracks')
      .select('music_id')
      .eq('playlist_id', playlistId)
    
    if (checkError) {
      console.error('Error checking existing playlist tracks:', checkError)
    }
    
    // Filter out tracks that already exist in the playlist
    let existingTrackIds = []
    if (existingTracks && existingTracks.length > 0) {
      existingTrackIds = existingTracks.map(track => track.music_id)
      console.log(`Playlist already has ${existingTrackIds.length} tracks`)
    }
    
    const newTrackIds = trackIds.filter(id => !existingTrackIds.includes(id))
    
    if (newTrackIds.length === 0) {
      console.log(`No new tracks to add to playlist ${playlistId}`)
      return []
    }
    
    // Create playlist_tracks entries with unique position values
    const startPosition = existingTrackIds.length + 1
    const playlistTracksToCreate = newTrackIds.map((trackId, index) => ({
      playlist_id: playlistId,
      music_id: trackId,
      position: startPosition + index
    }))
    
    // Try adding tracks one by one to avoid conflicts
    const addedTracks = []
    for (const track of playlistTracksToCreate) {
      try {
        const { data: singleData, error: singleError } = await supabase
          .from('playlist_tracks')
          .insert(track)
          .select()
        
        if (singleError) {
          console.warn(`Error adding track ${track.music_id} to playlist:`, singleError)
          continue
        }
        
        if (singleData && singleData.length > 0) {
          addedTracks.push(singleData[0])
        }
      } catch (trackErr) {
        console.warn(`Error adding track to playlist:`, trackErr)
      }
    }
    
    console.log(`Successfully added ${addedTracks.length} tracks to playlist ${playlistId}`)
    return addedTracks
  } catch (err) {
    console.error('Error adding tracks to playlist:', err)
    return []
  }
}

// Main function to seed all data
export async function seedAllData() {
  try {
    console.log('Starting database seeding...')
    
    // Seed moods first
    const moods = await seedMoods()
    
    if (moods.length === 0) {
      console.warn('No moods were seeded, cannot proceed with tracks')
      return { success: false, message: 'Failed to seed moods' }
    }
    
    console.log(`Successfully seeded ${moods.length} moods, now seeding tracks...`)
    
    // Seed tracks for each mood
    const trackResults = []
    const allTracks = []
    
    for (const mood of moods) {
      try {
        if (!mood || !mood.id || !mood.name) {
          console.warn(`Skipping invalid mood:`, mood)
          continue
        }
        
        const tracks = await seedTracksForMood(mood.id, mood.name)
        trackResults.push({ mood: mood.name, count: tracks.length })
        allTracks.push(...tracks)
      } catch (moodErr) {
        console.error(`Error seeding tracks for mood ${mood?.name || 'unknown'}:`, moodErr)
      }
    }
    
    console.log('Database seeding completed successfully')
    return { 
      success: true, 
      moods: moods.length,
      tracks: trackResults,
      allTracks
    }
  } catch (err) {
    console.error('Error during database seeding:', err)
    return { success: false, error: err.message }
  }
}
