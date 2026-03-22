import { useState, useEffect } from 'react';

export interface LocalProgress {
  [algorithmId: string]: {
    completed: boolean;
    highestStepReached: number;
    totalSteps: number;
    lastVisited: string;
  }
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>({});

  useEffect(() => {
    const stored = localStorage.getItem('algoviz_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse local progress');
      }
    }
  }, []);

  const saveProgress = (algorithmId: string, currentStep: number, totalSteps: number, completed: boolean) => {
    setProgress(prev => {
      const existing = prev[algorithmId];
      const highestStep = existing ? Math.max(existing.highestStepReached, currentStep) : currentStep;
      const isCompleted = (existing?.completed) || completed;
      
      const newProgress = {
        ...prev,
        [algorithmId]: {
          completed: isCompleted,
          highestStepReached: highestStep,
          totalSteps,
          lastVisited: new Date().toISOString()
        }
      };
      
      localStorage.setItem('algoviz_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return { progress, saveProgress };
}
