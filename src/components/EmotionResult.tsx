import React from 'react';
import { cn } from "@/lib/utils";
import { Emotion } from './EmotionCard';
import EmotionCard from './EmotionCard';

interface EmotionResultProps {
  emotions: Emotion[];
  className?: string;
  text: string;
}

const EmotionResult: React.FC<EmotionResultProps> = ({ 
  emotions, 
  className,
  text
}) => {
  // Find dominant emotion (highest score)
  const dominantEmotion = emotions[0]; // Already sorted in mapEmotionsFromBackend
  
  return (
    <div className={cn("w-full max-w-2xl mx-auto px-4 space-y-6", className)}>
      <div className="text-center space-y-2 animate-fade-in">
        <div className="text-sm uppercase tracking-wider text-muted-foreground font-sans">Analysis Results</div>
        <h2 className="text-2xl font-display font-semibold">
          Dominant emotion: <span style={{ color: dominantEmotion.color }} className="capitalize">
            {dominantEmotion.name} {dominantEmotion.emoji}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto font-sans">
          The text you provided appears to primarily express {dominantEmotion.name.toLowerCase()}.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {emotions.map((emotion, index) => (
          <EmotionCard 
            key={emotion.name} 
            emotion={emotion} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default EmotionResult;
