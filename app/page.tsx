'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Play, ArrowLeft, ArrowRight, Volume2, VolumeX, Lock } from 'lucide-react';

export default function AnniversaryWebsite() {
  /* ===================== STATE MANAGEMENT ===================== */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);

  // 'LOGIN' -> 'INTRO' (Tombol Play) -> 'MAIN' (Konten)
  const [view, setView] = useState<'LOGIN' | 'INTRO' | 'MAIN'>('LOGIN');
  
  const [password, setPassword] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  /* ===================== DATA PESAN & FOTO ===================== */
  const messages = [
    '11 tahun yang lalu, kita memulai perjalanan ini bersama yange... meski gak selalu mudah, ada pasang surut',
    'Mas banyak salah, banyak ngecewain yange, mas masih terus belajar .....',
    'Maaf ya yange, masih belajar teruus, tapi mas yakin kok lama-lama salahnya makin dikit, hehehe',
    'Maaf ya yangeeee......',
    'Sekarang udah 25 Desember 2025, 3 hari yang lalu juga hari Ibu ....',
    'Makasih ya yange udah jadi ibu yang luar biasa, ibu yang handle 3 anak sendirian, pasti gak mudah kan yangeee',
    'Ngurus ini itu, nyariin kelas ini itu, drama setiap harinya yang menguji mental yangee',
    'Selamat Ulang Tahun Pernikahan yang ke-11 dan Selamat Hari Ibu yangeee❤️',
    'Semoga mas bisa jadi suami yang lebih baik lagi buat yange',
    'Terima kasih atas semua perjuangan dan pengorbanan yangeee',
    'Terima kasih, Dita Puspa Rini',
    'Maaf ya yangeee, hadiahnya cuma jilbab, huhuhu (Semoga suka ya!)',
    'Maaf telat banget ini ngucapinnya juga ...',
    'I love you yange, I love you Dita Puspa Rini❤️'
  ];

  // Pastikan file ini ada di folder public/images/
  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg',
    '/images/photo5.jpg',
    '/images/photo6.jpg',
    '/images/photo7.jpg',
    '/images/photo8.jpg',
    '/images/photo9.jpg',
  ];

  /* ===================== LOGIC UTAMA ===================== */
  
  // 1. Cek Mounted agar aman dari Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Auto Slide Logic
  useEffect(() => {
    if (view !== 'MAIN' || currentPage <= 0) return;

    autoTimer.current = setInterval(() => {
      setCurrentPage((p) => (p < messages.length ? p + 1 : p));
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, 6000); // Ganti slide setiap 6 detik

    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [view, currentPage, messages.length, photos.length]);

  const stopAuto = () => {
    if (autoTimer.current) clearInterval(autoTimer.current);
  };

  /* ===================== HANDLERS ===================== */

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mylovedita') {
      // Pindah ke Intro, JANGAN play audio di sini (browser akan block)
      setView('INTRO');
    } else {
      alert('Kata kunci salah yangeee, coba lagi atuh 💜');
    }
  };

  const handleStartMusic = () => {
    // INI KUNCI UTAMA: Audio di-trigger langsung oleh klik user
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.6;
      audio.play()
        .then(() => {
          setAudioPlaying(true);
          setView('MAIN'); // Masuk ke konten utama
          setCurrentPage(1); // Mulai slide pertama
        })
        .catch((err) => {
          console.error("Audio error:", err);
          alert("Gagal memutar musik. Pastikan HP tidak di mode silent/hening.");
          // Tetap masuk meski audio gagal
          setView('MAIN');
          setCurrentPage(1);
        });
    }
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.play();
      setAudioPlaying(true);
    }
  };

  /* ===================== RENDER HELPERS ===================== */
  const FloatingHearts = () => {
    if (!mounted) return null;
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            fill="currentColor"
            className="absolute text-pink-300/20 animate-pulse"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 80}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  };

  /* ===================== MAIN UI ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900 overflow-hidden relative font-sans text-white">
      
      {/* --- KOMPONEN AUDIO GLOBAL (TIDAK BOLEH HILANG) --- */}
      <audio 
        ref={audioRef} 
        src="/audio/bcl.mp3" // Pastikan file ada di folder public/audio/
        loop 
        preload="auto" 
        playsInline // Penting untuk iOS
      />

      <FloatingHearts />

      {/* --- TOMBOL AUDIO POJOK KANAN (Hanya muncul di Main) --- */}
      {view === 'MAIN' && (
        <button
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition border border-white/20 shadow-lg"
        >
          {audioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">

        {/* 1. HALAMAN LOGIN */}
        {view === 'LOGIN' && (
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-in zoom-in duration-500"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-pink-500/20 rounded-full">
                <Lock className="w-8 h-8 text-pink-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">11 Tahun Bersama</h1>
            <h3 className="text-3xl font-bold text-center mb-2 italic">1 Desember 2014 - 1 Desember 2025 🎉</h3>
            <p className="text-center text-white/60 mb-8 text-sm">Masukan password dulu yangee...</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className="w-full mb-6 p-4 rounded-xl bg-black/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400 border border-white/10 transition-all"
            />
            
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              Buka Hati ❤️
            </button>
          </form>
        )}

        {/* 2. HALAMAN INTRO (WAJIB KLIK UNTUK AUDIO) */}
        {view === 'INTRO' && (
          <div className="text-center max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-2xl font-semibold mb-3">Siap yangeee? ❤️</h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Ada sesuatu buat yangee. Pastikan volume HP yange nyala ya biar romantis...
            </p>
            
            <button
              onClick={handleStartMusic}
              className="group relative inline-flex items-center justify-center p-4 px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-pink-400 rounded-full shadow-md bg-pink-500/80 hover:bg-pink-600"
            >
              <span className="flex items-center gap-3 text-lg font-bold">
                <Play fill="currentColor" size={20} />
                Putar .....
              </span>
            </button>
          </div>
        )}

        {/* 3. HALAMAN UTAMA (SLIDESHOW) */}
        {view === 'MAIN' && (
          <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-1000">
            
            {/* Kartu Pesan */}
            <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl min-h-[160px] flex items-center justify-center transition-all hover:bg-white/15">
              <p className="text-center text-xl md:text-2xl font-medium leading-relaxed drop-shadow-md">
                "{messages[currentPage - 1]}"
              </p>
            </div>

            {/* Bingkai Foto */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl bg-black/20">
              <img
                key={photoIndex} // Key agar ada animasi saat ganti foto
                src={photos[photoIndex]}
                alt="Kenangan Kita"
                className="w-full h-full object-cover animate-in fade-in duration-700"
              />
            </div>

            {/* Navigasi */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => {
                  stopAuto();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl hover:bg-white/20 active:scale-95 transition border border-white/5"
              >
                <ArrowLeft size={20} /> Prev
              </button>

              <button
                onClick={() => {
                  stopAuto();
                  setCurrentPage((p) => Math.min(messages.length, p + 1));
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-pink-600 py-4 rounded-2xl hover:bg-pink-700 active:scale-95 transition shadow-lg shadow-pink-900/20"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
            
            <p className="text-center text-xs text-white/30 mt-8">
              Created with Love • 25 Dec 2025
            </p>
          </div>
        )}

      </div>
    </div>
  );
}