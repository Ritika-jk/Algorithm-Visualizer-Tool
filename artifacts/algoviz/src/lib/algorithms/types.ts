export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: number;
  to: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ArrayElement {
  id: string;
  value: number;
}

export interface CipherChar {
  char: string;
  index: number;
  transformed?: string;
  active?: boolean;
  done?: boolean;
}

export interface AlgoState {
  // Common
  activeLine: number;
  explanation: string;

  // Array based (Sorting, Linear Search, Binary Search)
  array?: ArrayElement[];
  comparing?: number[];
  swapped?: number[];
  sorted?: number[];
  found?: number;

  // Sliding Window / Two Pointer
  windowLeft?: number;
  windowRight?: number;
  pointerLeft?: number;
  pointerRight?: number;
  windowSum?: number;
  windowBest?: number;
  highlightRange?: number[];
  currentMax?: number;

  // Linked list / cycle (Floyd's)
  linkedList?: number[];
  slowPointer?: number;
  fastPointer?: number;
  cycleNodes?: number[];
  cycleStart?: number;

  // Graph based (BFS, DFS)
  graph?: GraphData;
  activeNodes?: number[];
  visitedNodes?: number[];
  queue?: number[];
  stack?: number[];
  path?: number[];

  // Cipher / Hashing
  cipherChars?: CipherChar[];
  plaintextChars?: CipherChar[];
  ciphertextDisplay?: string;
  keyDisplay?: string;
  extraInfo?: Record<string, string>;
  matrixRows?: string[][];
  railFence?: { char: string; rail: number; index: number; done: boolean }[];
  railCount?: number;
}

export interface AlgorithmEngine {
  id: string;
  generateSteps: (input: any) => Generator<AlgoState, void, unknown>;
  defaultInput: any;
}
