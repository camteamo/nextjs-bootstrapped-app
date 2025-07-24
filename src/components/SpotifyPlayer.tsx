"use client"

import React, { useEffect, useState } from "react";

interface Artist {
  name: string;
}

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  preview_url: string | null;
}

export default function SpotifyPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const token = "BQApjRcLUQwMdQTkNpVOBvMdonvZjQN5zAaYfC5nN4IeTFbNZ0OB8o_pMdWXV9bn61U9yNqacp6xvajbpQ1TpZVON-SD0-MaJ-Y8bne_Dd9D5K3A9q_af_57Kl5UKi05JrZSUh6tySA9pOwG_6GukRNjden8TWshLenxpr3-lbnvRrQCI_NwpxZap6Y9etLVclG3JL1WAr899ANNl0S74gnVbhc7stDm-rwfsh70ebRgFWdmbkuCcSVv__f0PJYIwg5h3tf-To5yDNUHhEuOqsnw0uJ2uXMhztFON0JtPi3N7mssfRURzPnTe5aARuqp";

  async function fetchWebApi(endpoint: string, method: string = "GET", body?: unknown) {
    try {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        method,
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!res.ok) {
        throw new Error(`Spotify API error: ${res.status}`);
      }
      
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  async function getTopTracks() {
    const data = await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=8");
    return data.items;
  }

  useEffect(() => {
    (async () => {
      try {
        const topTracks = await getTopTracks();
        setTracks(topTracks);
      } catch (err: any) {
        setError("Error al cargar las canciones de Spotify. Por favor intenta más tarde.");
        console.error("Spotify error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePlay = (track: Track) => {
    if (!track.preview_url) {
      alert("No hay preview disponible para esta canción");
      return;
    }
    
    // Stop any previous audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    const newAudio = new Audio(track.preview_url);
    newAudio.volume = 0.7;
    newAudio.play().catch(err => {
      console.error("Error playing audio:", err);
      alert("Error al reproducir la canción");
    });
    
    setAudio(newAudio);
    setCurrentPreview(track.preview_url);

    // Auto-stop after 30 seconds (preview length)
    newAudio.addEventListener('ended', () => {
      setCurrentPreview(null);
    });
  };

  const handleStop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentPreview(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-card/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
              ))}
            </div>
          </div>
          <p className="text-lg text-white/80 mt-4">Cargando tu música favorita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-card/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-500/30">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
      <h2 className="text-3xl font-bold mb-6 text-center text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        🎵 Elige tu música, mi amor 🎵
      </h2>
      
      {currentPreview && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
          <div className="flex items-center justify-between">
            <p className="text-pink-300 font-medium">🎶 Reproduciendo preview...</p>
            <button
              onClick={handleStop}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Detener
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className="group p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-pink-300 transition-colors">
                  {track.name}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
              
              <button
                onClick={() => handlePlay(track)}
                disabled={!track.preview_url}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  track.preview_url
                    ? currentPreview === track.preview_url
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
                      : "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 hover:from-pink-500/30 hover:to-purple-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                    : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentPreview === track.preview_url ? "🎵 Sonando" : track.preview_url ? "▶️ Reproducir" : "Sin preview"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-white/60 text-sm">
        <p>💝 Cada canción me recuerda a ti, Camila 💝</p>
      </div>
    </div>
  );
}
