# MoodPro - Mood-Based Music Recommendation App

A web application that recommends music tracks based on the user's mood using Supabase as the backend.

## Features

- User authentication (login/register) using Supabase Auth
- Mood-based music recommendations
- Like/save favorite tracks
- User profiles and playlists
- Responsive UI with Vuetify

## Database Structure

The application uses Supabase with the following tables:
- **music**: Stores music tracks with title, artist, album, genre, and mood_id
- **moods**: Stores available mood options with name and description
- **users**: Managed by Supabase Auth
- **liked_tracks**: Tracks liked by users
- **playlists**: User-created playlists

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- Supabase account with project set up

### Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
