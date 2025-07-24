"use client"

import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    // Animación de transición suave
    setTimeout(() => {
      setIsDark(!isDark);
      localStorage.setItem('theme', !isDark ? 'dark' : 'light');
      
      // Aplicar el tema al documento
      if (!isDark) {
        document.documentElement.classList.add('dark');
        document.body.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
      }
      
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        className={`
          relative w-16 h-16 rounded-full border-2 transition-all duration-500 ease-in-out
          ${isDark 
            ? 'bg-gradient-to-br from-purple-900 to-black border-purple-500/30 shadow-lg shadow-purple-500/20' 
            : 'bg-gradient-to-br from-yellow-200 to-orange-300 border-orange-400/50 shadow-lg shadow-orange-400/30'
          }
          hover:scale-110 active:scale-95
          ${isAnimating ? 'animate-spin' : ''}
        `}
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {/* Icono animado */}
        <div className={`
          absolute inset-0 flex items-center justify-center text-2xl transition-all duration-500
          ${isAnimating ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}
        `}>
          {isDark ? (
            // Luna para modo oscuro
            <div className="relative">
              <div className="text-purple-200">🌙</div>
              <div className="absolute -top-1 -right-1 text-xs animate-pulse">✨</div>
            </div>
          ) : (
            // Sol para modo claro
            <div className="relative">
              <div className="text-orange-600 animate-pulse">☀️</div>
              <div className="absolute -top-1 -right-1 text-xs animate-bounce">✨</div>
            </div>
          )}
        </div>

        {/* Efecto de ondas al hacer clic */}
        <div className={`
          absolute inset-0 rounded-full transition-all duration-300
          ${isAnimating 
            ? isDark 
              ? 'bg-purple-500/20 animate-ping' 
              : 'bg-orange-400/20 animate-ping'
            : 'bg-transparent'
          }
        `} />

        {/* Partículas decorativas */}
        <div className="absolute -inset-2 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 rounded-full transition-all duration-500
                ${isDark ? 'bg-purple-400' : 'bg-orange-400'}
                ${isAnimating ? 'animate-ping' : 'animate-pulse'}
              `}
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 25}px`,
                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 25}px`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      </button>

      {/* Tooltip */}
      <div className={`
        absolute -bottom-12 left-1/2 transform -translate-x-1/2
        px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap
        transition-all duration-300 pointer-events-none
        ${isDark 
          ? 'bg-purple-900/80 text-purple-200 border border-purple-500/30' 
          : 'bg-orange-100/80 text-orange-800 border border-orange-300/50'
        }
        opacity-0 group-hover:opacity-100
      `}>
        {isDark ? 'Modo claro' : 'Modo oscuro'}
      </div>
    </div>
  );
}
