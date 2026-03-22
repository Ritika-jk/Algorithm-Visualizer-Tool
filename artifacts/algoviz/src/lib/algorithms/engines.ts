import { AlgoState, ArrayElement, GraphData } from "./types";

// ========================================================
// SORTING ALGORITHMS
// ========================================================

export function* bubbleSort(initialArray: ArrayElement[]): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;
  yield { array: [...arr], activeLine: 0, explanation: "Starting Bubble Sort." };
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...arr], comparing: [j, j + 1], activeLine: 3, explanation: `Comparing arr[${j}]=${arr[j].value} and arr[${j+1}]=${arr[j+1].value}.` };
      if (arr[j].value > arr[j + 1].value) {
        const temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
        yield { array: [...arr], swapped: [j, j + 1], activeLine: 5, explanation: `${arr[j+1].value} > ${arr[j].value} — swapping them.` };
      }
    }
    const sortedSoFar = Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx);
    yield { array: [...arr], sorted: sortedSoFar, activeLine: 2, explanation: `Pass ${i+1} done. ${arr[n-1-i].value} is in its final position.` };
  }
  yield { array: [...arr], sorted: Array.from({ length: n }, (_, idx) => idx), activeLine: 6, explanation: "Array fully sorted!" };
}

export function* mergeSort(initialArray: ArrayElement[]): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;
  yield { array: [...arr], activeLine: 0, explanation: "Starting Merge Sort — divide and conquer." };

  function* mergeSortHelper(a: ArrayElement[], left: number, right: number): Generator<AlgoState, void, unknown> {
    if (right - left <= 1) {
      yield { array: [...arr], sorted: [left], activeLine: 1, explanation: `Subarray of length 1 at index ${left} is trivially sorted.` };
      return;
    }
    const mid = Math.floor((left + right) / 2);
    yield { array: [...arr], comparing: Array.from({ length: right - left }, (_, i) => left + i), activeLine: 2, explanation: `Dividing array from index ${left} to ${right - 1} at midpoint ${mid}.` };
    yield* mergeSortHelper(a, left, mid);
    yield* mergeSortHelper(a, mid, right);
    // merge
    const leftPart = arr.slice(left, mid).map(e => ({ ...e }));
    const rightPart = arr.slice(mid, right).map(e => ({ ...e }));
    let i = 0, j = 0, k = left;
    while (i < leftPart.length && j < rightPart.length) {
      yield { array: [...arr], comparing: [left + i, mid + j], activeLine: 9, explanation: `Merging: comparing ${leftPart[i].value} (left) and ${rightPart[j].value} (right).` };
      if (leftPart[i].value <= rightPart[j].value) {
        arr[k++] = leftPart[i++];
      } else {
        arr[k++] = rightPart[j++];
      }
      yield { array: [...arr], swapped: [k - 1], activeLine: 11, explanation: `Placed ${arr[k-1].value} into merged position ${k-1}.` };
    }
    while (i < leftPart.length) { arr[k++] = leftPart[i++]; }
    while (j < rightPart.length) { arr[k++] = rightPart[j++]; }
    const mergedIndices = Array.from({ length: right - left }, (_, idx) => left + idx);
    yield { array: [...arr], sorted: mergedIndices, activeLine: 14, explanation: `Merged subarray [${left}..${right-1}] successfully.` };
  }

  yield* mergeSortHelper(arr, 0, n);
  yield { array: [...arr], sorted: Array.from({ length: n }, (_, i) => i), activeLine: 0, explanation: "Merge Sort complete! Array is fully sorted." };
}

export function* quickSort(initialArray: ArrayElement[]): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;
  yield { array: [...arr], activeLine: 0, explanation: "Starting Quick Sort. Will select pivot and partition." };

  function* quickSortHelper(a: ArrayElement[], low: number, high: number): Generator<AlgoState, void, unknown> {
    if (low >= high) return;
    const pivot = a[high];
    yield { array: [...arr], comparing: [high], activeLine: 2, explanation: `Pivot selected: ${pivot.value} at index ${high}.` };
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: [...arr], comparing: [j, high], activeLine: 6, explanation: `Comparing arr[${j}]=${a[j].value} with pivot=${pivot.value}.` };
      if (a[j].value <= pivot.value) {
        i++;
        const temp = a[i]; a[i] = a[j]; a[j] = temp;
        yield { array: [...arr], swapped: [i, j], activeLine: 8, explanation: `${a[j].value} ≤ pivot. Swapping arr[${i}] and arr[${j}].` };
      }
    }
    const temp = a[i + 1]; a[i + 1] = a[high]; a[high] = temp;
    const pivotIdx = i + 1;
    yield { array: [...arr], sorted: [pivotIdx], activeLine: 10, explanation: `Pivot ${pivot.value} placed in final position ${pivotIdx}.` };
    yield* quickSortHelper(a, low, pivotIdx - 1);
    yield* quickSortHelper(a, pivotIdx + 1, high);
  }

  yield* quickSortHelper(arr, 0, n - 1);
  yield { array: [...arr], sorted: Array.from({ length: n }, (_, i) => i), activeLine: 0, explanation: "Quick Sort complete!" };
}

