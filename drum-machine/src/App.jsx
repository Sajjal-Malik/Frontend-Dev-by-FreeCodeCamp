import { useState, useEffect, useRef } from "react";
import "./index.css";

const PADS = [
  { key: 'Q', id: 'Heater-1', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
  { key: 'W', id: 'Heater-2', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
  { key: 'E', id: 'Heater-3', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
  { key: 'A', id: 'Heater-4', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
  { key: 'S', id: 'Clap', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
  { key: 'D', id: 'Open-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
  { key: 'Z', id: "Kick-n'-Hat", src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },
  { key: 'X', id: 'Kick', src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
  { key: 'C', id: 'Closed-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' }
];


function DrumPad({ pad, playClip, activeKey }) {
  return (
    <div
      className="drum-pad"
      id={pad.id}
      onClick={() => playClip(pad.key, pad.id)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key.toUpperCase() === pad.key) playClip(pad.key, pad.id);
      }}
      aria-pressed={activeKey === pad.key}
    >
      <span>{pad.key}</span>
      <audio className="clip" id={pad.key} src={pad.src}></audio>
    </div>
  );
}



function App() {
  const [display, setDisplay] = useState("Ready");
  const [activeKey, setActiveKey] = useState(null);
  const volumeRef = useRef(1);

  useEffect(() => {
    function onKey(e) {
      const k = e.key.toUpperCase();
      const pad = PADS.find((p) => p.key === k);
      if (pad) playClip(k, pad.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const playClip = (key, id) => {
    const audio = document.getElementById(key);
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = volumeRef.current;
    audio.play();
    setDisplay(id);
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 150);
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    volumeRef.current = v;
    setDisplay("Volume: " + Math.round(v * 100));
  };

  return (
    <div className="machine" id="drum-machine">
      <div className="pads">
        {PADS.map((p) => (
          <DrumPad
            key={p.key}
            pad={p}
            playClip={playClip}
            activeKey={activeKey}
          />
        ))}
      </div>

      <div className="right-panel">
        <div id="display">{display}</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="1"
          onInput={handleVolume}
        />
      </div>
    </div>
  );
}

export default App;
