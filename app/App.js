import React, { useRef, useEffect } from "react";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", playAudio);
    };

    document.addEventListener("click", playAudio);

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  return (
    <div>
      <h1>React 16 Audio</h1>

      <audio ref={audioRef} loop>
        <source src="/audio/bcl.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
