import React, { useState } from 'react';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';
import EmotionResult from '@/components/EmotionResult';
import { Emotion } from '@/components/EmotionCard';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { mapEmotionsFromBackend } from '@/lib/utils'; // Import the function you added to utils.ts

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedText, setAnalyzedText] = useState('');
  const [emotions, setEmotions] = useState<Emotion[] | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null); // For debugging purposes

  // Function to call backend API
  const handleAnalyze = async (text: string) => {
    try {
      setIsAnalyzing(true);
      setAnalyzedText(text);
      setDebugData(null); // Reset debug data

      console.log("Sending text for analysis:", text);

      const response = await fetch("http://localhost:5000/analyze_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      // Log response status
      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to analyze text: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);
      setDebugData(data); // Store for debugging

      // Check if emotions data is present
      if (!data || !data.emotions) {
        console.error("API response missing emotions:", data);
        toast.error("Invalid response from server");
        return;
      }

      // Use the mapEmotionsFromBackend function to transform the data
      const formattedEmotions = mapEmotionsFromBackend(data.emotions);
      console.log("Formatted emotions:", formattedEmotions);

      // Verify emotions are valid before setting state
      if (formattedEmotions && formattedEmotions.length > 0) {
        setEmotions(formattedEmotions);
      } else {
        console.error("No valid emotions found after formatting");
        toast.error("No emotions detected in the text");
      }
      
    } catch (error) {
      toast.error("An error occurred while analyzing the text.");
      console.error("Error analyzing text:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setEmotions(null);
    setAnalyzedText('');
    setDebugData(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />

      <main className="flex-1 container py-8 px-4 max-w-4xl mx-auto">
        {emotions ? (
          <div className="space-y-8">
            <EmotionResult emotions={emotions} text={analyzedText} />

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline transition-all"
              >
                Analyze another text
              </button>
            </div>
            
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-focus-in">
                Text Emotion Analysis
              </h1>
              <p
                className="text-muted-foreground max-w-md mx-auto text-focus-in"
                style={{ animationDelay: "200ms" }}
              >
                Understand the emotional tone of any text with AI-powered
                analysis.
              </p>
            </div>

            <TextInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container text-center text-sm text-muted-foreground">
          <p>A minimalist emotion analysis tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
