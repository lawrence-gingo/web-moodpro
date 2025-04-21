<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const moods = [
  'Happy',
  'Sad',
  'Energetic',
  'Calm',
  'Romantic',
  'Angry',
  'Relaxed',
  'Fearful',
  'Excited',
]

const selectedMood = ref('Calm')
const playlist = ref([])

function recommendTracks(mood) {
  const baseTracks = {
    Happy: [
      { title: 'Sunshine Vibes', album: 'Joyful Beats', artist: 'Joy Beats', genre: 'Pop' },
      { title: 'Cheer Up!', album: 'Smiley Sounds', artist: 'Smiley Sounds', genre: 'Pop' },
      { title: 'Bubble Pop', album: 'Fun Factory', artist: 'Fun Factory', genre: 'Pop' },
      { title: 'Bright Morning', album: 'Daylight Tunes', artist: 'Morning Vibes', genre: 'Pop' },
      { title: 'Happiness Overload', album: 'Feel Good', artist: 'Jolly Crew', genre: 'Pop' },
      { title: 'Joyful Journey', album: 'Sunshine Days', artist: 'Vibe Squad', genre: 'Pop' },
      { title: 'Up and Away', album: 'Good Vibes', artist: 'Energetic Waves', genre: 'Pop' },
      { title: 'Waves of Joy', album: 'Happy Beats', artist: 'Rhythm Star', genre: 'Pop' },
      {
        title: 'Bright Side',
        album: 'Optimistic Rhythms',
        artist: 'Sunshine Groove',
        genre: 'Pop',
      },
        { title: 'Smiles', album: 'Positive Energy', artist: 'Vibe Masters', genre: 'Pop' },
        {
          title: 'Dancing Hearts',
          album: 'Cheerful Vibes',
          artist: 'Upbeat Collective',
          genre: 'Pop',
        },
        { title: 'Good Times Ahead', album: 'Feel Good Tunes', artist: 'Vibe Crew', genre: 'Pop' },
        { title: 'Shiny Days', album: 'Blissful Soundscapes', artist: 'Melody Makers', genre: 'Pop' },
        { title: 'Pure Bliss', album: 'Joyful Waves', artist: 'Lively Sound', genre: 'Pop' },
        { title: 'Happiness Boost', album: 'Happy Vibes', artist: 'The Happy Crew', genre: 'Pop' },
        { title: 'Feel the Beat', album: 'Positive Pulse', artist: 'Beats Collective', genre: 'Pop' },
        { title: 'Euphoria', album: 'Sunshine Days', artist: 'Euphoria Beats', genre: 'Pop' },
        { title: 'High Spirits', album: 'Daydream Vibes', artist: 'Blissful Vibes', genre: 'Pop' },
        { title: 'Joyride', album: 'Vibe Tracks', artist: 'Rhythm Band', genre: 'Pop' },
        { title: 'Happy Feet', album: 'Feel Good Mix', artist: 'Groove Masters', genre: 'Pop' },
      ],
      Sad: [
        { title: 'Blue Hour', album: 'Lonely Nights', artist: 'Tearful Tunes', genre: 'Ballad' },
        { title: 'Midnight Rain', album: 'Dark Hours', artist: 'The Echo', genre: 'Alternative' },
        { title: 'Quiet Room', album: 'Melancholy', artist: 'Solitary Notes', genre: 'Ambient' },
        { title: 'Fading Light', album: 'Lonely Heart', artist: 'Sad Souls', genre: 'Ballad' },
        {
          title: 'Tears in the Rain',
          album: 'Solitude Sound',
          artist: 'Soul Echo',
          genre: 'Alternative',
        },
        {
          title: 'Cold Night',
          album: 'Heartbreak Symphony',
          artist: 'Lonely Rhythms',
          genre: 'Ambient',
        },
        {
          title: 'Lost in Thought',
          album: 'Quiet Moments',
          artist: 'Mindful Melodies',
          genre: 'Indie',
        },
        { title: 'Broken Pieces', album: 'Heartache', artist: 'Soul Cry', genre: 'Ballad' },
        { title: 'Hollow Heart', album: 'Emotional Storm', artist: 'Sad Souls', genre: 'Ambient' },
        { title: 'Lonely Star', album: 'Night Waves', artist: 'Dream Echoes', genre: 'Indie' },
        {
          title: 'Fading Dreams',
          album: 'Dark Clouds',
          artist: 'Melancholy Band',
          genre: 'Alternative',
        },
        { title: 'Lost Love', album: 'Heartbroken', artist: 'Lonely Songs', genre: 'Ballad' },
        { title: 'Into the Abyss', album: 'Sad Eyes', artist: 'The Forgotten', genre: 'Indie' },
        {
          title: 'Echoes of Silence',
          album: 'Sad Symphony',
          artist: 'Noisy Heart',
          genre: 'Ambient',
        },
        {
          title: 'Solitary Night',
          album: 'Silent Roads',
          artist: 'Echoes of Silence',
          genre: 'Alternative',
        },
        { title: 'Gone', album: 'Tears Fall', artist: 'Fading Souls', genre: 'Indie' },
        { title: 'Shattered', album: 'Heartbreak Journey', artist: 'Sad Rhythms', genre: 'Ballad' },
        { title: 'Empty Spaces', album: 'Lost Moments', artist: 'Eternal Sorrow', genre: 'Indie' },
        {
          title: 'Sad Winds',
          album: 'Wandering Souls',
          artist: 'Alone Sounds',
          genre: 'Alternative',
        },
        { title: 'Heartache', album: 'Tears', artist: 'Lonely Spirit', genre: 'Ballad' },
      ],
      Energetic: [
        {
          title: 'Power Surge',
          album: 'Electric Energy',
          artist: 'Electro Drive',
          genre: 'Electronic',
        },
        { title: 'Go Go Go!', album: 'Upbeat Pulse', artist: 'Upbeat Unit', genre: 'Pop' },
        { title: 'Rush Hour', album: 'High Energy', artist: 'Vibe Masters', genre: 'Electronic' },
        { title: 'Jump Higher', album: 'Adrenaline Rush', artist: 'Energy Pulse', genre: 'Pop' },
        { title: 'Energy Flow', album: 'Charged', artist: 'Vibe Squad', genre: 'Electronic' },
        { title: 'Faster', album: 'Speed Surge', artist: 'Beat Factory', genre: 'Pop' },
        { title: 'Power Up', album: 'Hyperdrive', artist: 'Energy Spark', genre: 'Electronic' },
        { title: 'Amped Up', album: 'Electric Vibes', artist: 'Electric Pulse', genre: 'Pop' },
        { title: 'Speed Rush', album: 'Fast Beats', artist: 'Electro Surge', genre: 'Electronic' },
        { title: 'Excited Vibes', album: 'Beat Blaze', artist: 'Jump Beat', genre: 'Pop' },
        { title: 'On Fire', album: 'Inferno', artist: 'Beat Blaze', genre: 'Pop' },
        { title: 'Turbo Drive', album: 'Full Throttle', artist: 'Speed Mode', genre: 'Electronic' },
        { title: 'Quick Dash', album: 'Fast Tracks', artist: 'Rapid Beats', genre: 'Pop' },
        {
          title: 'Boost Mode',
          album: 'Adrenaline Beats',
          artist: 'Electric Vibes',
          genre: 'Electronic',
        },
        { title: 'Run Wild', album: 'Hyper Energy', artist: 'Wild Charge', genre: 'Pop' },
        { title: 'Firestarter', album: 'Blaze', artist: 'Flame Crew', genre: 'Electronic' },
        { title: 'The Chase', album: 'Speed Rush', artist: 'Fast Beat', genre: 'Pop' },
        {
          title: 'Adrenaline Rush',
          album: 'Electric Power',
          artist: 'Dynamic Pulse',
          genre: 'Electronic',
        },
        { title: 'Quick Feet', album: 'Speed Surge', artist: 'Vibe Rush', genre: 'Pop' },
        { title: 'Vibration', album: 'Vibe Mode', artist: 'Electric Beat', genre: 'Pop' },
      ],
      Calm: [
        {
          title: 'Tranquility',
          album: 'Peaceful Sounds',
          artist: 'Serenity Sounds',
          genre: 'Ambient',
        },
        {
          title: 'Lost in Thought',
          album: 'Mindful Melodies',
          artist: 'Mindful Melodies',
          genre: 'Ambient',
        },
        {
          title: 'Peaceful Dreams',
          album: 'Relaxation',
          artist: 'Harmony Collective',
          genre: 'Ambient',
        },
        { title: 'Calm Waters', album: 'Stillness', artist: 'Silent Waves', genre: 'Ambient' },
        { title: 'Evening Breeze', album: 'Gentle Winds', artist: 'Soft Winds', genre: 'Ambient' },
        { title: 'Quiet Thoughts', album: 'Meditation', artist: 'Calming Sounds', genre: 'Ambient' },
        {
          title: 'Relaxing Journey',
          album: 'Peace and Quiet',
          artist: 'Tranquil Vibes',
          genre: 'Ambient',
        },
        { title: 'Serenity', album: 'Zen', artist: 'Inner Peace', genre: 'Ambient' },
        { title: 'Soft Echo', album: 'Stillness in the Air', artist: 'Echo Sound', genre: 'Ambient' },
        {
          title: 'Deep Calm',
          album: 'Tranquil Dreams',
          artist: 'Harmony Collective',
          genre: 'Ambient',
        },
        { title: 'Gentle Waves', album: 'Ocean Breeze', artist: 'Sea Sound', genre: 'Ambient' },
        { title: 'Silence', album: 'Calming Moments', artist: 'Quiet Beats', genre: 'Ambient' },
        {
          title: 'Serene Morning',
          album: 'Peaceful Start',
          artist: 'Soft Morning',
          genre: 'Ambient',
        },
        { title: 'Still Waters', album: 'Calm Reflections', artist: 'Calm Sounds', genre: 'Ambient' },
        {
          title: 'Quiet Nights',
          album: 'Silent Reflections',
          artist: 'Silent Echo',
          genre: 'Ambient',
        },
        { title: 'Dreamy Skies', album: 'Evening Dreams', artist: 'Sky Melodies', genre: 'Ambient' },
        { title: 'Tranquil Path', album: 'Peaceful Journey', artist: 'Zen Spirit', genre: 'Ambient' },
        { title: 'Quiet Mind', album: 'Silent Peace', artist: 'Tranquil Soul', genre: 'Ambient' },
        { title: 'Flow', album: 'Gentle Tides', artist: 'Soundwaves', genre: 'Ambient' },
        {
          title: 'Soft Reflections',
          album: 'Quiet Moments',
          artist: 'Reflection Sound',
          genre: 'Ambient',
        },
      ],
      Romantic: [
        { title: 'Candlelight', album: 'Love Notes', artist: 'Love Notes', genre: 'R&B' },
        { title: 'Soft Touch', album: 'Velvet Harmony', artist: 'Velvet Harmony', genre: 'R&B' },
        { title: 'Endless Love', album: 'Romantic Bliss', artist: 'The Lovers', genre: 'Pop' },
        { title: 'Kiss Me', album: 'Sweet Moments', artist: 'Romantic Beats', genre: 'Pop' },
        { title: 'Yours', album: 'Love Songs', artist: 'Heartstrings', genre: 'R&B' },
        { title: 'Love You Like That', album: 'Romantic Rhythms', artist: 'R&B Vibes', genre: 'R&B' },
        { title: 'Just the Way You Are', album: 'True Love', artist: 'Romantic Soul', genre: 'Pop' },
        { title: 'Perfect', album: 'Love Tracks', artist: 'Ed Sheeran', genre: 'Pop' },
        { title: 'I’m Yours', album: 'Melodies of Love', artist: 'Jason Mraz', genre: 'Pop' },
        {
          title: 'Say You Won’t Let Go',
          album: 'Heartfelt Tunes',
          artist: 'James Arthur',
          genre: 'Pop',
        },
        { title: 'All of Me', album: 'Love Chronicles', artist: 'John Legend', genre: 'R&B' },
        {
          title: 'Can’t Help Falling in Love',
          album: 'Love Classics',
          artist: 'Elvis Presley',
          genre: 'Pop',
        },
        { title: 'Fallin’', album: 'R&B Legends', artist: 'Alicia Keys', genre: 'R&B' },
        { title: 'I Found You', album: 'The One', artist: 'Alesso & Nico & Vinz', genre: 'Pop' },
        { title: 'Call Out My Name', album: 'Love in the Air', artist: 'The Weeknd', genre: 'R&B' },
        { title: 'Lover', album: 'Romantic Vibes', artist: 'Taylor Swift', genre: 'Pop' },
        { title: 'Adore You', album: 'Heartfelt Moments', artist: 'Harry Styles', genre: 'Pop' },
        {
          title: 'Lucky',
          album: 'Romantic Beats',
          artist: 'Jason Mraz & Colbie Caillat',
          genre: 'Pop',
        },
        { title: 'The One', album: 'Deep Love', artist: 'The Chainsmokers', genre: 'Pop' },
        { title: 'Back to You', album: 'Love Stories', artist: 'Selena Gomez', genre: 'Pop' },
      ],
      Angry: [
        { title: 'Thunder', album: 'Rage Mode', artist: 'Rage Mode', genre: 'Rock' },
        { title: 'Break Out', album: 'Loud Machine', artist: 'Loud Machine', genre: 'Rock' },
        { title: 'Pain', album: 'Anger Management', artist: 'Three Days Grace', genre: 'Rock' },
        { title: 'Disturbia', album: 'Nightmare', artist: 'Rihanna', genre: 'Pop' },
        { title: 'Bury a Friend', album: 'Dark Side', artist: 'Billie Eilish', genre: 'Alternative' },
        { title: 'Smells Like Teen Spirit', album: 'Nevermind', artist: 'Nirvana', genre: 'Grunge' },
        { title: 'Bleed It Out', album: 'Minutes to Midnight', artist: 'Linkin Park', genre: 'Rock' },
        {
          title: 'I Will Not Bow',
          album: 'The Sound of Madness',
          artist: 'Breaking Benjamin',
          genre: 'Rock',
        },
        {
          title: 'Killing in the Name',
          album: 'Rage Against the Machine',
          artist: 'Rage Against the Machine',
          genre: 'Metal',
        },
        { title: 'Numb', album: 'Meteora', artist: 'Linkin Park', genre: 'Rock' },
        { title: 'Rollin’', album: 'Chocolate Starfish', artist: 'Limp Bizkit', genre: 'Nu Metal' },
        { title: 'Faint', album: 'Reanimation', artist: 'Linkin Park', genre: 'Rock' },
        { title: 'Given Up', album: 'Minutes to Midnight', artist: 'Linkin Park', genre: 'Rock' },
        { title: 'Fight Song', album: 'Fighting Spirit', artist: 'Rachel Platten', genre: 'Pop' },
        { title: 'My Curse', album: 'The Open Door', artist: 'Evanescence', genre: 'Rock' },
        { title: 'Warriors', album: 'Smoke + Mirrors', artist: 'Imagine Dragons', genre: 'Pop Rock' },
        { title: 'No Tears Left to Cry', album: 'Sweetener', artist: 'Ariana Grande', genre: 'Pop' },
        {
          title: 'Let the Bodies Hit the Floor',
          album: 'Suffocate',
          artist: 'Drowning Pool',
          genre: 'Metal',
        },
        { title: 'Break the Chain', album: 'Pain Reliever', artist: 'Starset', genre: 'Rock' },
      ],
      Relaxed: [
        { title: 'Chill Flow', album: 'Coastal Vibes', artist: 'Coastal Vibes', genre: 'Chillout' },
        { title: 'Easy Breeze', album: 'Zen Sounds', artist: 'Zen Sounds', genre: 'Chillout' },
        { title: 'Weightless', album: 'Peaceful Journey', artist: 'Allan Walker', genre: 'Chillout' },
        {
          title: 'Sunset Lover',
          album: 'Chilled Beats',
          artist: 'Petit Biscuit',
          genre: 'Electronic',
        },
        { title: 'Night Owl', album: 'Late Night', artist: 'Galimatias', genre: 'Chillout' },
        { title: 'Ocean Eyes', album: 'Chill Moments', artist: 'Billie Eilish', genre: 'Pop' },
        {
          title: 'Lovely',
          album: 'Peaceful Rhythms',
          artist: 'Billie Eilish & Khalid',
          genre: 'Pop',
        },
        {
          title: 'Warmth of the Sun',
          album: 'Relaxation',
          artist: 'Beach Collective',
          genre: 'Chillout',
        },
        { title: 'Sunflower', album: 'Dreamy Vibes', artist: 'Post Malone & Swae Lee', genre: 'Pop' },
        { title: 'Tides', album: 'Calm Waves', artist: 'Blackmill', genre: 'Chillout' },
        { title: 'Lost in the Moment', album: 'Serenity', artist: 'Alina Baraz', genre: 'Chillout' },
        {
          title: 'Soothing Sounds',
          album: 'Peaceful Journey',
          artist: 'Chill Tribe',
          genre: 'Chillout',
        },
        { title: 'Electric Feel', album: 'Indie Chill', artist: 'MGMT', genre: 'Indie' },
        { title: 'Afterglow', album: 'Nightfall', artist: 'Ed Sheeran', genre: 'Pop' },
        { title: 'Breathe Me', album: 'Quiet Nights', artist: 'Sia', genre: 'Pop' },
        {
          title: 'Falling In Love',
          album: 'Love Melodies',
          artist: 'Lana Del Rey',
          genre: 'Indie Pop',
        },
        {
          title: 'The Less I Know the Better',
          album: 'Chill Vibes',
          artist: 'Tame Impala',
          genre: 'Indie',
        },
        { title: 'Better Together', album: 'Calm Vibes', artist: 'Jack Johnson', genre: 'Folk' },
        {
          title: 'Can’t Help Falling in Love',
          album: 'Timeless',
          artist: 'Kina Grannis',
          genre: 'Pop',
        },
      ],
      Fearful: [
        { title: 'Dark Corners', album: 'Shadow Beats', artist: 'Shadow Beats', genre: 'Ambient' },
        { title: 'Unknown', album: 'Whisper Vox', artist: 'Whisper Vox', genre: 'Electronic' },
        { title: 'In the Shadows', album: 'Mystery Sound', artist: 'The Rasmus', genre: 'Rock' },
        {
          title: 'The Haunting',
          album: 'Ghostly Sounds',
          artist: 'Subliminal Fear',
          genre: 'Dark Wave',
        },
        { title: 'Terror', album: 'Fear Unleashed', artist: 'Dread Waves', genre: 'Industrial' },
        {
          title: 'Sleep Paralysis',
          album: 'Sleep Sounds',
          artist: 'The Soundscapes',
          genre: 'Ambient',
        },
        { title: 'Panic Attack', album: 'Anxiety', artist: 'Neurotica', genre: 'Industrial' },
        {
          title: 'Distorted Reality',
          album: 'Echoes of Fear',
          artist: 'The Unseen',
          genre: 'Electronic',
        },
        {
          title: 'The Fear Within',
          album: 'Inner Struggles',
          artist: 'The Silent Ones',
          genre: 'Ambient',
        },
        {
          title: 'Frightening Shadows',
          album: 'Dark Times',
          artist: 'Ghost Signal',
          genre: 'Ambient',
        },
        { title: 'Creeping Fear', album: 'Silent Storm', artist: 'Echo Vibes', genre: 'Alternative' },
        { title: 'Nightmare', album: 'Dark Sounds', artist: 'A Perfect Circle', genre: 'Rock' },
        {
          title: 'Whispers in the Dark',
          album: 'Mysterious Nights',
          artist: 'Electric Souls',
          genre: 'Rock',
        },
        { title: 'Dread', album: 'Emotional Waves', artist: 'The Fears', genre: 'Industrial' },
        { title: 'Tremor', album: 'Creepy Chronicles', artist: 'Waves of Fear', genre: 'Dark Wave' },
        { title: 'Out of Sight', album: 'Unseen World', artist: 'Unknown Voices', genre: 'Ambient' },
        {
          title: 'I Can’t Breathe',
          album: 'Fear Within',
          artist: 'Suffocating Shadows',
          genre: 'Alternative',
        },
        { title: 'Blood Red', album: 'Nightmare Days', artist: 'Horror Stories', genre: 'Rock' },
        { title: 'Underground', album: 'The Hollow', artist: 'The Fear', genre: 'Industrial' },
      ],
      Excited: [
        {
          title: 'Jump Around',
          album: 'Electric Pulse',
          artist: 'Electric Pulse',
          genre: 'Electronic',
        },
        { title: 'On Fire', album: 'Beat Blaze', artist: 'Beat Blaze', genre: 'Pop' },
        { title: 'Lose Control', album: 'Get Energized', artist: 'Missy Elliott', genre: 'Hip-Hop' },
        { title: 'Run the World', album: 'Girl Power', artist: 'Beyoncé', genre: 'Pop' },
        {
          title: 'Uptown Funk',
          album: 'Funk Nation',
          artist: 'Mark Ronson ft. Bruno Mars',
          genre: 'Funk',
        },
        {
          title: 'Can’t Stop the Feeling!',
          album: 'Summer Vibes',
          artist: 'Justin Timberlake',
          genre: 'Pop',
        },
        { title: 'Party Rock Anthem', album: 'Shufflin’', artist: 'LMFAO', genre: 'Dance' },
        {
          title: 'Titanium',
          album: 'Electro Pulse',
          artist: 'David Guetta ft. Sia',
          genre: 'Electronic',
        },
        { title: 'Stronger', album: 'Stronger', artist: 'Kanye West', genre: 'Hip-Hop' },
        { title: 'Level Up', album: 'Party Mix', artist: 'Ciara', genre: 'Hip-Hop' },
        {
          title: 'Take Over Control',
          album: 'Dance Pulse',
          artist: 'Afrojack ft. Eva Simons',
          genre: 'Electronic',
        },
        {
          title: 'Feeling Myself',
          album: 'Club Anthems',
          artist: 'Nicki Minaj ft. Beyoncé',
          genre: 'Hip-Hop',
        },
        {
          title: 'Bang Bang',
          album: 'Pop Hits',
          artist: 'Jessie J, Ariana Grande, Nicki Minaj',
          genre: 'Pop',
        },
        {
          title: 'Savage Love',
          album: 'Pop Vibes',
          artist: 'Jawsh 685 & Jason Derulo',
          genre: 'Pop',
        },
        { title: 'Don’t Start Now', album: 'Disco Fever', artist: 'Dua Lipa', genre: 'Pop' },
        {
          title: 'I Gotta Feeling',
          album: 'Party Anthem',
          artist: 'The Black Eyed Peas',
          genre: 'Pop',
      },
    ],
  }

  const tracks = baseTracks[mood] || []
  return tracks.sort(() => 0.5 - Math.random()).slice(0, 3)
}

