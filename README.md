# 🎵 Groovo Music Player

A feature-rich, fully functional music streaming web application built with vanilla JavaScript. Groovo offers a seamless music listening experience with custom playlist management, advanced search, and intuitive playback controls.

![Groovo Music Player](./public/assets/images/screenshot.png) <!-- Add a screenshot of your app -->

## 🌟 Features

### 🎧 Core Functionality
- **Complete Playback Controls** - Play, pause, next, previous with seamless transitions
- **Real-time Progress Tracking** - Interactive timeline with seek functionality
- **Volume Control** - Adjustable volume with mute/unmute toggle
- **Smart Navigation** - Context-aware next/previous (maintains playlist context)

### 📚 Playlist Management
- **Custom Playlists** - Create, name, and organize your own playlists
- **Add/Remove Songs** - Easy song management with instant UI updates
- **Persistent Storage** - LocalStorage integration keeps your playlists saved
- **Delete Playlists** - Remove entire playlists with confirmation
- **Empty State Handling** - Intuitive prompts when playlists are empty

### 🔍 Advanced Search
- **Dual-Mode Search** 
  - Normal mode: Search and play instantly
  - Playlist mode: Search and add songs to specific playlists
- **Multi-field Search** - Search by song title, artist name, or album
- **Random Recommendations** - Discover songs with random suggestions on focus
- **Visual Feedback** - Active state highlighting for currently playing songs

### 🎨 User Experience
- **Active State Management** - Visual indication of currently playing song
- **Responsive Design** - Works seamlessly across different screen sizes
- **Smooth Animations** - Polished UI transitions and interactions
- **Loading States** - User feedback during data fetching

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Storage**: Cloudflare R2 for audio files, LocalStorage for user data
- **Styling**: CSS3 with modern features
- **Icons**: Font Awesome
- **Hosting**: Vercel (deployment-ready)

## 📁 Project Structure
```
GROOVO_MUSIC/
├── public/
│   ├── assets/
│   │   ├── images/        # Album covers, UI images
│   │   └── songs/         # Audio files (not committed)
│   └── data/
│       ├── songs.json     # Song metadata
│       ├── playlist.json  # Built-in playlists
│       └── artists.json   # Artist information
├── src/
│   ├── main.js           # Core application logic
│   └── style.css         # Styling
├── index.html            # Main HTML file
├── robots.txt           # SEO configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for local development server)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/git-aftab/Groovo_music_player.git
   cd Groovo_music_player
```

2. **Set up audio files**
   - Add your audio files to `public/assets/songs/` or configure Cloudflare R2
   - Update `bucketUrl` in `main.js` with your storage URL

3. **Update metadata**
   - Edit `public/data/songs.json` with your song information
   - Follow the existing JSON structure

4. **Run locally**
```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Or simply open index.html in your browser
```

5. **Access the app**
```
   http://localhost:8000
```

## 📊 Data Structure

### Song Object
```json
{
  "id": 1,
  "count": 1,
  "playListId": 1,
  "title": "Song Title",
  "language": "English",
  "artistId": 1,
  "artistName": "Artist Name",
  "Album": "Album Name",
  "duration": "4:23",
  "songAddress": "songs/SongFile.mp3",
  "cover": "images/cover.jpg"
}
```

### Playlist Storage (LocalStorage)
```json
{
  "playlists": {
    "My Favorites": {
      "name": "My Favorites",
      "songs": [1, 5, 8],
      "createdAt": "2025-01-10T12:00:00.000Z"
    }
  }
}
```

## 🎯 Key Learnings

Building Groovo taught me:
- **State Management** - Managing complex application state in vanilla JS
- **Event-Driven Architecture** - Handling user interactions efficiently
- **Data Persistence** - LocalStorage implementation and JSON data management
- **Asynchronous Operations** - Handling audio loading and API calls
- **DOM Manipulation** - Dynamic UI updates and element creation
- **User Experience Design** - Creating intuitive interfaces and smooth interactions

## 🐛 Known Issues & Future Enhancements

### Known Issues
- Seek functionality may need refinement in some browsers
- Audio file paths must be correctly configured for deployment

### Planned Features
- [ ] AI-powered music recommendations
- [ ] Collaborative playlists
- [ ] Spotify/YouTube API integration
- [ ] Lyrics display
- [ ] Equalizer with audio visualizer
- [ ] Keyboard shortcuts
- [ ] Dark/Light theme toggle
- [ ] Export/Import playlists

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Aftab**

- GitHub: [@git-aftab](https://github.com/git-aftab)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile) <!-- Add your LinkedIn -->

## 🙏 Acknowledgments

- Font Awesome for icons
- Cloudflare for R2 storage
- All the open-source contributors whose tools made this possible

## 📸 Screenshots

<!-- Add screenshots here -->

### Main Interface
![Main Interface](./screenshots/main.png)

### Custom Playlists
![Playlists](./screenshots/playlists.png)

### Search Functionality
![Search](./screenshots/search.png)

---

**Note:** This is a portfolio/demo project. Audio files are not included in the repository. For testing, please add your own audio files or use copyright-free music.

⭐ If you found this project helpful, please consider giving it a star!

---

**Demo:** [Live Demo](https://your-deployment-url.vercel.app) <!-- Add your Vercel URL after deployment -->
```

---

## **Additional Files to Create:**

### **1. Create `.gitignore`:**
```
# Audio files
*.mp3
*.wav
*.m4a

# Environment
.env
.env.local

# Dependencies
node_modules/

# Build outputs
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
```

### **2. Create `LICENSE` (MIT License):**
```
MIT License

Copyright (c) 2025 Aftab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
