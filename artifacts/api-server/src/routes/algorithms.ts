import { Router, type IRouter } from "express";
import {
  ListAlgorithmsResponse,
  GetAlgorithmResponse,
  SaveProgressBody,
  SaveProgressResponse,
  GetUserProgressResponse,
} from "@workspace/api-zod";
import { db, userProgressTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const ALGORITHMS = [
  // ── SORTING ──────────────────────────────────────────────────────────
  {
    id: "bubble-sort", name: "Bubble Sort", category: "sorting", difficulty: "beginner",
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. Simple to understand but inefficient for large datasets.",
    timeComplexity: "O(n²)", spaceComplexity: "O(1)",
    pseudocode: ["procedure bubbleSort(arr):", "  n = length(arr)", "  for i = 0 to n-1:", "    for j = 0 to n-i-2:", "      if arr[j] > arr[j+1]:", "        swap(arr[j], arr[j+1])", "  return arr"],
    tags: ["sorting", "comparison", "in-place", "stable"],
  },
  {
    id: "merge-sort", name: "Merge Sort", category: "sorting", difficulty: "intermediate",
    description: "Divide-and-conquer algorithm that recursively splits the array in half, sorts each half, then merges them back together. Stable and reliable with guaranteed O(n log n) performance.",
    timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure mergeSort(arr):", "  if length(arr) <= 1: return arr", "  mid = length(arr) / 2", "  left = mergeSort(arr[0..mid])", "  right = mergeSort(arr[mid..n])", "  return merge(left, right)", "", "procedure merge(left, right):", "  result = []", "  while left and right not empty:", "    if left[0] <= right[0]: append left[0]", "    else: append right[0]", "  append remaining elements", "  return result", ""],
    tags: ["sorting", "divide-and-conquer", "stable", "recursive"],
  },
  {
    id: "quick-sort", name: "Quick Sort", category: "sorting", difficulty: "intermediate",
    description: "Selects a pivot and partitions the array around it so elements smaller than the pivot come before, and larger elements after. One of the fastest in practice due to cache efficiency.",
    timeComplexity: "O(n log n) avg", spaceComplexity: "O(log n)",
    pseudocode: ["procedure quickSort(arr, low, high):", "  if low < high:", "    pivot = arr[high]", "    i = low - 1", "    for j = low to high-1:", "      if arr[j] <= pivot:", "        i++", "        swap(arr[i], arr[j])", "    swap(arr[i+1], arr[high])", "    pivotIdx = i + 1", "    quickSort(arr, low, pivotIdx - 1)", "    quickSort(arr, pivotIdx + 1, high)"],
    tags: ["sorting", "divide-and-conquer", "in-place", "unstable"],
  },
  {
    id: "insertion-sort", name: "Insertion Sort", category: "sorting", difficulty: "beginner",
    description: "Builds the sorted array one item at a time by inserting each new element into its correct position. Excellent for small or nearly-sorted datasets and naturally adaptive.",
    timeComplexity: "O(n²)", spaceComplexity: "O(1)",
    pseudocode: ["procedure insertionSort(arr):", "  for i = 1 to length(arr)-1:", "    key = arr[i]", "    j = i - 1", "    while j >= 0 and arr[j] > key:", "      arr[j+1] = arr[j]", "      j = j - 1", "    arr[j+1] = key", "  return arr"],
    tags: ["sorting", "comparison", "in-place", "stable", "adaptive"],
  },
  // ── SEARCHING ────────────────────────────────────────────────────────
  {
    id: "linear-search", name: "Linear Search", category: "searching", difficulty: "beginner",
    description: "Sequentially checks each element until the target is found or the list is exhausted. Works on unsorted data — the simplest search algorithm.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure linearSearch(arr, target):", "  for i = 0 to length(arr)-1:", "    if arr[i] == target:", "      return i", "  return -1"],
    tags: ["searching", "sequential", "unsorted"],
  },
  {
    id: "binary-search", name: "Binary Search", category: "searching", difficulty: "beginner",
    description: "Efficiently finds a target in a sorted array by repeatedly halving the search space. Eliminates half of remaining elements at each step — extremely fast.",
    timeComplexity: "O(log n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure binarySearch(arr, target):", "  low = 0, high = length(arr) - 1", "  while low <= high:", "    mid = (low + high) / 2", "    if arr[mid] == target: return mid", "    else if arr[mid] < target:", "      low = mid + 1", "    else:", "      high = mid - 1", "  return -1", "  // not found"],
    tags: ["searching", "divide-and-conquer", "sorted"],
  },
  // ── DSA PATTERNS ─────────────────────────────────────────────────────
  {
    id: "sliding-window", name: "Sliding Window", category: "dsa-pattern", difficulty: "intermediate",
    description: "Maintains a window of fixed or variable size over a data structure, sliding it forward to avoid recomputing the entire subarray. Classic for maximum/minimum subarray problems.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure slidingWindowMaxSum(arr, k):", "  windowSum = sum(arr[0..k-1])", "  maxSum = windowSum", "  for i = k to n-1:", "    windowSum += arr[i] - arr[i-k]", "    if windowSum > maxSum:", "      maxSum = windowSum", "  return maxSum"],
    tags: ["dsa-pattern", "array", "subarray", "interview"],
  },
  {
    id: "two-pointers", name: "Two Pointers", category: "dsa-pattern", difficulty: "intermediate",
    description: "Uses two indices moving toward each other (or in the same direction) to efficiently solve array problems without nested loops. Key technique for pair-sum, palindrome, and partition problems.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure twoPointers(arr, target):", "  left = 0, right = n - 1", "  while left < right:", "    sum = arr[left] + arr[right]", "    if sum == target: return [left, right]", "    else if sum < target:", "      left++", "    else:", "      right--", "  return not found"],
    tags: ["dsa-pattern", "array", "sorted", "interview"],
  },
  {
    id: "kadanes", name: "Kadane's Algorithm", category: "dsa-pattern", difficulty: "intermediate",
    description: "Finds the maximum sum contiguous subarray in O(n) time using dynamic programming. At each step, decides whether to extend the current subarray or start a new one from the current element.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure kadanes(arr):", "  maxEndingHere = arr[0]", "  maxSoFar = arr[0]", "  for i = 1 to n-1:", "    maxEndingHere = max(arr[i], maxEndingHere + arr[i])", "    if maxEndingHere > maxSoFar:", "      maxSoFar = maxEndingHere", "  return maxSoFar"],
    tags: ["dsa-pattern", "dynamic-programming", "subarray", "interview"],
  },
  {
    id: "floyd-cycle", name: "Floyd's Cycle Detection", category: "dsa-pattern", difficulty: "advanced",
    description: "Uses slow and fast pointers (tortoise and hare) to detect cycles in a linked list. The fast pointer moves twice as fast; if there's a cycle they will meet. Phase 2 finds the cycle start.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure floydCycle(head):", "  slow = head, fast = head", "  // Phase 1: Detect cycle", "  while fast and fast.next:", "    slow = slow.next", "    fast = fast.next.next", "    if slow == fast: break", "  // Phase 2: Find entry", "  p1 = head, p2 = meeting point", "  while p1 != p2:", "    p1 = p1.next; p2 = p2.next", "  return p1  // cycle start"],
    tags: ["dsa-pattern", "linked-list", "cycle", "interview"],
  },
  // ── GRAPH ────────────────────────────────────────────────────────────
  {
    id: "bfs", name: "Breadth-First Search", category: "graph", difficulty: "intermediate",
    description: "Explores all neighbors at the current depth before moving to the next level. Uses a queue and is ideal for finding the shortest path in unweighted graphs.",
    timeComplexity: "O(V + E)", spaceComplexity: "O(V)",
    pseudocode: ["procedure BFS(graph, start):", "  queue = [start]", "  visited = {start}", "  while queue not empty:", "    node = queue.dequeue()", "    process(node)", "    for each neighbor of node:", "      if neighbor not visited:", "        visited.add(neighbor)", "        queue.enqueue(neighbor)", "  // Done"],
    tags: ["graph", "traversal", "shortest-path", "queue"],
  },
  {
    id: "dfs", name: "Depth-First Search", category: "graph", difficulty: "intermediate",
    description: "Explores as far as possible along each branch before backtracking. Uses a stack (or recursion) and is useful for topological sort, cycle detection, and maze solving.",
    timeComplexity: "O(V + E)", spaceComplexity: "O(V)",
    pseudocode: ["procedure DFS(graph, start):", "  stack = [start]", "  visited = {}", "  while stack not empty:", "    node = stack.pop()", "    if node not visited:", "      visited.add(node)", "      process(node)", "      for each neighbor:", "        stack.push(neighbor)", "  // Done"],
    tags: ["graph", "traversal", "backtracking", "stack"],
  },
  // ── CIPHERS ──────────────────────────────────────────────────────────
  {
    id: "caesar", name: "Caesar Cipher", category: "cipher", difficulty: "beginner",
    description: "One of the oldest known ciphers — shifts each letter by a fixed number of positions in the alphabet. Julius Caesar used a shift of 3. It is a substitution cipher and is trivially broken by frequency analysis.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure caesarEncrypt(text, shift):", "  result = ''", "  for each char in text:", "    if isLetter(char):", "      shifted = (char + shift) mod 26", "      result += shifted", "    else:", "      result += char", "  return result"],
    tags: ["cipher", "substitution", "classical", "symmetric"],
  },
  {
    id: "vigenere", name: "Vigenère Cipher", category: "cipher", difficulty: "intermediate",
    description: "A polyalphabetic substitution cipher using a repeating keyword. Each letter is shifted by the corresponding letter of the key, making frequency analysis harder than Caesar. Invented in the 16th century.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure vigenereEncrypt(text, key):", "  result = ''", "  keyIdx = 0", "  for each char in text:", "    if isLetter(char):", "      shift = key[keyIdx % keyLen]", "      result += (char + shift) mod 26", "      keyIdx++", "    else:", "      result += char", "  return result"],
    tags: ["cipher", "polyalphabetic", "classical", "symmetric"],
  },
  {
    id: "rot13", name: "ROT13", category: "cipher", difficulty: "beginner",
    description: "A special case of Caesar cipher with shift=13. Since the English alphabet has 26 letters, applying ROT13 twice returns the original text. Used in online forums to hide spoilers.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure rot13(text):", "  result = ''", "  for each char in text:", "    if isLetter(char):", "      result += (char + 13) mod 26", "    else:", "      result += char", "  return result", "  // Self-inverse: rot13(rot13(x)) == x"],
    tags: ["cipher", "caesar", "self-inverse", "substitution"],
  },
  {
    id: "xor", name: "XOR Cipher", category: "cipher", difficulty: "intermediate",
    description: "XORs each byte of the plaintext with a key byte. If the key is as long as the message (one-time pad), XOR cipher is theoretically unbreakable. Forms the basis of stream ciphers and AES.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure xorEncrypt(text, key):", "  result = ''", "  for i = 0 to length(text)-1:", "    result += text[i] XOR key[i mod keyLen]", "  return result", "  // Decrypt is identical: text XOR key XOR key = text"],
    tags: ["cipher", "bitwise", "symmetric", "stream"],
  },
  {
    id: "atbash", name: "Atbash Cipher", category: "cipher", difficulty: "beginner",
    description: "Mirrors the alphabet: A→Z, B→Y, C→X, etc. Originally used for the Hebrew alphabet in the Bible (Jeremiah 25:26). Like ROT13, it is its own inverse — decrypting uses the same process.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure atbash(text):", "  result = ''", "  for each char in text:", "    if isLetter(char):", "      result += 'Z' - (char - 'A')", "    else:", "      result += char", "  return result"],
    tags: ["cipher", "substitution", "classical", "self-inverse"],
  },
  {
    id: "rail-fence", name: "Rail Fence Cipher", category: "cipher", difficulty: "intermediate",
    description: "A transposition cipher that writes plaintext in a zigzag pattern across a number of 'rails', then reads off each rail row by row. The number of rails is the key. Used in WWI field communications.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure railFence(text, rails):", "  fence = [] for each rail", "  rail = 0; direction = +1", "  for each char in text:", "    fence[rail].append(char)", "    if rail == 0: direction = +1", "    if rail == rails-1: direction = -1", "    rail += direction", "  return concat(fence[0..rails-1])"],
    tags: ["cipher", "transposition", "classical"],
  },
  {
    id: "base64", name: "Base64 Encoding", category: "cipher", difficulty: "beginner",
    description: "Encodes binary data as ASCII text using 64 printable characters. Groups every 3 bytes (24 bits) into four 6-bit values, each mapped to an ASCII character. Used in email attachments, JWT tokens, and data URIs.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    pseudocode: ["procedure base64Encode(bytes):", "  B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef...'", "  result = ''", "  for each 3-byte group (b0, b1, b2):", "    bits = (b0 << 16) | (b1 << 8) | b2", "    result += B64[(bits>>18)&63]", "    result += B64[(bits>>12)&63]", "    result += B64[(bits>>6)&63] or '='", "    result += B64[bits&63] or '='", "  return result"],
    tags: ["encoding", "binary", "ascii", "web"],
  },
  {
    id: "md5", name: "MD5 Hash", category: "cipher", difficulty: "advanced",
    description: "A widely-used one-way hash function that produces a 128-bit (32 hex char) fingerprint. Fast but cryptographically broken — vulnerable to collision attacks. Used historically for checksums; do NOT use for passwords.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure MD5(message):", "  // Step 1: Pad message to 512-bit block", "  pad(message)", "  // Step 2: Init 4 x 32-bit buffers", "  A, B, C, D = magic_constants", "  // Step 3: 64 rounds of bit mixing", "  for each 512-bit block:", "    for round = 0 to 63:", "      F = nonlinear_function(B, C, D)", "      A = B + leftRotate(A + F + M[i] + K[i], s)", "  // Step 4: Output A||B||C||D as hex", "  return hex(A + B + C + D)"],
    tags: ["hashing", "one-way", "cryptographic", "broken"],
  },
  {
    id: "sha256", name: "SHA-256 Hash", category: "cipher", difficulty: "advanced",
    description: "Produces a 256-bit (64 hex char) secure hash. Part of the SHA-2 family. Used in TLS/SSL, Bitcoin mining, digital signatures, and secure password storage. Collision-resistant and computationally infeasible to reverse.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    pseudocode: ["procedure SHA256(message):", "  // Pre-process: pad to 512-bit blocks", "  // Init 8 x 32-bit hash values h0..h7", "  h = sqrt_prime_fractional_parts()", "  // 64 round constants K[0..63]", "  K = cbrt_prime_fractional_parts()", "  for each 512-bit chunk:", "    W = message schedule (64 words)", "    for round = 0 to 63:", "      // right-rotate, XOR, AND, NOT mix", "      S1 = rightRotate(e,6) XOR ...", "      h = (g, f, e+temp1, d, c, b, a+temp1, h)", "  return h0||h1||...||h7 as hex"],
    tags: ["hashing", "sha2", "cryptographic", "secure"],
  },
  {
    id: "rsa", name: "RSA Encryption", category: "cipher", difficulty: "advanced",
    description: "An asymmetric public-key cryptosystem. Uses a mathematically linked key pair: anything encrypted with the public key can only be decrypted with the private key. Security relies on the difficulty of factoring large integers.",
    timeComplexity: "O(k³) key gen", spaceComplexity: "O(1)",
    pseudocode: ["procedure RSA_keygen(p, q):", "  n = p * q  // public modulus", "  φ(n) = (p-1)(q-1)", "  choose e: gcd(e, φ(n)) = 1", "  d = modInverse(e, φ(n))", "  publicKey = (e, n)", "  privateKey = (d, n)", "", "procedure encrypt(M, publicKey):", "  return M^e mod n", "", "procedure decrypt(C, privateKey):", "  return C^d mod n"],
    tags: ["asymmetric", "public-key", "rsa", "cryptographic"],
  },
];