export function* insertionSort(initialArray: ArrayElement[]): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  yield { array: [...arr], activeLine: 0, explanation: "Starting Insertion Sort. Left portion will grow as sorted." };
  for (let i = 1; i < arr.length; i++) {
    const key = { ...arr[i] };
    yield { array: [...arr], comparing: [i], activeLine: 2, explanation: `Picking element ${key.value} at index ${i} as the key to insert.` };
    let j = i - 1;
    while (j >= 0 && arr[j].value > key.value) {
      yield { array: [...arr], comparing: [j, j + 1], activeLine: 4, explanation: `${arr[j].value} > ${key.value}, shift ${arr[j].value} one position right.` };
      arr[j + 1] = { ...arr[j] };
      arr[j] = key;
      j--;
      yield { array: [...arr], swapped: [j + 1], activeLine: 5, explanation: `Shifted. Key ${key.value} moves left.` };
    }
    arr[j + 1] = key;
    const sortedSoFar = Array.from({ length: i + 1 }, (_, k) => k);
    yield { array: [...arr], sorted: sortedSoFar, activeLine: 7, explanation: `${key.value} inserted at index ${j+1}. First ${i+1} elements are sorted.` };
  }
  yield { array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i), activeLine: 0, explanation: "Insertion Sort complete!" };
}

// ========================================================
// SEARCHING ALGORITHMS
// ========================================================

export function* linearSearch(initialArray: ArrayElement[], target: number): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  yield { array: [...arr], activeLine: 0, explanation: `Searching for value ${target} one element at a time.` };
  for (let i = 0; i < arr.length; i++) {
    yield { array: [...arr], comparing: [i], activeLine: 1, explanation: `Checking index ${i}: arr[${i}] = ${arr[i].value}.` };
    if (arr[i].value === target) {
      yield { array: [...arr], found: i, activeLine: 2, explanation: `Found ${target} at index ${i}!` };
      return;
    }
    yield { array: [...arr], comparing: [i], activeLine: 3, explanation: `${arr[i].value} ≠ ${target}. Moving on.` };
  }
  yield { array: [...arr], activeLine: 5, explanation: `${target} not found in the array.` };
}

export function* binarySearch(initialArray: ArrayElement[], target: number): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray].sort((a, b) => a.value - b.value);
  let left = 0, right = arr.length - 1;
  yield { array: [...arr], activeLine: 0, explanation: `Binary Search for ${target}. Array is sorted. Initial range: [0, ${right}].` };
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    yield { array: [...arr], comparing: [mid], windowLeft: left, windowRight: right, activeLine: 4, explanation: `Range [${left}..${right}]. Mid index ${mid} = ${arr[mid].value}.` };
    if (arr[mid].value === target) {
      yield { array: [...arr], found: mid, activeLine: 5, explanation: `Found ${target} at index ${mid}!` };
      return;
    } else if (arr[mid].value < target) {
      yield { array: [...arr], comparing: [mid], windowLeft: mid + 1, windowRight: right, activeLine: 7, explanation: `${arr[mid].value} < ${target}. Discard left half. New range: [${mid+1}..${right}].` };
      left = mid + 1;
    } else {
      yield { array: [...arr], comparing: [mid], windowLeft: left, windowRight: mid - 1, activeLine: 9, explanation: `${arr[mid].value} > ${target}. Discard right half. New range: [${left}..${mid-1}].` };
      right = mid - 1;
    }
  }
  yield { array: [...arr], activeLine: 11, explanation: `${target} not found in the array.` };
}

// ========================================================
// DSA PATTERNS
// ========================================================

export function* slidingWindowMaxSum(initialArray: ArrayElement[], k: number): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;
  yield { array: [...arr], activeLine: 0, explanation: `Find max sum subarray of size k=${k} using a sliding window.` };

  // Compute first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i].value;
  let maxSum = windowSum;
  let bestLeft = 0;

  yield { array: [...arr], windowLeft: 0, windowRight: k - 1, windowSum, windowBest: maxSum, highlightRange: Array.from({ length: k }, (_, i) => i), activeLine: 2, explanation: `Initial window [0..${k-1}]: sum = ${windowSum}.` };

  for (let i = k; i < n; i++) {
    windowSum += arr[i].value - arr[i - k].value;
    yield { array: [...arr], windowLeft: i - k + 1, windowRight: i, windowSum, windowBest: maxSum, highlightRange: Array.from({ length: k }, (_, j) => i - k + 1 + j), activeLine: 4, explanation: `Slide window right: add arr[${i}]=${arr[i].value}, remove arr[${i-k}]=${arr[i-k].value}. Window sum = ${windowSum}.` };
    if (windowSum > maxSum) {
      maxSum = windowSum;
      bestLeft = i - k + 1;
      yield { array: [...arr], windowLeft: bestLeft, windowRight: i, windowSum, windowBest: maxSum, highlightRange: Array.from({ length: k }, (_, j) => bestLeft + j), activeLine: 6, explanation: `New best! Max sum updated to ${maxSum} at window [${bestLeft}..${i}].` };
    }
  }
  yield { array: [...arr], windowLeft: bestLeft, windowRight: bestLeft + k - 1, windowSum: maxSum, windowBest: maxSum, sorted: Array.from({ length: k }, (_, j) => bestLeft + j), activeLine: 8, explanation: `Done! Maximum sum subarray of size ${k} is [${bestLeft}..${bestLeft+k-1}] with sum ${maxSum}.` };
}

