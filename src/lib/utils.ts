import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add the emotion interface (or import from EmotionCard if preferred)
export interface Emotion {
  name: string;
  score: number;
  color: string;
  emoji?: string;
}

// Color and emoji mapping for emotions
export const emotionConfig: Record<string, {color: string, emoji: string}> = {
  joy: { color: '#FFD700', emoji: '😊' },      // Gold
  sadness: { color: '#6495ED', emoji: '😢' },  // Blue
  anger: { color: '#FF4500', emoji: '😠' },    // Red
  fear: { color: '#800080', emoji: '😨' },     // Purple
  surprise: { color: '#FF69B4', emoji: '😲' }, // Pink
  love: { color: '#FF1493', emoji: '❤️' },     // Deep Pink
  disgust: { color: '#32CD32', emoji: '🤢' },  // Green
  neutral: { color: '#A9A9A9', emoji: '😐' },  // Gray
  // Add more common emotions and variations
  happy: { color: '#FFD700', emoji: '😊' },
  sad: { color: '#6495ED', emoji: '😢' },
  angry: { color: '#FF4500', emoji: '😠' },
  scared: { color: '#800080', emoji: '😨' },
  anxious: { color: '#800080', emoji: '😰' },
  excited: { color: '#FF69B4', emoji: '🤩' },
  worried: { color: '#800080', emoji: '😟' },
  frustrated: { color: '#FF4500', emoji: '😤' }
};

// Enhanced mapper function that handles different backend response formats
export function mapEmotionsFromBackend(backendEmotions: any): Emotion[] {
  console.log("Backend emotions data received:", backendEmotions);
  
  // Handle null/undefined case
  if (!backendEmotions) {
    console.error("Backend emotions data is null or undefined");
    return [];
  }
  
  let emotionsArray: Array<{label: string, score: number}> = [];
  
  // Handle object format: {joy: 0.8, sadness: 0.1, ...}
  if (!Array.isArray(backendEmotions) && typeof backendEmotions === 'object') {
    console.log("Converting object format to array format");
    emotionsArray = Object.entries(backendEmotions).map(([key, value]) => ({
      label: key,
      score: typeof value === 'number' ? value : parseFloat(String(value)) || 0
    }));
  } 
  // Handle array format
  else if (Array.isArray(backendEmotions)) {
    console.log("Processing array format");
    
    // Check if array items have label and score properties
    if (backendEmotions.length > 0 && 
        (backendEmotions[0].label !== undefined || 
         backendEmotions[0].emotion !== undefined || 
         backendEmotions[0].name !== undefined)) {
      emotionsArray = backendEmotions.map(item => {
        // Try to extract label and score using different possible property names
        const label = item.label || item.emotion || item.name;
        const score = item.score || item.confidence || item.value;
        
        return {
          label: String(label),
          score: typeof score === 'number' ? score : parseFloat(String(score)) || 0
        };
      });
    }
    // If array has a different structure, log error and return empty array
    else {
      console.error("Unexpected array structure in backend emotions:", backendEmotions);
      return [];
    }
  }
  
  console.log("Standardized emotions array:", emotionsArray);
  
  // Map to frontend Emotion format
  const mappedEmotions = emotionsArray.map(item => {
    // Use lowercase for case-insensitive matching
    const lowerLabel = item.label.toLowerCase();
    
    // Find matching emotion in config or use default
    const config = emotionConfig[lowerLabel] || { color: '#A9A9A9', emoji: '❓' };
    
    // Determine if score needs normalization (0-1 range)
    // If score is > 1, assume it's a percentage (0-100) and convert to decimal
    const normalizedScore = item.score > 1 ? item.score / 100 : item.score;
    
    return {
      name: item.label,
      score: normalizedScore,
      color: config.color,
      emoji: config.emoji
    };
  }).sort((a, b) => b.score - a.score); // Sort by score descending
  
  console.log("Final mapped emotions:", mappedEmotions);
  return mappedEmotions;
}
