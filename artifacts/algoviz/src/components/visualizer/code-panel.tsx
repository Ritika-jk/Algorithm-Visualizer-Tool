import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  pseudocode: string[];
  activeLine: number;
}

export function CodePanel({ pseudocode, activeLine }: CodePanelProps) {
  return (
    <Card className="h-full flex flex-col border-border/50 shadow-md">
      <CardHeader className="py-4 border-b border-border/30 bg-muted/20 shrink-0">
        <CardTitle className="text-sm flex items-center gap-2 font-display">
          <Code2 className="w-4 h-4 text-primary" />
          Pseudocode
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto bg-[#0d1117]">
        <div className="font-mono text-xs sm:text-sm py-4">
          {pseudocode.map((line, idx) => {
            const isActive = idx === activeLine;
            // Count leading spaces for indentation
            const indentMatch = line.match(/^\s*/);
            const indent = indentMatch ? indentMatch[0].length : 0;
            const content = line.trim();

            return (
              <div 
                key={idx} 
                className={cn(
                  "px-4 py-1 flex transition-colors duration-200",
                  isActive ? "bg-primary/20 border-l-2 border-primary text-primary-foreground shadow-[inset_0_0_15px_rgba(45,212,191,0.1)]" : "text-muted-foreground/80 border-l-2 border-transparent hover:bg-white/5"
                )}
              >
                <div className="w-6 text-right mr-4 opacity-30 select-none">{idx + 1}</div>
                <div style={{ paddingLeft: `${indent * 0.5}rem` }} className="font-medium whitespace-pre">
                  {content}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