export function* twoPointers(initialArray: ArrayElement[], target: number): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray].sort((a, b) => a.value - b.value);
  let left = 0, right = arr.length - 1;
  yield { array: [...arr], pointerLeft: left, pointerRight: right, activeLine: 0, explanation: `Two Pointers: find pair summing to ${target} in sorted array. Left=${arr[left].value}, Right=${arr[right].value}.` };

  while (left < right) {
    const sum = arr[left].value + arr[right].value;
    yield { array: [...arr], pointerLeft: left, pointerRight: right, comparing: [left, right], activeLine: 3, explanation: `arr[${left}]=${arr[left].value} + arr[${right}]=${arr[right].value} = ${sum}. Target is ${target}.` };
    if (sum === target) {
      yield { array: [...arr], pointerLeft: left, pointerRight: right, found: left, sorted: [right], activeLine: 4, explanation: `Found pair! ${arr[left].value} + ${arr[right].value} = ${target} at indices [${left}, ${right}].` };
      return;
    } else if (sum < target) {
      yield { array: [...arr], pointerLeft: left + 1, pointerRight: right, activeLine: 6, explanation: `Sum ${sum} < ${target}. Move left pointer right to increase sum.` };
      left++;
    } else {
      yield { array: [...arr], pointerLeft: left, pointerRight: right - 1, activeLine: 8, explanation: `Sum ${sum} > ${target}. Move right pointer left to decrease sum.` };
      right--;
    }
  }
  yield { array: [...arr], pointerLeft: left, pointerRight: right, activeLine: 10, explanation: `No pair found that sums to ${target}.` };
}

export function* kadanesAlgorithm(initialArray: ArrayElement[]): Generator<AlgoState, void, unknown> {
  const arr = [...initialArray];
  let maxSoFar = arr[0].value;
  let maxEndingHere = arr[0].value;
  let bestStart = 0, bestEnd = 0, curStart = 0;

  yield { array: [...arr], windowLeft: 0, windowRight: 0, windowSum: maxEndingHere, windowBest: maxSoFar, activeLine: 0, explanation: `Kadane's: find maximum contiguous subarray. Start with arr[0]=${arr[0].value}.` };

  for (let i = 1; i < arr.length; i++) {
    const extend = maxEndingHere + arr[i].value;
    const fresh = arr[i].value;
    yield { array: [...arr], comparing: [i], windowLeft: curStart, windowRight: i - 1, windowSum: maxEndingHere, windowBest: maxSoFar, activeLine: 3, explanation: `At index ${i}=${arr[i].value}: extend current (${maxEndingHere}+${arr[i].value}=${extend}) vs. start fresh (${fresh}).` };

    if (fresh > extend) {
      maxEndingHere = fresh;
      curStart = i;
    } else {
      maxEndingHere = extend;
    }

    yield { array: [...arr], windowLeft: curStart, windowRight: i, windowSum: maxEndingHere, windowBest: maxSoFar, activeLine: 4, explanation: `Current subarray [${curStart}..${i}] has sum ${maxEndingHere}.` };

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      bestStart = curStart;
      bestEnd = i;
      yield { array: [...arr], windowLeft: bestStart, windowRight: bestEnd, windowSum: maxEndingHere, windowBest: maxSoFar, activeLine: 6, explanation: `New global max! Best subarray [${bestStart}..${bestEnd}] = ${maxSoFar}.` };
    }
  }
  yield { array: [...arr], sorted: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k), windowLeft: bestStart, windowRight: bestEnd, windowSum: maxSoFar, windowBest: maxSoFar, activeLine: 8, explanation: `Kadane's done! Max subarray is [${bestStart}..${bestEnd}] with sum ${maxSoFar}.` };
}

