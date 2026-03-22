import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  canStepForward: boolean;
  canStepBack: boolean;
}

export function Controls({
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBack,
  onReset,
  speed,
  onSpeedChange,
  canStepForward,
  canStepBack
}: ControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-xl border border-border/50 bg-card shadow-sm">
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onReset}
          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          title="Reset"
        >
          <RotateCcw />
        </Button>
        
        <div className="h-8 w-px bg-border mx-2" />
        
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={onStepBack} 
          disabled={!canStepBack || isPlaying}
        >
          <SkipBack />
        </Button>
        
        <Button 
          variant={isPlaying ? "secondary" : "default"} 
          size="lg" 
          onClick={onPlayPause}
          className="w-24 shadow-md"
        >
          {isPlaying ? <><Pause className="w-5 h-5 mr-1" /> Pause</> : <><Play className="w-5 h-5 mr-1" /> Play</>}
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={onStepForward} 
          disabled={!canStepForward || isPlaying}
        >
          <SkipForward />
        </Button>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-64 bg-muted/30 p-2 px-4 rounded-lg border border-border/30">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Speed</span>
        <Slider 
          value={[1000 - speed]} 
          min={100} 
          max={900} 
          step={100}
          onValueChange={(vals) => onSpeedChange(1000 - vals[0])}
        />
      </div>

    </div>
  );
}
