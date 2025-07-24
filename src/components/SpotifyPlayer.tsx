"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Track {
  name: string;
  album: {
    name: string;
    images: {
      url: string;
    }[];
  };
  artists: {
    name: string;
  }[];
  external_urls: {
    spotify: string;
  };
}

const SpotifyPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("/api/spotify");
        const data = await res.json();
        setTracks(data.tracks);
      } catch {
        console.error("Error al obtener canciones");
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [tracks, isPlaying]);

  if (tracks.length === 0) {
    return <div className="text-white">Cargando canciones...</div>;
  }

  const currentTrack = tracks[currentIndex];

  return (
    <div className="flex flex-col items-center space-y-4 p-4 text-white">
      <h2 className="text-lg md:text-2xl font-bold text-pink-400">
        🎵 Nuestras canciones favoritas 💖
      </h2>
      <motion.a
        key={currentTrack.external_urls.spotify}
        href={currentTrack.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full md:w-96 p-4 rounded-lg shadow-lg bg-pink-900 bg-opacity-30 hover:bg-opacity-50 transition"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            className="w-48 h-48 rounded-lg mb-4 shadow-md"
          />
          <h3 className="text-xl font-semibold">{currentTrack.name}</h3>
          <p className="text-sm text-pink-300">
            {currentTrack.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className="text-xs mt-1 text-pink-200">
            Álbum: {currentTrack.album.name}
          </p>
        </div>
      </motion.a>
      <div className="flex space-x-4">
        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? tracks.length - 1 : prev - 1
            )
          }
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          ⏮️ Anterior
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          {isPlaying ? "⏸️ Pausar" : "▶️ Reanudar"}
        </button>
        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === tracks.length - 1 ? 0 : prev + 1
            )
          }
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          Siguiente ⏭️
        </button>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
