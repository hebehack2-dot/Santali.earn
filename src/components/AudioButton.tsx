import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { generateAudio } from '../lib/gemini';

export function AudioButton({ text, className = '' }: { text: string, className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent clicks
    if (isPlaying || isLoading) return;
    
    setIsLoading(true);
    try {
      const base64Audio = await generateAudio(text);
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audio.onended = () => setIsPlaying(false);
        setIsPlaying(true);
        await audio.play();
      }
    } catch (err: any) {
      console.error("Failed to play audio", err);
      alert(err.message || "Failed to play audio. The text might not be supported.");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={playAudio} 
      disabled={isLoading || isPlaying}
      className={`p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition-colors disabled:opacity-50 ${className}`}
      title="Listen"
    >
      {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} className={isPlaying ? "text-indigo-400" : ""} />}
    </button>
  );
}
