"use client"

import React, { useEffect, useState } from 'react';

export default function MusicWaves() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveIntensity, setWaveIntensity] = useState(1);

  useEffect(() => {
    // Detectar si hay música reproduciéndose
    const checkForMusic = () => {
      const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
      const musicIndicator = document.querySelector('[data-music-playing]');
      
      if (iframes.length > 0 || musicIndicator) {
        setIsPlaying(true);
        // Simular variaciones de intensidad basadas en el ritmo
        const interval = setInterval(() => {
          setWaveIntensity(0.5 + Math.random() * 1.5);
        }, 200); // Cambiar cada 200ms para simular el beat
        
        return () => clearInterval(interval);
      } else {
        setIsPlaying(false);
      }
    };

    // Verificar cada segundo
    const musicChecker = setInterval(checkForMusic, 1000);
    
    return () => clearInterval(musicChecker);
  }, []);

  // Generar ondas con diferentes frecuencias
  const generateWaves = () => {
    const waves = [];
    const numWaves = 6;
    
    for (let i = 0; i < numWaves; i++) {
      const delay = i * 0.5;
      const frequency = 2 + i * 0.3;
      const amplitude = isPlaying ? waveIntensity : 0.3;
      
      waves.push(
        <div
          key={i}
          className={`
            absolute inset-0 opacity-20 pointer-events-none
            ${isPlaying ? 'animate-pulse' : ''}
          `}
          style={{
            background: `radial-gradient(ellipse at center, 
              transparent 30%, 
              rgba(147, 51, 234, ${0.1 * amplitude}) 50%, 
              rgba(219, 39, 119, ${0.05 * amplitude}) 70%, 
              transparent 90%
            )`,
            transform: `scale(${1 + amplitude * 0.2})`,
            animationDelay: `${delay}s`,
            animationDuration: `${frequency}s`,
          }}
        />
      );
    }
    
    return waves;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ondas de fondo principales */}
      {generateWaves()}
      
      {/* Ondas circulares que pulsan */}
      {isPlaying && (
        <>
          {[...Array(4)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="absolute rounded-full border opacity-10 animate-ping"
              style={{
                width: `${200 + i * 150}px`,
                height: `${200 + i * 150}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderColor: i % 2 === 0 ? '#ec4899' : '#a855f7',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`,
              }}
            />
          ))}
        </>
      )}
      
      {/* Barras de ecualizador en las esquinas */}
      {isPlaying && (
        <div className="absolute bottom-4 left-4 flex space-x-1 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={`eq-${i}`}
              className="bg-gradient-to-t from-pink-500 to-purple-500 rounded-t"
              style={{
                width: '4px',
                height: `${20 + Math.random() * 40 * waveIntensity}px`,
                animation: `equalizer ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Ondas laterales */}
      {isPlaying && (
        <>
          <div 
            className="absolute left-0 top-1/2 w-32 h-64 opacity-20 animate-pulse"
            style={{
              background: `linear-gradient(90deg, 
                rgba(147, 51, 234, ${0.3 * waveIntensity}) 0%, 
                transparent 100%
              )`,
              transform: `translateY(-50%) scaleY(${waveIntensity})`,
              borderRadius: '0 50% 50% 0',
            }}
          />
          <div 
            className="absolute right-0 top-1/2 w-32 h-64 opacity-20 animate-pulse"
            style={{
              background: `linear-gradient(-90deg, 
                rgba(219, 39, 119, ${0.3 * waveIntensity}) 0%, 
                transparent 100%
              )`,
              transform: `translateY(-50%) scaleY(${waveIntensity})`,
              borderRadius: '50% 0 0 50%',
            }}
          />
        </>
      )}
      
      {/* Partículas musicales flotantes */}
      {isPlaying && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute text-xs opacity-40 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                color: i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#a855f7' : '#8b5cf6',
              }}
            >
              {['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
