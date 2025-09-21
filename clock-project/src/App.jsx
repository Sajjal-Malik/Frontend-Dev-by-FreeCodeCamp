/*
  25 + 5 Clock - Single-file React component

  Notes: This implementation follows the FreeCodeCamp test IDs and behaviors.
  The audio source uses the official FCC beep file hosted on GitHub; you can replace it
  with a local file if you prefer (make sure it's >= 1 second).
*/

import React, { useState, useRef, useEffect } from "react";

export default function App() {
  // lengths in minutes
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);

  // timeLeft in seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);

  // refs for interval id and audio element
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Keep timeLeft synced when sessionLength changes (but only when timer not running and label is Session)
  useEffect(() => {
    if (!isRunning && timerLabel === "Session") {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength, isRunning, timerLabel]);

  // Keep timeLeft synced when breakLength changes (but only when timer not running and label is Break)
  useEffect(() => {
    if (!isRunning && timerLabel === "Break") {
      setTimeLeft(breakLength * 60);
    }
  }, [breakLength, isRunning, timerLabel]);

  // Clear interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const decrement = (type) => {
    if (isRunning) return; // optional: prevent changing while running
    if (type === "break") {
      setBreakLength((prev) => {
        const v = Math.max(1, prev - 1);
        return v;
      });
    } else {
      setSessionLength((prev) => {
        const v = Math.max(1, prev - 1);
        return v;
      });
    }
  };

  const increment = (type) => {
    if (isRunning) return;
    if (type === "break") {
      setBreakLength((prev) => Math.min(60, prev + 1));
    } else {
      setSessionLength((prev) => Math.min(60, prev + 1));
    }
  };

  const switchMode = () => {
    setTimerLabel((prev) => (prev === "Session" ? "Break" : "Session"));
    setTimeLeft((prevLabel) => {
      // we will compute new time in the caller after label flips
      return null;
    });
  };

  // Start or stop the timer
  const handleStartStop = () => {
    if (isRunning) {
      // stop
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    } else {
      // start
      setIsRunning(true);
      // use a stable interval that reads from functional setState to avoid stale closures
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            // play beep and switch modes
            if (audioRef.current) {
              audioRef.current.play();
            }
            // switch to other mode and return its seconds
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Reset everything
  const handleReset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Accessibility: keyboard start/stop on Enter or Space for the start_stop button is handled by default

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>25 + 5 Clock</h1>
      <div style={styles.controlsRow}>
        <div style={styles.controlBox}>
          <div id="break-label" style={styles.label}>
            Break Length
          </div>
          <div style={styles.adjustRow}>
            <button id="break-decrement" onClick={() => decrement("break")} style={styles.smallButton}>
              -
            </button>
            <div id="break-length" style={styles.lengthDisplay}>{breakLength}</div>
            <button id="break-increment" onClick={() => increment("break")} style={styles.smallButton}>
              +
            </button>
          </div>
        </div>

        <div style={styles.controlBox}>
          <div id="session-label" style={styles.label}>
            Session Length
          </div>
          <div style={styles.adjustRow}>
            <button id="session-decrement" onClick={() => decrement("session")} style={styles.smallButton}>
              -
            </button>
            <div id="session-length" style={styles.lengthDisplay}>{sessionLength}</div>
            <button id="session-increment" onClick={() => increment("session")} style={styles.smallButton}>
              +
            </button>
          </div>
        </div>
      </div>

      <div style={styles.timerBox}>
        <div id="timer-label" style={styles.timerLabel}>{timerLabel}</div>
        <div id="time-left" style={styles.timeLeft}>{formatTime(timeLeft)}</div>
      </div>

      <div style={styles.actionsRow}>
        <button id="start_stop" onClick={handleStartStop} style={styles.actionButton}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset} style={styles.actionButton}>
          Reset
        </button>
      </div>

      {/* audio element for beep */}
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        preload="auto"
      />

      <div style={styles.footer}>
        <small>Built to satisfy FreeCodeCamp 25 + 5 Clock tests.</small>
      </div>
    </div>
  );
}

// Simple inline styles to keep everything in one file
const styles = {
  app: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    padding: 20,
    minHeight: "100vh",
    background: "linear-gradient(135deg,#f6f8ff,#e8f0ff)",
  },
  title: { margin: 0 },
  controlsRow: { display: "flex", gap: 24 },
  controlBox: {
    background: "white",
    padding: 12,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(30,30,60,0.08)",
    minWidth: 170,
  },
  label: { textAlign: "center", fontWeight: 600, marginBottom: 8 },
  adjustRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12 },
  smallButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  lengthDisplay: { width: 40, textAlign: "center", fontWeight: 700 },
  timerBox: {
    background: "white",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(30,30,60,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 220,
  },
  timerLabel: { fontWeight: 700, marginBottom: 6 },
  timeLeft: { fontSize: 48, fontWeight: 800, letterSpacing: 1 },
  actionsRow: { display: "flex", gap: 12 },
  actionButton: { padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer" },
  footer: { marginTop: 10, opacity: 0.8 },
};
