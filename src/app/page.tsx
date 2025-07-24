"use client"

import React, { useEffect, useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import ThemeToggle from "../components/ThemeToggle";
import LoginForm from "../components/LoginForm";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verificar si ya está logueado
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  if (!mounted) {
    return null;
  }

  // Mostrar login si no está autenticado
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Mostrar la aplicación principal si está autenticado
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white overflow-hidden">
      {/* Animated Flowers Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, idx) => (
          <div
            key={idx}
            className="flower"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, idx) => (
          <div
            key={`heart-${idx}`}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
            }}
          >
            ♡
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header with Camila's name */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gray-200 via-purple-300 to-gray-200 bg-clip-text text-transparent mb-4 animate-pulse">
            maría camila
          </h1>
          <div className="text-2xl md:text-3xl text-gray-300 font-light">
          ♡ el amor de mi vida ♡
          </div>
        </div>

        {/* Romantic Message */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-600/30 shadow-2xl shadow-black/20">
            <div className="text-center space-y-4">
              <div className="text-4xl mb-6">♡</div>
              <p className="text-lg md:text-xl leading-relaxed text-gray-100 font-medium">
                <span className="text-green-300 font-bold">te amo</span> con todo el corazón y las fuerzas y todo lo que quiero durar contigo no tienes idea de cuanto{" "}
                <span className="text-purple-300 font-bold">eres el amor de mi vida</span> y viviremos juntos y haremos miles de cosas juntos,{" "}
                <span className="text-gray-300 font-bold">gracias por estos meses tan hermosos</span>, 19 meses{" "}
                <span className="text-purple-300 font-bold">en los cuales no te he dejado de amar nunca</span> y siempre lo{" "}
                <span className="text-gray-300 font-bold">haré</span> con todo el corazón, todas las fuerzas, todo lo que puedo dar, hasta morir{" "}
                <span className="text-purple-300 font-bold">mi futura esposa</span> y el amor de mi vida{" "}
                <span className="text-gray-300 font-bold">eres toda mía</span>
              </p>
              <div className="text-2xl mt-6 text-gray-300">
                con amor infinito
              </div>
            </div>
          </div>
        </div>

        {/* Music Player */}
        <MusicPlayer />

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p className="text-lg">
          ♡ hecho con amor para la mujer más hermosa del mundo ♡
          </p>
          <div className="mt-4 text-sm">
            <p>cada día contigo es un regalo</p>
          </div>
        </div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Logout button (pequeño y discreto) */}
      <button
        onClick={() => {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
        }}
        className="fixed bottom-4 right-4 text-xs text-gray-500 hover:text-gray-300 transition-colors z-50"
        title="Cerrar sesión"
      >
        ↩
      </button>
    </div>
  );
}
