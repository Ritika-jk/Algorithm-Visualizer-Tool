import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { useAlgorithmWithFallback } from "@/hooks/use-algorithms-data";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { Canvas } from "@/components/visualizer/canvas";
import { Controls } from "@/components/visualizer/controls";
import { CodePanel } from "@/components/visualizer/code-panel";
import { AlgoState } from "@/lib/algorithms/types";
import {
  bubbleSort, mergeSort, quickSort, insertionSort,
  linearSearch, binarySearch,
  slidingWindowMaxSum, twoPointers, kadanesAlgorithm, floydCycleDetection,
  bfs, dfs,
  caesarCipher, vigenerecipher, rot13, xorCipher, atbashCipher,
  railFenceCipher, base64Encoding, md5Conceptual, sha256Conceptual, rsaConcept,
  defaultArray, defaultGraph, defaultLinkedList,
  defaultSlidingWindowK, defaultTwoPointersTarget,
  defaultCipherText, defaultCipherKey, defaultCipherShift, defaultRailCount,
} from "@/lib/algorithms/engines";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

function getGenerator(id: string) {
  switch (id) {
    // Sorting
    case 'bubble-sort':     return bubbleSort(defaultArray);
    case 'merge-sort':      return mergeSort(defaultArray);
    case 'quick-sort':      return quickSort(defaultArray);
    case 'insertion-sort':  return insertionSort(defaultArray);
    // Searching
    case 'linear-search':   return linearSearch(defaultArray, 67);
    case 'binary-search':   return binarySearch(defaultArray, 67);
    // DSA Patterns
    case 'sliding-window':  return slidingWindowMaxSum(defaultArray, defaultSlidingWindowK);
    case 'two-pointers':    return twoPointers(defaultArray, defaultTwoPointersTarget);
    case 'kadanes':         return kadanesAlgorithm(defaultArray);
    case 'floyd-cycle':     return floydCycleDetection(defaultLinkedList);
    // Graph
    case 'bfs':             return bfs(defaultGraph, 1);
    case 'dfs':             return dfs(defaultGraph, 1);
    // Ciphers
    case 'caesar':          return caesarCipher(defaultCipherText, defaultCipherShift);
    case 'vigenere':        return vigenerecipher(defaultCipherText, defaultCipherKey);
    case 'rot13':           return rot13(defaultCipherText);
    case 'xor':             return xorCipher(defaultCipherText, 'K');
    case 'atbash':          return atbashCipher(defaultCipherText);
    case 'rail-fence':      return railFenceCipher(defaultCipherText + "WORLD", defaultRailCount);
    case 'base64':          return base64Encoding(defaultCipherText);
    case 'md5':             return md5Conceptual(defaultCipherText);
    case 'sha256':          return sha256Conceptual(defaultCipherText);
    case 'rsa':             return rsaConcept();
    default:
      return (function* () { yield { activeLine: 0, explanation: "Visualization coming soon!" }; })();
  }
}

export default function AlgorithmVisualizer() {
  const [, params] = useRoute("/algorithm/:id");
  const id = params?.id || "";
  const { data: algorithm, isLoading } = useAlgorithmWithFallback(id);
  const { saveProgress } = useLocalProgress();

  const [steps, setSteps] = useState<AlgoState[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!algorithm) return;
    setIsPlaying(false);
    setCurrentStepIndex(0);
    const generator = getGenerator(id);
    const generatedSteps: AlgoState[] = [];
    let result = generator.next();
    while (!result.done) {
      generatedSteps.push(result.value as AlgoState);
      result = generator.next();
    }
    setSteps(generatedSteps);
  }, [algorithm, id]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  useEffect(() => {
    if (steps.length > 0) {
      saveProgress(id, currentStepIndex, steps.length, currentStepIndex === steps.length - 1);
    }
  }, [currentStepIndex, steps.length, id]);

  if (isLoading || !algorithm) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-[60vh] bg-muted rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  const currentState = steps[currentStepIndex] || { activeLine: 0, explanation: "Initializing..." };

  return (
    <MainLayout>
      <div className="h-full flex flex-col space-y-4 max-w-[1600px] mx-auto pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" asChild>
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Library</Link>
            </Button>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-display font-bold">{algorithm.name}</h1>
              <Badge variant="outline" className="capitalize border-primary/30 text-primary">
                {algorithm.category.replace(/-/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">{algorithm.description}</p>
          </div>
          <div className="flex gap-4 text-sm font-mono bg-card px-4 py-2 rounded-lg border border-border/50 shrink-0">
            <div><span className="text-muted-foreground mr-1">Time:</span><span className="text-primary">{algorithm.timeComplexity}</span></div>
            <div><span className="text-muted-foreground mr-1">Space:</span><span className="text-secondary">{algorithm.spaceComplexity}</span></div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex-1 relative rounded-xl border border-border/50 overflow-hidden shadow-lg">
              <Canvas state={currentState} category={algorithm.category} />
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur border border-border/50 px-3 py-1.5 rounded-full text-xs font-mono font-medium shadow-sm">
                Step {currentStepIndex + 1} / {steps.length}
              </div>
            </div>
            <Controls
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={() => setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1))}
              onStepBack={() => setCurrentStepIndex(p => Math.max(p - 1, 0))}
              onReset={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
              speed={speed}
              onSpeedChange={setSpeed}
              canStepBack={currentStepIndex > 0}
              canStepForward={currentStepIndex < steps.length - 1}
            />
          </div>

          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1 min-h-[300px]">
              <CodePanel pseudocode={algorithm.pseudocode} activeLine={currentState.activeLine} />
            </div>
            <Card className="shrink-0 border-border/50 shadow-md bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-4 sm:p-6 flex gap-4 items-start">
                <div className="mt-1 shrink-0 p-2 bg-primary/10 rounded-full border border-primary/20">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Current Action</h4>
                  <p className="text-sm md:text-base leading-relaxed text-foreground">{currentState.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
