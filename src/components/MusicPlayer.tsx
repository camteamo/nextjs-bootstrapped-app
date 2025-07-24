"use client"

import React, { useState, useRef } from "react";

interface Song {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  addedAt: Date;
}

export default function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongUrl, setNewSongUrl] = useState("");
  const [newSongTitle, setNewSongTitle] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [error, setError] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Función para extraer el ID del video de YouTube
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Agregar nueva canción
  const addSong = () => {
    if (!newSongUrl.trim() || !newSongTitle.trim()) {
      setError("completa el link preciosota");
      return;
    }

    const videoId = extractVideoId(newSongUrl);
    if (!videoId) {
      setError("pon un link miamorrrrrrrrrrrrrr: https://www.youtube.com/watch?v=...");
      return;
    }

    const newSong: Song = {
      id: Date.now().toString(),
      title: newSongTitle,
      youtubeUrl: newSongUrl,
      videoId: videoId,
      addedAt: new Date()
    };

    setSongs(prev => [newSong, ...prev]);
    setNewSongUrl("");
    setNewSongTitle("");
    setError("");
  };

  // Reproducir canción
  const playSong = (song: Song) => {
    // Detener reproducción anterior
    stopPlaying();

    // Crear nuevo iframe para reproducir
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`;
    iframe.style.width = '100%';
    iframe.style.height = '315px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;

    const playerContainer = document.getElementById('youtube-player');
    if (playerContainer) {
      playerContainer.innerHTML = '';
      playerContainer.appendChild(iframe);
    }

    setCurrentPlaying(song.id);
    iframeRef.current = iframe;
  };

  // Detener reproducción
  const stopPlaying = () => {
    const playerContainer = document.getElementById('youtube-player');
    if (playerContainer) {
      playerContainer.innerHTML = '';
    }
    setCurrentPlaying(null);
    iframeRef.current = null;
  };

  // Eliminar canción
  const removeSong = (songId: string) => {
    setSongs(prev => prev.filter(song => song.id !== songId));
    if (currentPlaying === songId) {
      stopPlaying();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
      <h2 className="text-3xl font-bold mb-6 text-center text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        nuestra música en 1 año y 7 meses jejeje
      </h2>

      {/* Formulario para agregar canciones */}
      <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Agregar nueva canción</h3>
        
        <div className="space-y-4">
          <input
            type="text"
            value={newSongTitle}
            onChange={(e) => setNewSongTitle(e.target.value)}
            placeholder="título de la canción que te guste..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-pink-500/50"
          />
          
          <input
            type="text"
            value={newSongUrl}
            onChange={(e) => setNewSongUrl(e.target.value)}
            placeholder="link de youtube (ej: https://www.youtube.com/watch?v=...)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-pink-500/50"
          />
          
          <button
            onClick={addSong}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all font-medium"
          >
            ➕ agregar canción
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Reproductor de YouTube */}
      {currentPlaying && (
        <div className="mb-8 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
          <div className="flex items-center justify-between mb-4">
            <p className="text-pink-300 font-medium">acá se reproduce</p>
            <button
              onClick={stopPlaying}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              detener
            </button>
          </div>
          <div id="youtube-player" className="w-full"></div>
        </div>
      )}

      {/* Lista de canciones */}
      {songs.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">playlist</h3>
          {songs.map((song) => (
            <div 
              key={song.id} 
              className="group p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg group-hover:text-pink-300 transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-white/60 text-sm mt-1">
                    agregada el {song.addedAt.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => playSong(song)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentPlaying === song.id
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
                        : "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 hover:from-pink-500/30 hover:to-purple-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                    }`}
                  >
                    {currentPlaying === song.id ? "🎵 sonando" : "▶️ reproducir"}
                  </button>
                  
                  <button
                    onClick={() => removeSong(song.id)}
                    className="px-4 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-white/60 text-lg">
            aún no has agregado canciones
          </p>
          <p className="text-white/40 text-sm mt-2">
            agrega tus canciones favoritas usando los links de YouTube
          </p>
        </div>
      )}

      <div className="mt-8 text-center text-white/60 text-sm">
        <p>♡ cada canción que represente nuestro tiempo juntos colocala ♡</p>
      </div>
    </div>
  );
}
