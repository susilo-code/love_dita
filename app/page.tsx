'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Play, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AnniversaryWebsite() {
  /* ===================== GLOBAL STATE ===================== */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const audioInitialized = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const [password, setPassword] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  /* ===================== DATA (STATIC, SAFE FOR SSR) ===================== */
  const messages = [
    '10 tahun yang lalu, kita memulai perjalanan ini bersama yange...meski gak selalu mudah, ada pasang surut',
    'Mas, banyak salah, banyak ngecewain yange, mas masih terus belajar .....',
    'maaf y yange, masih belajar teruus, tapi mas yakin kok lama-lama salahnya makin dikit, hehehe',
    'maaf y yangeeee......',
    'Sekarang udah 25 Desember, 3 hari yang lalu juga hari Ibu ....',
    'Makasih y yange udah jadi ibu yang luar biasa, ibu yang handle 3 anak sendirian, pasti gak mudah kan yangeee',
    'ngurus ini itu, nyariin kelas ini itu, drama setiap harinya yang menguji mental yangee',
    'Selamat Ulang Tahun Pernikahan yang ke-10 dan Selamat hari Ibu yangeee❤️',
    'Terima kasih atas semua perjuangan dan pengorbanan yangeee',
    'Terima kasih, Dita Puspa Rini',
  ];

  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg',
    '/images/photo5.jpg',
    '/images/photo6.jpg',
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

  /* ===================== AUTO PLAY AUDIO (HANYA SEKALI) ===================== */
  useEffect(() => {
    if (!mounted || audioInitialized.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    audioInitialized.current = true;

    // Coba autoplay langsung
    const tryAutoplay = () => {
      audio.muted = false;
      audio.volume = 0.6;
      
      audio.play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(() => {
          // Jika gagal, coba dengan muted dulu
          audio.muted = true;
          audio.play()
            .then(() => {
              setAudioPlaying(true);
              // Unmute setelah user interaksi
              setupUnmute();
            })
            .catch(() => {
              // Jika tetap gagal, tunggu user click
              setupUnmute();
            });
        });
    };

    const setupUnmute = () => {
      const unmute = () => {
        if (audio.muted) {
          audio.muted = false;
          audio.volume = 0.6;
        }
        if (audio.paused) {
          audio.play()
            .then(() => setAudioPlaying(true))
            .catch(() => {});
        }
        document.removeEventListener('click', unmute);
        document.removeEventListener('touchstart', unmute);
        document.removeEventListener('keydown', unmute);
      };

      document.addEventListener('click', unmute, { once: true });
      document.addEventListener('touchstart', unmute, { once: true });
      document.addEventListener('keydown', unmute, { once: true });
    };

    // Coba play saat component mount
    tryAutoplay();

  }, [mounted]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
        <FloatingHearts />
        <AudioPlayer />

        <button
          onClick={handlePlay}
          className="z-10 p-8 bg-white/20 rounded-full hover:bg-white/30 transition"
        >
          <Play className="w-24 h-24 text-pink-300" />
        </button>
      </div>
    );
  }

  /* ===================== MESSAGE PAGE ===================== */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900">
      <FloatingHearts />
      <AudioPlayer />

      <button
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-10 bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
      >
        {audioPlaying ? '⏸' : '▶'}
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