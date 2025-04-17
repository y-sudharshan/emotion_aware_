
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TextInputProps {
  className?: string;
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ 
  className, 
  onAnalyze,
  isLoading
}) => {
  const [text, setText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto px-4 animate-fade-in", 
      className
    )}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass rounded-xl p-1 transition-all duration-300 shadow-soft hover:shadow-medium">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze emotions..."
            className="w-full min-h-[200px] p-4 bg-transparent rounded-lg resize-none outline-none placeholder:text-muted-foreground/70 focus:ring-0"
            disabled={isLoading}
          />
          
          <div className="flex justify-end px-4 pb-3">
            <Button 
              type="submit"
              disabled={!text.trim() || isLoading}
              className="rounded-full px-6 py-2 transition-all duration-300 scale-in"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          Enter any text and we'll analyze the emotions expressed
        </p>
      </form>
    </div>
  );
};

export default TextInput;
