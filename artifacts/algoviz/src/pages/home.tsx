import { Link } from "wouter";
import { Play, Activity, CheckCircle2, Clock, Box } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAlgorithmsWithFallback } from "@/hooks/use-algorithms-data";
import { useLocalProgress } from "@/hooks/use-local-progress";

export default function Home() {
  const { data, isLoading } = useAlgorithmsWithFallback();
  const { progress } = useLocalProgress();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <Activity className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading algorithms...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const algorithms = data.algorithms || [];
  
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-12">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-card">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-abstract.png`} 
            alt="Abstract tech background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 backdrop-blur-sm">
              v1.0 Interactive Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 leading-tight">
              Master Algorithms <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Visually.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Stop trying to compile code in your head. See exactly how data structures change line-by-line and step-by-step.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full shadow-primary/25 shadow-lg" asChild>
                <Link href="/algorithm/bubble-sort">
                  Start Learning <Play className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Algorithm Library</h2>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              {algorithms.length} Available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.map((algo) => {
              const isCompleted = progress[algo.id]?.completed;
              const completedSteps = progress[algo.id]?.highestStepReached || 0;
              const totalSteps = progress[algo.id]?.totalSteps || 0;
              const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

              return (
                <Card key={algo.id} className="group relative border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full bg-gradient-to-b from-card to-background">
                  {isCompleted && (
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className="bg-background rounded-full p-1 border shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-background/50 capitalize">
                        {algo.category.replace('-', ' ')}
                      </Badge>
                      <Badge variant={getDifficultyColor(algo.difficulty) as any} className="capitalize">
                        {algo.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-xl">
                      {algo.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {algo.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-2 rounded-md border border-border/30">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-mono text-xs">{algo.timeComplexity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-2 rounded-md border border-border/30">
                        <Box className="w-4 h-4 text-secondary" />
                        <span className="font-mono text-xs">{algo.spaceComplexity}</span>
                      </div>
                    </div>
                    
                    {progressPercent > 0 && !isCompleted && (
                      <div className="w-full space-y-1 mt-auto">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant={isCompleted ? "secondary" : "default"} className="w-full" asChild>
                      <Link href={`/algorithm/${algo.id}`}>
                        {isCompleted ? "Review" : (progressPercent > 0 ? "Continue" : "Visualize")} <Play className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
