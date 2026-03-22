import { useListAlgorithms, useGetAlgorithm } from "@workspace/api-client-react";
import type { Algorithm } from "@workspace/api-client-react/src/generated/api.schemas";

// --- MOCK FALLBACK DATA ---
// We use this if the API is unreachable or hasn't been seeded yet,
// ensuring the UI always looks stunning and functional.
const MOCK_ALGORITHMS: Algorithm[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    difficulty: "beginner",
    description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    tags: ["sorting", "comparison", "in-place"],
    pseudocode: [
      "function bubbleSort(array):",
      "  n = length(array)",
      "  for i from 0 to n - 1:",
      "    for j from 0 to n - i - 1:",
      "      if array[j] > array[j + 1]:",
      "        swap(array[j], array[j + 1])",
      "    mark array[n - i - 1] as sorted",
      "  return array"
    ]
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    difficulty: "intermediate",
    description: "An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    tags: ["searching", "divide-and-conquer"],
    pseudocode: [
      "function binarySearch(array, target):",
      "  left = 0, right = length(array) - 1",
      "  while left <= right:",
      "    mid = floor((left + right) / 2)",
      "    if array[mid] == target:",
      "      return mid",
      "    if array[mid] < target:",
      "      left = mid + 1",
      "    else:",
      "      right = mid - 1",
      "  return -1"
    ]
  },
  {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "graph",
    difficulty: "intermediate",
    description: "An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all nodes at the present depth prior to moving on to the nodes at the next depth level.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    tags: ["graph", "traversal", "queue"],
    pseudocode: [
      "function BFS(graph, startNode):",
      "  queue = [startNode], visited = {startNode}",
      "  while queue is not empty:",
      "    current = queue.dequeue()",
      "    process(current)",
      "    for each neighbor of current:",
      "      if neighbor not in visited:",
      "        visited.add(neighbor)",
      "        queue.enqueue(neighbor)",
      "  return visited"
    ]
  }
];

export function useAlgorithmsWithFallback() {
  const query = useListAlgorithms({
    query: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    }
  });

  // If API succeeds and has data, use it. Otherwise use mock data.
  const algorithms = query.data?.algorithms && query.data.algorithms.length > 0 
    ? query.data.algorithms 
    : MOCK_ALGORITHMS;

  return {
    ...query,
    data: { algorithms },
    isLoading: query.isLoading,
  };
}

export function useAlgorithmWithFallback(id: string) {
  const query = useGetAlgorithm(id, {
    query: {
      retry: 1,
      enabled: !!id,
    }
  });

  const algorithm = query.data || MOCK_ALGORITHMS.find(a => a.id === id);

  return {
    ...query,
    data: algorithm,
    isLoading: query.isLoading && !algorithm, // if we found a fallback immediately, don't show loading
  };
}
