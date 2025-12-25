'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Play, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';

export default function AnniversaryWebsite() {
  /* ===================== REFS ===================== */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);

  /* ===================== STATE ===================== */
  const [mounted, setMounted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const [password, setPassword] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  /* ===================== DATA ===================== */
  const messages = [
    '10 tahun yang lalu, kita memulai perjalanan indah ini bersama...',
    'Setiap hari bersamamu adalah anugerah yang tak ternilai harganya',
    'Terima kasih telah menjadi pasangan hidup, sahabat, dan cinta sejatiku',
    'Dari ribuan kenangan manis, semuanya tetap indah di hatiku',
    'Kita telah melewati suka dan duka, tertawa dan menangis bersama',
    '10 tahun ini hanyalah permulaan, masih banyak petualangan yang menanti kita',
    'Aku bersyukur setiap hari karena memilih untuk berbagi hidup denganmu',
    'Selamat Ulang Tahun Pernikahan yang ke-10, Cintaku! ❤️',
    'Terima kasih, Dita Puspa Rini',
  ];

  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg',
  ];

  /* ===================== MOUNT ===================== */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ===================== FLOATING HEARTS ===================== */
  const FloatingHearts = () => {
    if (!mounted) return null;

    const hearts = [
      { left: '10%', top: '20%', size: 24 },
      { left: '30%', top: '70%', size: 18 },
      { left: '50%', top: '40%', size: 22 },
      { left: '70%', top: '60%', size: 20 },
      { left: '85%', top: '30%', size: 16 },
    ];

    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {hearts.map((h, i) => (
          <Heart
            key={i}
            fill="currentColor"
            className="absolute text-pink-300/20 animate-pulse"
            style={{
              left: h.left,
              top: h.top,
              width: h.size,
              height: h.size,
            }}
          />
        ))}
      </div>
    );
  };

  /* ===================== AUDIO PLAY (MOBILE SAFE) ===================== */
  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = 0.6;

    audio
      .play()
      .then(() => {
        setAudioUnlocked(true);
        setAudioPlaying(true);
      })
      .catch(() => {});
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  /* ===================== AUTO SLIDES ===================== */
  useEffect(() => {
    if (currentPage <= 0) return;

    autoTimer.current = setInterval(() => {
      setCurrentPage((p) => (p < messages.length ? p + 1 : p));
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, 6000);

    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [currentPage]);

  const stopAuto = () => {
    if (autoTimer.current) clearInterval(autoTimer.current);
  };

  /* ===================== LOGIN ===================== */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mylovedita') {
      setIsLoggedIn(true);
      setTimeout(() => setShowPlay(true), 300);
    } else {
      alert('Kata kunci salah 💜');
    }
  };

  const handlePlay = () => {
    setShowPlay(false);
    setCurrentPage(1);
  };

  /* ===================== AUDIO ELEMENT (ONE ONLY) ===================== */
  const GlobalAudio = () => (
    <audio ref={audioRef} loop preload="auto" playsInline>
      <source src="/audio/bcl.mp3" type="audio/mpeg" />
    </audio>
  );

  /* ===================== LOGIN PAGE ===================== */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
        <GlobalAudio />
        <FloatingHearts />

        <form
          onSubmit={handleLogin}
          autoComplete="off"
          suppressHydrationWarning
          className="z-10 w-full max-w-md p-10 rounded-3xl bg-white/10 backdrop-blur border border-white/20"
        >
          <h1 className="text-3xl text-white mb-6 text-center">
            10 Tahun Bersama
          </h1>

          <input
            type="password"
            value={password}
            autoComplete="new-password"
            suppressHydrationWarning
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata kunci..."
            className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white"
          />

          <button className="w-full py-3 bg-pink-400 rounded-xl text-white font-semibold">
            Masuk
          </button>
        </form>
      </div>
    );
  }

  /* ===================== PLAY PAGE ===================== */
  if (showPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
        <GlobalAudio />
        <FloatingHearts />

        {!audioUnlocked && (
          <button
            onClick={playAudio}
            onTouchStart={playAudio}
            className="px-8 py-4 bg-pink-400 text-white rounded-2xl flex items-center gap-3"
          >
            <Volume2 /> Nyalakan Musik
          </button>
        )}

        <button
          onClick={handlePlay}
          className="p-6 bg-white/20 rounded-full"
        >
          <Play className="w-20 h-20 text-pink-300" />
        </button>
      </div>
    );
  }

  /* ===================== MESSAGE PAGE ===================== */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
      <GlobalAudio />
      <FloatingHearts />

      {audioUnlocked && (
        <button
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-10 bg-white/20 p-3 rounded-full"
        >
          {audioPlaying ? '⏸' : '▶'}
        </button>
      )}

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="p-10 bg-white/10 rounded-3xl text-white text-center text-2xl">
          {messages[currentPage - 1]}
        </div>

        <div className="overflow-hidden rounded-3xl">
          <img
            src={photos[photoIndex]}
            className="w-full h-80 object-cover transition-all duration-1000"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              stopAuto();
              setCurrentPage((p) => Math.max(1, p - 1));
            }}
          >
            <ArrowLeft /> Sebelumnya
          </button>

          <button
            onClick={() => {
              stopAuto();
              setCurrentPage((p) =>
                Math.min(messages.length, p + 1)
              );
            }}
          >
            Selanjutnya <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