export function* floydCycleDetection(list: number[]): Generator<AlgoState, void, unknown> {
  // list represents values; last element points back to index `cycleStartIdx`
  const cycleStartIdx = 2; // simulated: tail points to index 2
  const n = list.length;
  yield { linkedList: list, slowPointer: 0, fastPointer: 0, cycleNodes: Array.from({ length: n }, (_, i) => i), activeLine: 0, explanation: `Floyd's Cycle Detection. Slow and fast pointers both start at node 0.` };

  // Phase 1: detect cycle
  let slow = 0, fast = 0;
  let meeting = -1;
  for (let step = 0; step < n * 2; step++) {
    slow = (slow + 1) % n;
    fast = ((fast + 1) % n + 1) % n;
    // wrap fast to cycle start if it would go past
    if (fast >= n - 1) fast = cycleStartIdx;
    else if (slow >= n - 1) slow = cycleStartIdx;

    yield { linkedList: list, slowPointer: slow, fastPointer: fast, cycleNodes: Array.from({ length: n }, (_, i) => i), activeLine: 3, explanation: `Slow at node ${slow} (${list[slow]}), Fast at node ${fast} (${list[fast]}).` };
    if (slow === fast) {
      meeting = slow;
      yield { linkedList: list, slowPointer: slow, fastPointer: fast, cycleNodes: Array.from({ length: n }, (_, i) => i), cycleStart: meeting, activeLine: 5, explanation: `Pointers met at node ${meeting}! A cycle exists. Phase 2: find cycle entry.` };
      break;
    }
  }
  if (meeting === -1) {
    yield { linkedList: list, activeLine: 5, explanation: "No cycle detected in the linked list." };
    return;
  }
  // Phase 2: find entry
  let p1 = 0, p2 = meeting;
  for (let step = 0; step < n; step++) {
    yield { linkedList: list, slowPointer: p1, fastPointer: p2, cycleNodes: Array.from({ length: n }, (_, i) => i), cycleStart: cycleStartIdx, activeLine: 8, explanation: `Phase 2: p1 at node ${p1}, p2 at node ${p2}. Moving both one step.` };
    if (p1 === p2) {
      yield { linkedList: list, slowPointer: p1, fastPointer: p2, cycleNodes: Array.from({ length: n }, (_, i) => i), cycleStart: p1, activeLine: 9, explanation: `Cycle starts at node ${p1} (value ${list[p1]})!` };
      return;
    }
    p1 = (p1 + 1 >= n - 1) ? cycleStartIdx : p1 + 1;
    p2 = (p2 + 1 >= n - 1) ? cycleStartIdx : p2 + 1;
  }
}

// ========================================================
// GRAPH ALGORITHMS
// ========================================================

export function* bfs(graph: GraphData, startNodeId: number): Generator<AlgoState, void, unknown> {
  const queue: number[] = [startNodeId];
  const visited = new Set<number>([startNodeId]);
  yield { graph, queue: [...queue], visitedNodes: Array.from(visited), activeLine: 1, explanation: `BFS from node ${startNodeId}. Enqueued and marked visited.` };
  while (queue.length > 0) {
    const current = queue.shift()!;
    yield { graph, queue: [...queue], visitedNodes: Array.from(visited), activeNodes: [current], activeLine: 4, explanation: `Dequeued node ${current}. Exploring neighbors.` };
    const neighbors = graph.edges.filter(e => e.from === current || e.to === current).map(e => e.from === current ? e.to : e.from);
    for (const neighbor of neighbors) {
      yield { graph, queue: [...queue], visitedNodes: Array.from(visited), activeNodes: [current, neighbor], activeLine: 6, explanation: `Checking neighbor ${neighbor} of node ${current}.` };
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        yield { graph, queue: [...queue], visitedNodes: Array.from(visited), activeNodes: [current], activeLine: 8, explanation: `Node ${neighbor} unvisited — enqueued.` };
      } else {
        yield { graph, queue: [...queue], visitedNodes: Array.from(visited), activeNodes: [current], activeLine: 9, explanation: `Node ${neighbor} already visited — skipping.` };
      }
    }
  }
  yield { graph, queue: [], visitedNodes: Array.from(visited), activeLine: 11, explanation: "Queue empty. BFS complete." };
}

export function* dfs(graph: GraphData, startNodeId: number): Generator<AlgoState, void, unknown> {
  const stack: number[] = [startNodeId];
  const visited = new Set<number>();
  yield { graph, stack: [...stack], visitedNodes: [], activeLine: 0, explanation: `DFS from node ${startNodeId}. Pushed to stack.` };
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) {
      yield { graph, stack: [...stack], visitedNodes: Array.from(visited), activeNodes: [current], activeLine: 3, explanation: `Node ${current} already visited. Skipping.` };
      continue;
    }
    visited.add(current);
    yield { graph, stack: [...stack], visitedNodes: Array.from(visited), activeNodes: [current], activeLine: 4, explanation: `Visiting node ${current}. Marking as visited.` };
    const neighbors = graph.edges.filter(e => e.from === current || e.to === current).map(e => e.from === current ? e.to : e.from).reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        yield { graph, stack: [...stack], visitedNodes: Array.from(visited), activeNodes: [current, neighbor], activeLine: 7, explanation: `Pushing neighbor ${neighbor} onto stack.` };
      }
    }
  }
  yield { graph, stack: [], visitedNodes: Array.from(visited), activeLine: 9, explanation: "Stack empty. DFS traversal complete." };
}

