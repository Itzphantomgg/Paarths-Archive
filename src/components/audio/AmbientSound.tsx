"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const toggleSound = () => {
    if (isPlaying) {
      // Fade out
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.4);
        setTimeout(() => {
          if (audioCtxRef.current?.state !== "closed") {
            audioCtxRef.current?.suspend();
          }
          setIsPlaying(false);
        }, 500);
      }
    } else {
      // Start audio context
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Create procedural warm tape hiss / vinyl dust buffer
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let lastOut = 0.0;

          // Pink/brown noise algorithm for warm vinyl rumble & tape hiss
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // Gain
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          // Low-pass filter for soft warmth
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0, ctx.currentTime);

          whiteNoise.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          gainNodeRef.current = gainNode;
          noiseNodeRef.current = whiteNoise;
          whiteNoise.start(0);
        }

        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        if (gainNodeRef.current && audioCtxRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.04, audioCtxRef.current.currentTime, 0.5);
        }
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={toggleSound}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#080808]/80 hover:bg-neutral-900/90 hover:border-white/30 backdrop-blur-md transition-all text-neutral-400 hover:text-neutral-200 group focus:outline-none"
        title={isPlaying ? "Mute Tape Ambience" : "Play Ambient Tape Hiss"}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-neutral-200 animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition" />
        )}
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase">
          {isPlaying ? "TAPE AMBIENCE ON" : "AMBIENCE OFF"}
        </span>
      </button>
    </div>
  );
}
