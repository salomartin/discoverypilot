import "./VoiceVisualizer.css";

import { WavRecorder, WavStreamPlayer } from "wavtools";
import { useState, useEffect } from "react";
import { normalizeArray } from "../utils/useWaveRenderer.client";

interface VoiceVisualizerProps {
  wavRef: React.RefObject<WavRecorder | WavStreamPlayer>;
  bars?: number;
}

export const VoiceVisualizer = ({ wavRef, bars = 5 }: VoiceVisualizerProps) => {
  const [frequencies, setFrequencies] = useState<Float32Array>(
    new Float32Array([0])
  );
  const spacing = 0.5; // Spacing between bars
  const viewWidth = 16;
  const viewHeight = 9;
  const normalizedFrequencies = normalizeArray(frequencies, bars, false);
  const totalSpacing = spacing * (normalizedFrequencies.length - 1);
  const barWidth = (viewWidth - totalSpacing) / normalizedFrequencies.length;

  useEffect(() => {
    let isMounted = true;

    const updateFrequencies = () => {
      if (wavRef.current && (
        (wavRef.current instanceof WavRecorder && wavRef.current.processor) ||
        (wavRef.current instanceof WavStreamPlayer && wavRef.current.analyser)
      )) {
        try {
          if (isMounted) {
            setFrequencies(wavRef.current.getFrequencies("voice").values);
          }
        } catch (error) {
          console.error("Error fetching frequencies:", error);
        }
      }
      requestAnimationFrame(updateFrequencies);
    };

    updateFrequencies();

    return () => {
      isMounted = false;
    };
  }, [wavRef]);

  return (
    <svg
      className="voice-visualizer"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {normalizedFrequencies.map((freq, index) => {
        const amplitude = Math.abs(freq);
        // Subtract barWidth to account for the round caps at both ends
        const maxHeight = viewHeight - barWidth;
        const height = Math.max(0, Math.min(maxHeight, amplitude * viewHeight));
        const x = index * (barWidth + spacing) + barWidth / 2;
        const y = (viewHeight - height) / 2;
        return (
          <path
            key={index}
            className="bar"
            d={`M${x} ${y}v${height}`}
            strokeWidth={barWidth}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