// ========================================================
// CIPHER ALGORITHMS
// ========================================================

function makeChars(text: string) {
  return text.split('').map((char, index) => ({ char, index, transformed: '', active: false, done: false }));
}

export function* caesarCipher(plaintext: string, shift: number): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext);
  yield { cipherChars: chars.map(c => ({ ...c })), plaintextChars: chars.map(c => ({ ...c })), keyDisplay: `Shift = ${shift}`, activeLine: 0, explanation: `Caesar Cipher: shift each letter by ${shift} positions in the alphabet.` };
  const result: typeof chars = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    let transformed = c.char;
    if (/[a-zA-Z]/.test(c.char)) {
      const base = c.char >= 'a' ? 97 : 65;
      transformed = String.fromCharCode(((c.char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
    }
    const active = chars.map((ch, idx) => ({ ...ch, active: idx === i, done: idx < i, transformed: result[idx]?.transformed || '' }));
    active[i].transformed = transformed;
    yield { cipherChars: active, keyDisplay: `Shift = ${shift}`, activeLine: 2, explanation: `'${c.char}' → ASCII ${c.char.charCodeAt(0)} → shift by ${shift} → '${transformed}'` };
    result.push({ ...c, transformed });
    const done = chars.map((ch, idx) => ({ ...ch, done: idx <= i, active: idx === i, transformed: result[idx]?.transformed || '' }));
    yield { cipherChars: done, ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Shift = ${shift}`, activeLine: 3, explanation: `Encoded so far: "${result.map(r => r.transformed).join('')}"` };
  }
  yield { cipherChars: result.map(r => ({ ...r, done: true, active: false })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Shift = ${shift}`, activeLine: 5, explanation: `Caesar Cipher complete! Ciphertext: "${result.map(r => r.transformed).join('')}"` };
}

export function* vigenerecipher(plaintext: string, key: string): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext.toUpperCase());
  const K = key.toUpperCase().replace(/[^A-Z]/g, '');
  yield { cipherChars: chars.map(c => ({ ...c })), keyDisplay: `Key: "${K}"`, activeLine: 0, explanation: `Vigenère Cipher: use repeating key "${K}" to shift each letter differently.` };
  const result: typeof chars = [];
  let keyIdx = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    let transformed = c.char;
    let shiftAmt = 0;
    if (/[A-Z]/.test(c.char)) {
      shiftAmt = K.charCodeAt(keyIdx % K.length) - 65;
      transformed = String.fromCharCode(((c.char.charCodeAt(0) - 65 + shiftAmt) % 26) + 65);
      keyIdx++;
    }
    const active = chars.map((ch, idx) => ({ ...ch, active: idx === i, done: idx < i, transformed: result[idx]?.transformed || '' }));
    active[i].transformed = transformed;
    yield { cipherChars: active, keyDisplay: `Key: "${K}" | Key char: '${K[((keyIdx-1) % K.length)]}' (shift +${shiftAmt})`, activeLine: 3, explanation: `'${c.char}' shifted by key letter '${K[((keyIdx-1) % K.length)]}' (+${shiftAmt}) → '${transformed}'` };
    result.push({ ...c, transformed });
    yield { cipherChars: result.map((r, idx) => ({ ...r, done: idx <= i, active: idx === i })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Key: "${K}"`, activeLine: 4, explanation: `Ciphertext so far: "${result.map(r => r.transformed).join('')}"` };
  }
  yield { cipherChars: result.map(r => ({ ...r, done: true, active: false })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Key: "${K}"`, activeLine: 6, explanation: `Vigenère complete! Ciphertext: "${result.map(r => r.transformed).join('')}"` };
}

export function* rot13(plaintext: string): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext);
  yield { cipherChars: chars.map(c => ({ ...c })), keyDisplay: `Shift = 13 (ROT13 is self-inverse)`, activeLine: 0, explanation: `ROT13: a special case of Caesar cipher where shift=13. Applying it twice returns the original.` };
  const result: typeof chars = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    let transformed = c.char;
    if (/[a-zA-Z]/.test(c.char)) {
      const base = c.char >= 'a' ? 97 : 65;
      transformed = String.fromCharCode(((c.char.charCodeAt(0) - base + 13) % 26) + base);
    }
    result.push({ ...c, transformed });
    yield { cipherChars: chars.map((ch, idx) => ({ ...ch, active: idx === i, done: idx <= i, transformed: result[idx]?.transformed || '' })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Shift = 13`, activeLine: 2, explanation: `'${c.char}' → '${transformed}'. ROT13 rotates each letter exactly halfway round the alphabet.` };
  }
  yield { cipherChars: result.map(r => ({ ...r, done: true, active: false })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Shift = 13`, activeLine: 4, explanation: `ROT13 done! Output: "${result.map(r => r.transformed).join('')}"` };
}

