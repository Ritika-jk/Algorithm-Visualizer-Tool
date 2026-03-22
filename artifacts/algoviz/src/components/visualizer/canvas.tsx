import { motion, AnimatePresence } from "framer-motion";
import { AlgoState, GraphData } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

interface CanvasProps {
  state: AlgoState;
  category: string;
}

export function Canvas({ state, category }: CanvasProps) {

  // -------------------------------------------------------------------
  // ARRAY (sorting / searching)
  // -------------------------------------------------------------------
  const renderArray = () => {
    if (!state.array) return null;
    const maxVal = Math.max(...state.array.map(item => item.value), 100);
    return (
      <div className="flex items-end justify-center h-full w-full gap-1 sm:gap-2 md:gap-3 px-6 pb-6 pt-16">
        <AnimatePresence>
          {state.array.map((item, index) => {
            const isComparing = state.comparing?.includes(index);
            const isSwapped = state.swapped?.includes(index);
            const isSorted = state.sorted?.includes(index);
            const isFound = state.found === index;
            const inWindow = state.windowLeft !== undefined && state.windowRight !== undefined && index >= state.windowLeft && index <= state.windowRight;
            const isPointerLeft = state.pointerLeft === index;
            const isPointerRight = state.pointerRight === index;
            const heightPercent = (item.value / maxVal) * 100;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative flex flex-col items-center justify-end flex-1 max-w-[60px] group"
              >
                {(isPointerLeft || isPointerRight) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "absolute -top-8 text-xs font-bold px-1.5 py-0.5 rounded",
                      isPointerLeft ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                    )}
                  >
                    {isPointerLeft ? 'L' : 'R'}
                  </motion.div>
                )}
                {inWindow && !isPointerLeft && !isPointerRight && (
                  <div className="absolute -top-1 left-0 right-0 h-1 rounded-full bg-primary/60" />
                )}
                <span className="absolute top-0 font-mono text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
                  {item.value}
                </span>
                <motion.div
                  className={cn(
                    "w-full rounded-t-md border-t border-l border-r transition-colors duration-200",
                    isFound ? "bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]" :
                    isSwapped ? "bg-rose-500 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]" :
                    isComparing ? "bg-amber-400 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]" :
                    isSorted ? "bg-primary/80 border-primary" :
                    isPointerLeft ? "bg-cyan-500/70 border-cyan-400" :
                    isPointerRight ? "bg-violet-500/70 border-violet-400" :
                    inWindow ? "bg-primary/40 border-primary/50" :
                    "bg-secondary/40 border-secondary/50"
                  )}
                  style={{ height: `${Math.max(heightPercent, 5)}%` }}
                />
                <div className="mt-2 text-[10px] text-muted-foreground font-mono">[{index}]</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // GRAPH (BFS / DFS)
  // -------------------------------------------------------------------
  const renderGraph = () => {
    if (!state.graph) return null;
    const { nodes, edges } = state.graph;
    return (
      <div className="relative w-full h-full p-8 flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)!;
            const toNode = nodes.find(n => n.id === edge.to)!;
            const isActiveEdge = state.activeNodes?.includes(edge.from) && state.activeNodes?.includes(edge.to);
            return (
              <motion.line key={`edge-${i}`} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
                stroke={isActiveEdge ? "hsl(var(--primary))" : "hsl(var(--muted-foreground)/0.3)"}
                strokeWidth={isActiveEdge ? 1 : 0.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            );
          })}
          {nodes.map(node => {
            const isActive = state.activeNodes?.includes(node.id);
            const isVisited = state.visitedNodes?.includes(node.id);
            const inQueue = state.queue?.includes(node.id);
            let fill = "hsl(var(--card))", stroke = "hsl(var(--border))", textColor = "hsl(var(--foreground))", sw = 0.5;
            if (isActive) { fill = "hsl(var(--primary)/0.2)"; stroke = "hsl(var(--primary))"; sw = 1.5; textColor = "hsl(var(--primary))"; }
            else if (isVisited) { fill = "hsl(var(--secondary)/0.8)"; stroke = "hsl(var(--secondary))"; textColor = "white"; }
            else if (inQueue) { fill = "hsl(var(--muted))"; stroke = "#f59e0b"; sw = 1; }
            return (
              <g key={`node-${node.id}`}>
                <motion.circle cx={node.x} cy={node.y} r={5} fill={fill} stroke={stroke} strokeWidth={sw} layout />
                <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="3" fontWeight="bold" fill={textColor} className="font-mono pointer-events-none select-none">{node.label}</text>
              </g>
            );
          })}
        </svg>

        {/* Queue / Stack display */}
        {(state.queue || state.stack) && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-card/80 backdrop-blur border border-border/50 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">{state.queue ? 'Queue:' : 'Stack:'}</span>
              <div className="flex gap-1">
                {(state.queue || state.stack || []).map((nodeId, i) => (
                  <span key={i} className="text-xs font-bold font-mono bg-primary/10 text-primary border border-primary/30 rounded px-1.5 py-0.5">{nodeId}</span>
                ))}
                {(state.queue || state.stack || []).length === 0 && <span className="text-xs text-muted-foreground italic">empty</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------
  // LINKED LIST (Floyd's Cycle)
  // -------------------------------------------------------------------
  const renderLinkedList = () => {
    if (!state.linkedList) return null;
    const list = state.linkedList;
    const CYCLE_BACK_IDX = 2;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
        <div className="flex items-center gap-0 flex-wrap justify-center">
          {list.map((val, i) => {
            const isSlow = state.slowPointer === i;
            const isFast = state.fastPointer === i;
            const isCycleStart = state.cycleStart === i;
            return (
              <div key={i} className="flex items-center">
                <motion.div
                  layout
                  className={cn(
                    "relative w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-sm font-bold font-mono transition-all duration-300",
                    isCycleStart ? "border-rose-500 bg-rose-500/20 text-rose-400" :
                    isSlow && isFast ? "border-yellow-400 bg-yellow-400/20 text-yellow-300" :
                    isSlow ? "border-cyan-400 bg-cyan-400/20 text-cyan-300" :
                    isFast ? "border-violet-400 bg-violet-400/20 text-violet-300" :
                    "border-border bg-card text-foreground"
                  )}
                >
                  {val}
                  <div className="absolute -top-5 flex gap-0.5">
                    {isSlow && <span className="text-[9px] text-cyan-400 font-bold">S</span>}
                    {isFast && <span className="text-[9px] text-violet-400 font-bold">F</span>}
                  </div>
                  <div className="absolute -bottom-4 text-[9px] text-muted-foreground">[{i}]</div>
                </motion.div>
                {i < list.length - 1 ? (
                  <div className="w-6 h-0.5 bg-border flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg width="60" height="30" className="overflow-visible">
                      <path d={`M 0 15 C 20 -5 40 -5 55 15`} stroke="#f43f5e" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
                      <defs>
                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L6,3 z" fill="#f43f5e" />
                        </marker>
                      </defs>
                      <text x="28" y="4" fontSize="7" fill="#f43f5e" textAnchor="middle">cycle to [{CYCLE_BACK_IDX}]</text>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-cyan-400/30 border border-cyan-400" /><span className="text-muted-foreground">Slow pointer</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-violet-400/30 border border-violet-400" /><span className="text-muted-foreground">Fast pointer</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" /><span className="text-muted-foreground">Cycle start</span></div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // CIPHER (character-by-character)
  // -------------------------------------------------------------------
  const renderCipher = () => {
    const chars = state.cipherChars;
    if (!chars) {
      // RSA conceptual — no chars, just show key info
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">Key Information</div>
            {state.extraInfo && Object.entries(state.extraInfo).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 bg-card border border-border/50 rounded-lg px-4 py-2 font-mono text-sm">
                <span className="text-primary min-w-[100px] text-right">{k}:</span>
                <span className="text-foreground">{v}</span>
              </div>
            ))}
          </div>
          {state.ciphertextDisplay && (
            <div className="mt-4 bg-primary/10 border border-primary/30 rounded-lg px-6 py-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Output</div>
              <div className="font-mono text-primary text-lg font-bold">{state.ciphertextDisplay}</div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
        {/* Input chars */}
        <div className="space-y-1 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Plaintext</div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {chars.map((c, i) => (
              <motion.div
                key={i}
                layout
                className={cn(
                  "w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-base transition-all duration-300",
                  c.active ? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]" :
                  c.done ? "border-primary/40 bg-primary/10 text-primary" :
                  "border-border/50 bg-card/50 text-muted-foreground"
                )}
              >
                {c.char === ' ' ? '·' : c.char}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <div className="h-0.5 w-16 bg-border" />
          <span className="font-mono">{state.keyDisplay}</span>
          <div className="h-0.5 w-16 bg-border" />
        </div>

        {/* Output chars */}
        <div className="space-y-1 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Ciphertext</div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {chars.map((c, i) => (
              <motion.div
                key={i}
                layout
                className={cn(
                  "w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-base transition-all duration-300",
                  c.done && c.transformed ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400" :
                  c.active && c.transformed ? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]" :
                  "border-border/20 bg-card/20 text-muted-foreground/30"
                )}
              >
                {c.transformed || (c.done ? '' : '?')}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Extra bit info */}
        {state.extraInfo && (
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {Object.entries(state.extraInfo).map(([k, v]) => (
              <div key={k} className="bg-card border border-border/40 rounded px-2 py-1 text-xs font-mono">
                <span className="text-muted-foreground">{k}: </span>
                <span className="text-foreground">{v}</span>
              </div>
            ))}
          </div>
        )}

        {state.ciphertextDisplay && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-6 py-2 text-center">
            <div className="font-mono text-primary font-bold tracking-widest">{state.ciphertextDisplay}</div>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------
  // RAIL FENCE
  // -------------------------------------------------------------------
  const renderRailFence = () => {
    if (!state.railFence || !state.railCount) return renderCipher();
    const rails = state.railCount;
    const COLORS = ['text-cyan-400 border-cyan-500/50 bg-cyan-500/10', 'text-violet-400 border-violet-500/50 bg-violet-500/10', 'text-amber-400 border-amber-500/50 bg-amber-500/10', 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10'];
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{rails}-Rail Zigzag Pattern</div>
        {Array.from({ length: rails }).map((_, r) => (
          <div key={r} className="flex items-center gap-1">
            <span className={cn("text-xs font-mono w-14 text-right mr-2", COLORS[r % COLORS.length].split(' ')[0])}>Rail {r}:</span>
            <div className="flex gap-1 flex-wrap">
              {state.railFence!.filter(f => f.rail === r).map((f, i) => (
                <motion.div key={i} layout className={cn("w-8 h-8 rounded border-2 flex items-center justify-center font-mono font-bold text-sm transition-all", COLORS[r % COLORS.length], !f.done && "opacity-30")}>
                  {f.char}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {state.ciphertextDisplay && (
          <div className="mt-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-2 text-center">
            <div className="text-xs text-muted-foreground mb-0.5">Ciphertext (read row-by-row)</div>
            <div className="font-mono text-primary font-bold tracking-widest">{state.ciphertextDisplay}</div>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------
  // DISPATCH
  // -------------------------------------------------------------------
  return (
    <div className="w-full h-full bg-[#090a0f] rounded-xl overflow-hidden relative shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {(category === 'sorting' || category === 'searching' || category === 'dsa-pattern') && state.array && renderArray()}
      {category === 'graph' && renderGraph()}
      {category === 'dsa-pattern' && state.linkedList && renderLinkedList()}
      {(category === 'cipher') && state.railFence ? renderRailFence() : null}
      {(category === 'cipher') && !state.railFence ? renderCipher() : null}
    </div>
  );
}
