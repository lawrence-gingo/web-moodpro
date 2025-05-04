// src/services/musicService.js
import { supabase } from '../components/utils/supabase'

export const musicService = {
  /**
   * Initialize the music database with seed data
   */
  async initializeDatabase(tracksData) {
    try {
      // Check if the database already contains tracks
      const { count, error: countError } = await supabase
        .from('tracks')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Error checking existing tracks:', countError)
        throw countError
      }

      if (count > 0) {
        console.log('Database already contains tracks, skipping initialization')
        return
      }

      // Prepare tracks for insertion
      const tracksToInsert = Object.entries(tracksData).flatMap(([mood, tracks]) =>
        tracks.map((track) => ({ ...track, mood })),
      )

      console.log('Tracks to insert:', tracksToInsert)

      // Insert tracks into the database
      const { error } = await supabase.from('tracks').insert(tracksToInsert)

      if (error) {
        console.error('Error inserting tracks:', error)
        throw error
      }

      console.log(`Successfully initialized database with ${tracksToInsert.length} tracks`)
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  },

  /**
   * Get tracks by mood
   */
  async getTracksByMood(mood) {
    try {
      const { data, error } = await supabase.from('tracks').select('*').eq('mood', mood)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error(`Error fetching tracks for mood ${mood}:`, error)
      throw error
    }
  },

  /**
   * Get all tracks
   * @returns {Promise<Array>} - Array of all track objects
   */
  async getAllTracks() {
    try {
      const { data, error } = await supabase.from('tracks').select('*')

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching all tracks:', error)
      throw error
    }
  },

  /**
   * Get all available moods
   */
  async getAllMoods() {
    try {
      const { data, error } = await supabase.from('tracks').select('mood').order('mood')

      if (error) {
        throw error
      }

      return [...new Set(data.map((item) => item.mood))]
    } catch (error) {
      console.error('Error fetching moods:', error)
      throw error
    }
  },

  /**
   * Add a new track
   * @param {Object} track - Track object with title, album, artist, genre, and mood
   * @returns {Promise<Object>} - The newly created track
   */
  async addTrack(track) {
    try {
      const { data, error } = await supabase.from('tracks').insert([track]).select()

      if (error) {
        throw error
      }

      return data[0]
    } catch (error) {
      console.error('Error adding track:', error)
      throw error
    }
  },

  /**
   * Update an existing track
   * @param {string} id - The track ID to update
   * @param {Object} updates - Object containing the fields to update
   * @returns {Promise<Object>} - The updated track
   */
  async updateTrack(id, updates) {
    try {
      const { data, error } = await supabase.from('tracks').update(updates).eq('id', id).select()

      if (error) {
        throw error
      }

      return data[0]
    } catch (error) {
      console.error('Error updating track:', error)
      throw error
    }
  },

  /**
   * Delete a track
   * @param {string} id - The track ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteTrack(id) {
    try {
      const { error } = await supabase.from('tracks').delete().eq('id', id)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting track:', error)
      throw error
    }
  },
}
