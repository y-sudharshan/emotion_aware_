import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";

export interface Emotion {
  name: string;
  score: number;
  color: string;
  emoji?: string;
}

interface EmotionCardProps {
  emotion: Emotion;
  className?: string;
  index: number;
  isDominant?: boolean; // Add this prop to indicate if this is the dominant emotion
}

const EmotionCard: React.FC<EmotionCardProps> = ({ 
  emotion, 
  className,
  index,
  isDominant = false // Default to false
}) => {
  const animationDelay = `${index * 75}ms`;
  const percentage = Math.round(emotion.score * 100);
  
  useEffect(() => {
    console.log('EmotionCard rendered with data:', { 
      name: emotion.name, 
      score: emotion.score,
      percentage,
      color: emotion.color,
      emoji: emotion.emoji,
      isDominant
    });
  }, [emotion, percentage, isDominant]);
  
  return (
    <div 
      className={cn(
        "rounded-xl p-5 transition-all duration-300 animate-slide-up glass shadow-soft hover:shadow-medium",
        className
      )}
      style={{ animationDelay }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: emotion.color }}
          />
          <h3 className="font-medium capitalize font-sans">
            {emotion.name} {isDominant && emotion.emoji}
          </h3>
        </div>
        <div className="text-lg font-semibold font-display">{percentage}%</div>
      </div>
      
      <div className="mt-3 bg-secondary rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: emotion.color,
            transition: 'width 1s cubic-bezier(0.65, 0, 0.35, 1)'
          }}
        />
      </div>
    </div>
  );
};

export default EmotionCard;