export function* xorCipher(plaintext: string, keyChar: string): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext);
  const keyCode = keyChar.charCodeAt(0);
  yield { cipherChars: chars.map(c => ({ ...c })), keyDisplay: `Key char: '${keyChar}' (ASCII ${keyCode}, binary: ${keyCode.toString(2).padStart(8, '0')})`, activeLine: 0, explanation: `XOR Cipher: XOR each character's ASCII code with the key character '${keyChar}' (${keyCode}).` };
  const result: typeof chars = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const charCode = c.char.charCodeAt(0);
    const xorResult = charCode ^ keyCode;
    const transformed = String.fromCharCode(xorResult);
    result.push({ ...c, transformed });
    yield { 
      cipherChars: chars.map((ch, idx) => ({ ...ch, active: idx === i, done: idx <= i, transformed: result[idx]?.transformed || '' })), 
      ciphertextDisplay: result.map(r => r.transformed).join(''), 
      keyDisplay: `Key: '${keyChar}' (${keyCode})`,
      extraInfo: { 
        'Char ASCII': `'${c.char}' = ${charCode} = ${charCode.toString(2).padStart(8,'0')}b`,
        'Key ASCII': `'${keyChar}' = ${keyCode} = ${keyCode.toString(2).padStart(8,'0')}b`,
        'XOR Result': `${xorResult} = ${xorResult.toString(2).padStart(8,'0')}b → '${transformed}'`
      },
      activeLine: 2, 
      explanation: `'${c.char}' (${charCode}) XOR '${keyChar}' (${keyCode}) = ${xorResult} → '${transformed}'`
    };
  }
  yield { cipherChars: result.map(r => ({ ...r, done: true, active: false })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Key: '${keyChar}'`, activeLine: 4, explanation: `XOR Cipher complete! (Applying the same key again decrypts it.)` };
}

export function* atbashCipher(plaintext: string): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext.toUpperCase());
  yield { cipherChars: chars.map(c => ({ ...c })), keyDisplay: `Mirror: A↔Z, B↔Y, C↔X ...`, activeLine: 0, explanation: `Atbash Cipher: mirror the alphabet. A→Z, B→Y, C→X, etc. Used in ancient Hebrew texts.` };
  const result: typeof chars = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    let transformed = c.char;
    if (/[A-Z]/.test(c.char)) {
      transformed = String.fromCharCode(90 - (c.char.charCodeAt(0) - 65));
    }
    result.push({ ...c, transformed });
    yield { cipherChars: chars.map((ch, idx) => ({ ...ch, active: idx === i, done: idx <= i, transformed: result[idx]?.transformed || '' })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Mirror: A↔Z`, activeLine: 2, explanation: `'${c.char}' (pos ${c.char.charCodeAt(0)-65}) → mirror → '${transformed}' (pos ${transformed.charCodeAt(0)-65})` };
  }
  yield { cipherChars: result.map(r => ({ ...r, done: true, active: false })), ciphertextDisplay: result.map(r => r.transformed).join(''), keyDisplay: `Mirror: A↔Z`, activeLine: 4, explanation: `Atbash done! "${result.map(r => r.transformed).join('')}"` };
}

export function* railFenceCipher(plaintext: string, rails: number): Generator<AlgoState, void, unknown> {
  const text = plaintext.replace(/\s/g, '').toUpperCase();
  const n = text.length;
  const fence: { char: string; rail: number; index: number; done: boolean }[] = [];
  yield { cipherChars: makeChars(text), keyDisplay: `Rails = ${rails}`, railCount: rails, activeLine: 0, explanation: `Rail Fence Cipher: write text in zigzag across ${rails} rails, then read row by row.` };

  // Fill the fence
  let rail = 0, dir = 1;
  for (let i = 0; i < n; i++) {
    fence.push({ char: text[i], rail, index: i, done: false });
    if (rail === 0) dir = 1;
    if (rail === rails - 1) dir = -1;
    const updatedFence = fence.map(f => ({ ...f, done: f.index < i }));
    yield { railFence: updatedFence, keyDisplay: `Rails = ${rails}`, railCount: rails, activeLine: 2, explanation: `Placing '${text[i]}' on rail ${rail}. Direction: ${dir > 0 ? '↓' : '↑'}` };
    rail += dir;
  }
  yield { railFence: fence.map(f => ({ ...f, done: true })), keyDisplay: `Rails = ${rails}`, railCount: rails, activeLine: 4, explanation: `All characters placed on rails. Now reading row by row to form ciphertext.` };

  let ciphertext = '';
  for (let r = 0; r < rails; r++) {
    const rowChars = fence.filter(f => f.rail === r).map(f => f.char);
    ciphertext += rowChars.join('');
    yield { railFence: fence.map(f => ({ ...f, done: f.rail <= r })), ciphertextDisplay: ciphertext, keyDisplay: `Rails = ${rails}`, railCount: rails, activeLine: 5, explanation: `Reading rail ${r}: "${rowChars.join('')}" — Ciphertext so far: "${ciphertext}"` };
  }
  yield { railFence: fence.map(f => ({ ...f, done: true })), ciphertextDisplay: ciphertext, keyDisplay: `Rails = ${rails}`, railCount: rails, activeLine: 6, explanation: `Rail Fence complete! Ciphertext: "${ciphertext}"` };
}