router.get("/algorithms", (_req, res) => {
  const data = ListAlgorithmsResponse.parse({ algorithms: ALGORITHMS });
  res.json(data);
});

router.get("/algorithms/:id", (req, res) => {
  const algorithm = ALGORITHMS.find((a) => a.id === req.params.id);
  if (!algorithm) {
    res.status(404).json({ error: "not_found", message: "Algorithm not found" });
    return;
  }
  const data = GetAlgorithmResponse.parse(algorithm);
  res.json(data);
});

router.post("/algorithms/:id/progress", async (req, res) => {
  const body = SaveProgressBody.parse(req.body);
  const algorithmId = req.params.id;
  const existing = await db.select().from(userProgressTable).where(and(eq(userProgressTable.algorithmId, algorithmId), eq(userProgressTable.sessionId, body.sessionId))).limit(1);
  if (existing.length > 0) {
    await db.update(userProgressTable).set({ completedSteps: body.completedSteps, totalSteps: body.totalSteps, timeSpentSeconds: body.timeSpentSeconds, lastVisited: new Date() }).where(and(eq(userProgressTable.algorithmId, algorithmId), eq(userProgressTable.sessionId, body.sessionId)));
  } else {
    await db.insert(userProgressTable).values({ algorithmId, sessionId: body.sessionId, completedSteps: body.completedSteps, totalSteps: body.totalSteps, timeSpentSeconds: body.timeSpentSeconds });
  }
  const data = SaveProgressResponse.parse({ success: true, message: "Progress saved" });
  res.json(data);
});

router.get("/progress", async (_req, res) => {
  const rows = await db.select().from(userProgressTable).orderBy(userProgressTable.lastVisited);
  const data = GetUserProgressResponse.parse({ progress: rows.map(r => ({ algorithmId: r.algorithmId, sessionId: r.sessionId, completedSteps: r.completedSteps, totalSteps: r.totalSteps, timeSpentSeconds: r.timeSpentSeconds, lastVisited: r.lastVisited.toISOString() })) });
  res.json(data);
});

export default router;
