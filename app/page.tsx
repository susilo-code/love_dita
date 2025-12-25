'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Play, ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export default function AnniversaryWebsite() {
  /* ===================== GLOBAL STATE ===================== */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const audioInitialized = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const [password, setPassword] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  /* ===================== DATA (STATIC, SAFE FOR SSR) ===================== */
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

  /* ===================== MOUNT FLAG (FIX HYDRATION) ===================== */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ===================== FLOATING HEARTS (CLIENT ONLY) ===================== */
  const FloatingHearts = () => {
    if (!mounted) return null;

    const hearts = [
      { left: '10%', top: '20%', size: 28 },
      { left: '30%', top: '70%', size: 20 },
      { left: '50%', top: '40%', size: 24 },
      { left: '70%', top: '60%', size: 22 },
      { left: '85%', top: '30%', size: 18 },
    ];

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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

  /* ===================== PLAY AUDIO FUNCTION ===================== */
  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio || audioInitialized.current) return;

    audioInitialized.current = true;
    audio.volume = 0.6;

    audio.play()
      .then(() => {
        setAudioPlaying(true);
        setShowAudioPrompt(false);
      })
      .catch((error) => {
        console.log('Audio play failed:', error);
        setShowAudioPrompt(true);
      });
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
  }, [currentPage, messages.length, photos.length]);

  const stopAuto = () => {
    if (autoTimer.current) clearInterval(autoTimer.current);
  };

  /* ===================== HANDLERS ===================== */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mylovedita') {
      setIsLoggedIn(true);
      setTimeout(() => setShowPlay(true), 400);
    } else {
      alert('Kata kunci salah 💜');
    }
  };

  const handlePlay = () => {
    setShowPlay(false);
    setCurrentPage(1);
    // Coba play audio saat tombol play diklik
    playAudio();
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.play()
        .then(() => setAudioPlaying(true))
        .catch(() => setShowAudioPrompt(true));
    }
  };

  const handleEnableAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play()
      .then(() => {
        setAudioPlaying(true);
        setShowAudioPrompt(false);
        audioInitialized.current = true;
      })
      .catch(() => {
        alert('Gagal memutar audio. Coba lagi!');
      });
  };

  /* ===================== AUDIO ELEMENT (GLOBAL) ===================== */
  const AudioPlayer = () => (
    <audio 
      ref={audioRef} 
      loop 
      preload="auto" 
      playsInline
    >
      <source src="/audio/bcl.mp3" type="audio/mpeg" />
    </audio>
  );

  /* ===================== AUDIO PROMPT (MOBILE) ===================== */
  const AudioPrompt = () => {
    if (!showAudioPrompt) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 max-w-sm text-center">
          <Volume2 className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">Aktifkan Musik?</h3>
          <p className="text-white/80 text-sm mb-6">
            Nyalakan musik untuk pengalaman yang lebih romantis 🎵
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAudioPrompt(false)}
              className="flex-1 py-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition"
            >
              Nanti
            </button>
            <button
              onClick={handleEnableAudio}
              className="flex-1 py-3 bg-pink-400 rounded-xl text-white font-semibold hover:bg-pink-500 transition"
            >
              Ya, Nyalakan
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ===================== LOGIN PAGE ===================== */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
        <FloatingHearts />
        <AudioPlayer />

        <form
          onSubmit={handleLogin}
          className="z-10 w-full max-w-md p-10 rounded-3xl bg-white/10 backdrop-blur border border-white/20"
        >
          <h1 className="text-3xl text-white mb-6 text-center">
            10 Tahun Bersama
          </h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata kunci..."
            className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder:text-white/60"
          />

          <button 
            type="submit"
            className="w-full py-3 bg-pink-400 rounded-xl text-white font-semibold hover:bg-pink-500 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    );
  }

  /* ===================== PLAY PAGE ===================== */
  if (showPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900 p-4">
        <FloatingHearts />
        <AudioPlayer />

        <div className="text-center mb-8 z-10">
          <h2 className="text-white text-2xl mb-2">Siap untuk memulai?</h2>
          <p className="text-white/80 text-sm">Tekan tombol play untuk melanjutkan</p>
        </div>

        <button
          onClick={handlePlay}
          className="z-10 p-8 bg-white/20 rounded-full hover:bg-white/30 transition transform hover:scale-110"
        >
          <Play className="w-24 h-24 text-pink-300" fill="currentColor" />
        </button>
      </div>
    );
  }

  /* ===================== MESSAGE PAGE ===================== */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
      <FloatingHearts />
      <AudioPlayer />
      <AudioPrompt />

      <button
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-10 bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
      >
        {audioPlaying ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
      </button>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="p-10 bg-white/10 rounded-3xl text-white text-center text-2xl backdrop-blur">
          {messages[currentPage - 1]}
        </div>

        <div className="overflow-hidden rounded-3xl">
          <img
            src={photos[photoIndex]}
            alt="Anniversary Photo"
            className="w-full h-80 object-cover transition-all duration-1000"
          />
        </div>

        <div className="flex justify-between text-white">
          <button
            onClick={() => {
              stopAuto();
              setCurrentPage((p) => Math.max(1, p - 1));
            }}
            className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition"
          >
            <ArrowLeft size={20} /> Sebelumnya
          </button>

          <button
            onClick={() => {
              stopAuto();
              setCurrentPage((p) =>
                Math.min(messages.length, p + 1)
              );
            }}
            className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition"
          >
            Selanjutnya <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}