export function* base64Encoding(plaintext: string): Generator<AlgoState, void, unknown> {
  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes = Array.from(plaintext).map(c => c.charCodeAt(0));
  yield { cipherChars: makeChars(plaintext), keyDisplay: `Base64 alphabet (64 chars)`, activeLine: 0, explanation: `Base64: encode binary data as ASCII text. Groups 3 bytes (24 bits) into 4 six-bit characters.` };

  let encoded = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    const bits = (b0 << 16) | (b1 << 8) | b2;
    const c0 = B64[(bits >> 18) & 63];
    const c1 = B64[(bits >> 12) & 63];
    const c2 = i + 1 < bytes.length ? B64[(bits >> 6) & 63] : '=';
    const c3 = i + 2 < bytes.length ? B64[bits & 63] : '=';
    yield {
      cipherChars: makeChars(plaintext).map((c, idx) => ({ ...c, done: idx < i, active: idx >= i && idx < i + 3 })),
      ciphertextDisplay: encoded + c0 + c1 + c2 + c3,
      keyDisplay: `Base64 table`,
      extraInfo: {
        'Bytes': `${b0.toString(2).padStart(8,'0')} ${b1.toString(2).padStart(8,'0')} ${b2.toString(2).padStart(8,'0')}`,
        '24-bit block': bits.toString(2).padStart(24,'0'),
        'Encoded chars': `${c0}${c1}${c2}${c3}`
      },
      activeLine: 3,
      explanation: `Group "${plaintext.slice(i, i+3)}" → bits → split into 4 x 6-bit values → "${c0}${c1}${c2}${c3}"`
    };
    encoded += c0 + c1 + c2 + c3;
  }
  yield { cipherChars: makeChars(plaintext).map(c => ({ ...c, done: true })), ciphertextDisplay: encoded, keyDisplay: `Base64`, activeLine: 5, explanation: `Base64 encoding complete! "${encoded}"` };
}

export function* md5Conceptual(plaintext: string): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext);
  yield { cipherChars: chars, keyDisplay: `MD5 (128-bit hash)`, activeLine: 0, explanation: `MD5 is a one-way hash function. It produces a 128-bit (32 hex chars) fingerprint. The same input always gives the same output — but it cannot be reversed.` };
  yield { cipherChars: chars, keyDisplay: `Step 1: Pad`, activeLine: 1, explanation: `Step 1 — Padding: Append bit '1', then zeros, until length ≡ 448 (mod 512). The last 64 bits store the original message length.` };
  yield { cipherChars: chars.map(c => ({ ...c, active: true })), keyDisplay: `Step 2: Initialize 4 buffers`, extraInfo: { A: '0x67452301', B: '0xEFCDAB89', C: '0x98BADCFE', D: '0x10325476' }, activeLine: 2, explanation: `Step 2 — Init: Four 32-bit buffers A, B, C, D initialized with magic constants.` };
  yield { cipherChars: chars.map(c => ({ ...c, done: true })), keyDisplay: `Step 3: Process 512-bit blocks`, activeLine: 3, explanation: `Step 3 — Process: Each 512-bit block goes through 64 rounds of bitwise mixing (F, G, H, I functions + modular addition).` };
  yield { cipherChars: chars.map(c => ({ ...c, done: true })), keyDisplay: `Step 4: Output`, ciphertextDisplay: `5d41402abc4b2a76b9719d911017c592`, activeLine: 4, explanation: `Step 4 — Output: Concatenate A||B||C||D as a 128-bit little-endian hex string. This is your MD5 hash. NOTE: MD5 is cryptographically broken — use SHA-256 or SHA-3 for security.` };
}

