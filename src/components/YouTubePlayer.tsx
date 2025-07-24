"use client"

import React, { useState, useRef } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
}

export default function YouTubePlayer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Canciones románticas predefinidas para Camila
  const romanticSongs: Song[] = [
    {
      id: "1",
      title: "Perfect",
      artist: "Ed Sheeran",
      videoId: "2Vv-BfVoq4g",
      thumbnail: "https://img.youtube.com/vi/2Vv-BfVoq4g/mqdefault.jpg"
    },
    {
      id: "2", 
      title: "All of Me",
      artist: "John Legend",
      videoId: "450p7goxZqg",
      thumbnail: "https://img.youtube.com/vi/450p7goxZqg/mqdefault.jpg"
    },
    {
      id: "3",
      title: "Thinking Out Loud",
      artist: "Ed Sheeran", 
      videoId: "lp-EO5I60KA",
      thumbnail: "https://img.youtube.com/vi/lp-EO5I60KA/mqdefault.jpg"
    },
    {
      id: "4",
      title: "A Thousand Years",
      artist: "Christina Perri",
      videoId: "rtOvBOTyX00",
      thumbnail: "https://img.youtube.com/vi/rtOvBOTyX00/mqdefault.jpg"
    },
    {
      id: "5",
      title: "Make You Feel My Love",
      artist: "Adele",
      videoId: "0put0_a--Ng",
      thumbnail: "https://img.youtube.com/vi/0put0_a--Ng/mqdefault.jpg"
    },
    {
      id: "6",
      title: "At Last",
      artist: "Etta James",
      videoId: "S-cbOl96RFM",
      thumbnail: "https://img.youtube.com/vi/S-cbOl96RFM/mqdefault.jpg"
    },
    {
      id: "7",
      title: "Can't Help Myself",
      artist: "Four Tops",
      videoId: "s3bksUSPB4c",
      thumbnail: "https://img.youtube.com/vi/s3bksUSPB4c/mqdefault.jpg"
    },
    {
      id: "8",
      title: "La Vida Es Una Lenteja",
      artist: "Manu Chao",
      videoId: "rs6Y4kZ8qtw",
      thumbnail: "https://img.youtube.com/vi/rs6Y4kZ8qtw/mqdefault.jpg"
    }
  ];

  React.useEffect(() => {
    setSongs(romanticSongs);
  }, []);

  const searchYouTube = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Simulamos una búsqueda agregando la canción buscada a la lista
      const newSong: Song = {
        id: Date.now().toString(),
        title: searchQuery,
        artist: "Artista",
        videoId: "dQw4w9WgXcQ", // Rick Roll como placeholder
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
      };
      
      setSongs(prev => [newSong, ...prev]);
      setSearchQuery("");
    } catch {
      setError("Error al buscar la canción");
    } finally {
      setLoading(false);
    }
  };

  const playYouTubeAudio = (song: Song) => {
    // Detener audio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Crear iframe oculto para reproducir YouTube
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
    iframe.style.display = 'none';
    iframe.allow = 'autoplay';
    
    document.body.appendChild(iframe);
    
    setCurrentPlaying(song.id);

    // Remover iframe después de un tiempo
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      setCurrentPlaying(null);
    }, 30000); // 30 segundos
  };

  const stopPlaying = () => {
    // Remover todos los iframes de YouTube
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    iframes.forEach(iframe => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    });
    
    setCurrentPlaying(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
      <h2 className="text-3xl font-bold mb-6 text-center text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
         elige tu música, mi amor 
      </h2>

      {/* Buscador */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca una canción para Camila..."
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-pink-500/50"
          onKeyPress={(e) => e.key === 'Enter' && searchYouTube()}
        />
        <button
          onClick={searchYouTube}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
        >
          {loading ? "..." : "Buscar"}
        </button>
      </div>

      {/* Control de reproducción */}
      {currentPlaying && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
          <div className="flex items-center justify-between">
            <p className="text-pink-300 font-medium">🎶 Reproduciendo música para ti...</p>
            <button
              onClick={stopPlaying}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Detener
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Lista de canciones */}
      <div className="space-y-4">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className="group p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <img 
                src={song.thumbnail} 
                alt={song.title}
                className="w-16 h-12 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-pink-300 transition-colors">
                  {song.title}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {song.artist}
                </p>
              </div>
              
              <button
                onClick={() => playYouTubeAudio(song)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentPlaying === song.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
                    : "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 hover:from-pink-500/30 hover:to-purple-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                }`}
              >
                {currentPlaying === song.id ? "🎵 Sonando" : "▶️ Reproducir"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-white/60 text-sm">
        <p>te amo</p>
      </div>
    </div>
  );
}
