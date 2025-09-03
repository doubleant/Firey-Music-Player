  // Sample playlist - Replace with your S3 URLs
        const playlist = [
            {
                title: "All Night Long",
                artist: "BandinoWorld",
                album: "Old Hits",
                year: "2024",
                url: "https://tonyjonesbucket1.s3.us-east-2.amazonaws.com/9th+wonder+all_nighttime_Master.wav",
                albumArt: "https://via.placeholder.com/250x250/ff0000/ffffff?text=Inferno+Rising",
                duration: "0:20"
            }
        ];

        let currentTrackIndex = 0;
        let isPlaying = false;
        let isShuffled = false;
        let isRepeating = false;

        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');
        const progressBar = document.getElementById('progressBar');
        const progress = document.getElementById('progress');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeFill = document.getElementById('volumeFill');
        const volumePercent = document.getElementById('volumePercent');
        const albumArt = document.getElementById('albumArt');

        // Initialize particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Load track
        function loadTrack(index) {
            const track = playlist[index];
            audioPlayer.src = track.url;
            
            document.getElementById('trackTitle').textContent = track.title;
            document.getElementById('trackArtist').textContent = track.artist;
            document.getElementById('trackAlbum').textContent = track.album;
            document.getElementById('trackYear').textContent = track.year;
            albumArt.src = track.albumArt;
            
            updatePlaylist();
        }

        // Update playlist display
        function updatePlaylist() {
            const playlistEl = document.getElementById('playlist');
            playlistEl.innerHTML = '';
            
            playlist.forEach((track, index) => {
                const item = document.createElement('div');
                item.className = 'playlist-item';
                if (index === currentTrackIndex) {
                    item.classList.add('active');
                }
                
                item.innerHTML = `
                    <div>
                        <div style="font-weight: bold;">${track.title}</div>
                        <div style="font-size: 12px; color: #999;">${track.artist}</div>
                    </div>
                    <div class="playlist-duration">${track.duration}</div>
                `;
                
                item.addEventListener('click', () => {
                    currentTrackIndex = index;
                    loadTrack(currentTrackIndex);
                    if (isPlaying) {
                        audioPlayer.play();
                    }
                });
                
                playlistEl.appendChild(item);
            });
        }

        // Play/Pause
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                audioPlayer.pause();
                playPauseBtn.innerHTML = '▶';
                albumArt.classList.remove('playing');
            } else {
                audioPlayer.play();
                playPauseBtn.innerHTML = '⏸';
                albumArt.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });

        // Stop
        stopBtn.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.innerHTML = '▶';
            albumArt.classList.remove('playing');
            isPlaying = false;
            progress.style.width = '0%';
        });

        // Previous
        prevBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                audioPlayer.play();
            }
        });

        // Next
        nextBtn.addEventListener('click', () => {
            if (isShuffled) {
                currentTrackIndex = Math.floor(Math.random() * playlist.length);
            } else {
                currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            }
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                audioPlayer.play();
            }
        });

        // Shuffle
        shuffleBtn.addEventListener('click', () => {
            isShuffled = !isShuffled;
            shuffleBtn.classList.toggle('active');
        });

        // Repeat
        repeatBtn.addEventListener('click', () => {
            isRepeating = !isRepeating;
            repeatBtn.classList.toggle('active');
            audioPlayer.loop = isRepeating;
        });

        // Progress bar
        audioPlayer.addEventListener('timeupdate', () => {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = progressPercent + '%';
            
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            durationEl.textContent = formatTime(audioPlayer.duration);
        });

        // Click on progress bar
        progressBar.addEventListener('click', (e) => {
            const clickX = e.offsetX;
            const width = progressBar.offsetWidth;
            const newTime = (clickX / width) * audioPlayer.duration;
            audioPlayer.currentTime = newTime;
        });

        // Volume control
        volumeSlider.addEventListener('click', (e) => {
            const clickX = e.offsetX;
            const width = volumeSlider.offsetWidth;
            const newVolume = clickX / width;
            audioPlayer.volume = newVolume;
            volumeFill.style.width = (newVolume * 100) + '%';
            volumePercent.textContent = Math.round(newVolume * 100) + '%';
        });

        // Auto play next track
        audioPlayer.addEventListener('ended', () => {
            if (!isRepeating) {
                nextBtn.click();
            }
        });

        // Format time
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Initialize
        createParticles();
        loadTrack(0);
        audioPlayer.volume = 0.7;