export function* sha256Conceptual(plaintext: string): Generator<AlgoState, void, unknown> {
  const chars = makeChars(plaintext);
  yield { cipherChars: chars, keyDisplay: `SHA-256 (256-bit hash)`, activeLine: 0, explanation: `SHA-256 is a cryptographic hash function producing a 256-bit (64 hex chars) digest. It is the industry-standard for digital signatures, TLS, Bitcoin, and password hashing.` };
  yield { cipherChars: chars.map(c => ({ ...c, active: true })), keyDisplay: `Step 1: Pre-process`, activeLine: 1, explanation: `Step 1 — Pre-processing: Pad the message to a multiple of 512 bits. Append '1' bit, zeros, and original length as 64-bit big-endian.` };
  yield { cipherChars: chars.map(c => ({ ...c, active: true })), keyDisplay: `Step 2: Init hash values`, extraInfo: { h0: '6a09e667', h1: 'bb67ae85', h2: '3c6ef372', h3: 'a54ff53a' }, activeLine: 2, explanation: `Step 2 — Init: Eight 32-bit hash values (h0–h7) initialized from the fractional parts of square roots of the first 8 primes.` };
  yield { cipherChars: chars.map(c => ({ ...c, done: true })), keyDisplay: `Step 3: 64 compression rounds`, activeLine: 3, explanation: `Step 3 — Compression: Each 512-bit chunk runs 64 rounds using right-rotate, XOR, AND, NOT operations. Uses 64 round constants derived from cube roots of first 64 primes.` };
  yield { cipherChars: chars.map(c => ({ ...c, done: true })), ciphertextDisplay: `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`, keyDisplay: `SHA-256 output`, activeLine: 4, explanation: `Step 4 — Final hash: Add compressed chunk to current hash values and output as 64 hex chars. SHA-256 is collision-resistant — infeasible to find two inputs with the same hash.` };
}

export function* rsaConcept(): Generator<AlgoState, void, unknown> {
  yield { cipherChars: [], keyDisplay: `RSA (Asymmetric Encryption)`, activeLine: 0, explanation: `RSA is a public-key cryptosystem. It uses a pair of keys: a PUBLIC key to encrypt (anyone can use) and a PRIVATE key to decrypt (only the owner has).` };
  yield { cipherChars: [], keyDisplay: `Step 1: Key Generation`, extraInfo: { p: '61', q: '53', n: 'p × q = 3233' }, activeLine: 1, explanation: `Step 1 — Choose two large primes p=61, q=53. Compute n = p × q = 3233. n is the "modulus" used in both keys.` };
  yield { cipherChars: [], keyDisplay: `Euler's Totient`, extraInfo: { 'φ(n)': '(p-1)(q-1) = 60×52 = 3120' }, activeLine: 2, explanation: `Step 2 — Compute φ(n) = (p-1)(q-1) = 3120. This is Euler's totient — count of integers less than n that are coprime with n.` };
  yield { cipherChars: [], keyDisplay: `Public Key (e, n)`, extraInfo: { e: '17 (gcd(17, 3120) = 1)', 'Public Key': '(17, 3233)' }, activeLine: 3, explanation: `Step 3 — Choose e=17 where gcd(e, φ(n))=1. Public key is (e=17, n=3233). Share this with everyone.` };
  yield { cipherChars: [], keyDisplay: `Private Key (d, n)`, extraInfo: { d: '2753 (17 × 2753 ≡ 1 mod 3120)', 'Private Key': '(2753, 3233)' }, activeLine: 4, explanation: `Step 4 — Compute d = e⁻¹ mod φ(n) = 2753. Private key is (d=2753, n=3233). Keep this SECRET.` };
  yield { cipherChars: [], keyDisplay: `Encryption`, extraInfo: { 'Message M': '65', 'C = Mᵉ mod n': '65¹⁷ mod 3233 = 2790', 'Ciphertext': '2790' }, activeLine: 5, explanation: `Encrypt: C = M^e mod n = 65^17 mod 3233 = 2790. Anyone with the public key can encrypt.` };
  yield { cipherChars: [], keyDisplay: `Decryption`, extraInfo: { 'Ciphertext C': '2790', 'M = Cᵈ mod n': '2790²⁷⁵³ mod 3233 = 65', 'Recovered': '65' }, activeLine: 6, explanation: `Decrypt: M = C^d mod n = 2790^2753 mod 3233 = 65. Only the private key can decrypt. Security comes from the difficulty of factoring large n.` };
}

// ========================================================
// DEFAULT INPUTS
// ========================================================

export const defaultArray: ArrayElement[] = [
  { id: '1', value: 45 },
  { id: '2', value: 12 },
  { id: '3', value: 89 },
  { id: '4', value: 33 },
  { id: '5', value: 67 },
  { id: '6', value: 21 },
  { id: '7', value: 95 },
  { id: '8', value: 50 },
];

export const defaultGraph: GraphData = {
  nodes: [
    { id: 1, label: '1', x: 50, y: 20 },
    { id: 2, label: '2', x: 30, y: 50 },
    { id: 3, label: '3', x: 70, y: 50 },
    { id: 4, label: '4', x: 15, y: 80 },
    { id: 5, label: '5', x: 45, y: 80 },
    { id: 6, label: '6', x: 85, y: 80 },
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 6 },
  ]
};

export const defaultLinkedList = [3, 1, 4, 1, 5, 9, 2]; // cycle goes back to index 2

export const defaultSlidingWindowK = 3;
export const defaultTwoPointersTarget = 100;
export const defaultCipherText = "HELLO";
export const defaultCipherKey = "KEY";
export const defaultCipherShift = 3;
export const defaultRailCount = 3;