function selectMood(mood) {
  selectedMood.value = mood
  playlist.value = recommendTracks(mood)
}

// Initial recommendation
playlist.value = recommendTracks(selectedMood.value)
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="container">
        <!-- Mood Selector Column -->
        <div class="left">
          <v-row>


            <h1 class="title">MoodBased</h1>
          </v-row>

          <p class="subtitle mt-5">How are you feeling?</p>
          <div class="mood-grid">
            <button
              v-for="mood in moods"
              :key="mood"
              @click="selectMood(mood)"
              :class="['mood-button', { active: selectedMood === mood }]"
            >
              {{ mood }}
            </button>
          </div>
          <button class="find-button" @click="selectMood(selectedMood)">Find Music</button>
        </div>

        <!-- Playlist Column -->
        <div class="right">
          <h2>Recommended Tracks for "{{ selectedMood }}"</h2>
          <ul class="playlist">
            <li v-for="track in playlist" :key="track.title" class="track">
              <div class="track-info mx-5">
                <div class="track-title">Title: {{ track.title }}</div>
                <div class="track-album">Album: {{ track.album }}</div>
                <div class="track-artist">Artist: {{ track.artist }}</div>
                <div class="track-genre">Genre: {{ track.genre }}</div>
              </div>
              <div class="track-time">{{ track.time }}</div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.container {
  display: flex;
  gap: 40px;
  padding: 40px;
  flex-direction: row;
  font-family: 'Segoe UI', sans-serif;
}

.left,
.right {
  flex: 1;
}

h1 {
  font-size: 32px;
  margin-bottom: 12px;
  color: #333;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 25px;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mood-button {
  padding: 14px 12px;
  border: 2px solid #ccc;
  background-color: #f8f8f8;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mood-button:hover {
  background: linear-gradient(90deg, #c491c4, #d828de);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.mood-button.active {
  background: linear-gradient(90deg, #b265c1, #9c03cf);
  color: white;
  border-color: #ed63ff;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.find-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #b265c1, #9c03cf);
  color: white;
  font-weight: bold;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.find-button:hover {
  background: linear-gradient(90deg, #c491c4, #d828de);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.find-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.right h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #444;
}

.playlist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.track {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.track:hover {
  transform: scale(1.03);
  background: linear-gradient(90deg, #ffbdfe, #aa02b0);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.track-info {
  flex-grow: 1;
}

.track-title {
  font-weight: 600;
  font-size: 16px;
  color: #222;
}

.track-album,
.track-artist,
.track-genre {
  font-size: 14px;
  color: #777;
}

.track-time {
  font-size: 14px;
  color: #444;
  font-weight: 500;
}

.title {
  font-size: 50px;
  margin-bottom: 12px;
  color: #a601a1;
}
</style>
