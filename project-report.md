# Longest Common Subsequence (LCS) Project Report

## 1. Introduction

This report describes a data structures and algorithms project based on the Longest Common Subsequence (LCS) algorithm. The objective is to demonstrate how LCS can be used in three realistic case study modes: Plagiarism Detection, DNA Sequencing, and File Comparison. The report also explains the problem definition, the logic applied to solve real-world problems, complexity analysis, and the chosen approach for implementation.

The project is implemented as a React-based web application named **LCS Visualizer**. It includes a dynamic DP engine, live DP table rendering, algorithm step-through animations, and a forensic-themed interface.

## 2. Problem Definition

The assigned problem is to implement the LCS algorithm and apply it to several domains where sequence similarity is the core requirement. LCS computes the longest subsequence common to two sequences, where the subsequence is not required to be contiguous but must preserve relative order.

In this project, the problem is defined as follows:

- Input: two sequences, which may be text bodies, DNA strings, or code snippets.
- Output: the length of the longest common subsequence, the actual subsequence, and visual representations of how the DP matrix is built.
- Goal: demonstrate algorithmic reasoning, compare sequences in meaningful real-world contexts, and make the algorithm educational through interactive visualization.

The key challenge is to implement the standard LCS algorithm using a 2D DP matrix and to support three case study modes with distinct constraints and output expectations.

## 3. Case Study Topics Solved

This project solves three case studies that rely on detecting similarity between two sequences:

1. **Plagiarism Detection**
   - Compare two large text submissions and compute a similarity percentage.
   - Highlight shared phrases and common subsequences.
   - Emphasize the application of sequence matching for academic integrity analysis.

2. **DNA Sequencing**
   - Compare two genetic strings over the alphabet {A, C, G, T}.
   - Use a monospaced genetic visualization to mimic biological sequence analysis.
   - Emphasize common genetic patterns and sequence alignment.

3. **File Comparison**
   - Compare two code snippets to identify matching source segments.
   - Highlight the common subsequence in green, providing a visual diff-like experience.
   - Show how sequence comparison assists in version control, code review, and forensic comparison.

These topics are chosen because they each represent important real-world problems where sequence similarity matters.

## 4. Applying Topic Logic to Solve Real World Problems

### 4.1 Plagiarism Detection

The plagiarism mode applies LCS to detect similarities between two text passages. In a real educational setting, two student submissions may share long common subsequences even when some words are changed or reordered. The LCS algorithm helps reveal this hidden similarity by:

- converting text into sequences of characters or tokens,
- computing the maximum length of a subsequence that appears in both texts,
- producing a similarity metric based on the subsequence length relative to total text size.

In the app, the results are presented as a `Similarity` percentage and a DP matrix heatmap. The similarity metric is calculated as:

`similarity = (2 * |LCS|) / (|A| + |B|) * 100`

This reflects the fraction of both texts that is shared by the subsequence.

### 4.2 DNA Sequencing

For DNA mode, the problem becomes comparing two biologically meaningful sequences. The project restricts input to only the characters `A`, `C`, `G`, and `T`, which represent nucleotides.

The LCS algorithm is ideal for DNA sequence analysis because it is robust to insertions and deletions while preserving order. In practice, bioinformatics uses sequence alignment to find conserved regions; LCS is a simplified view of that idea.

This project applies the logic by:

- validating and sanitizing genetic input,
- computing the DP matrix to find the longest common nucleotide subsequence,
- rendering the sequences in a monospaced font to simulate genetic alignment,
- highlighting the indices that participate in the recovered common subsequence.

### 4.3 File Comparison

The file diff mode uses LCS to compare code snippets. This behaves similarly to text comparison but with a stronger emphasis on structure and visual diff.

In real-world code comparison, matching subsequences can reveal:

- copied or shared logic,
- code clones,
- refactored common fragments.

The application highlights matched subsequence characters in green, providing an immediate visual signal of overlapping code.

## 5. LCS Algorithm Logic

The core LCS logic is based on dynamic programming. The matrix `dp` is defined such that:

- `dp[i][j]` is the length of LCS for the prefixes `str1[0..i-1]` and `str2[0..j-1]`.
- The DP dimensions are `(m + 1) x (n + 1)` where `m` and `n` are the lengths of the two sequences.

The recurrence relation is:

- If `str1[i - 1] === str2[j - 1]`:
  - `dp[i][j] = 1 + dp[i - 1][j - 1]`
- Otherwise:
  - `dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])`

This formula captures the idea that a matching pair contributes to the subsequence length by extending the previous best subsequence by one. When there is no match, the best result comes from discarding one character from either string and using the larger of the two remaining subsequences.

### 5.1 DP Table Construction

The DP table is filled row-by-row and column-by-column. Each cell is computed using previously solved subproblems. The implemented algorithm records an action for each step, including whether a diagonal match occurred.

The cell-by-cell step-through animation is a key teaching feature. It allows the user to observe how the matrix is built and where each value comes from.

### 5.2 Backtracking

After the DP table is complete, the actual LCS string is recovered by backtracking from `dp[m][n]`:

- Start at `(i, j) = (m, n)`.
- If `str1[i - 1] === str2[j - 1]`, include that character and move diagonally to `(i - 1, j - 1)`.
- Otherwise, move to the neighbor with the larger DP value: either `(i - 1, j)` or `(i, j - 1)`.
- Continue until the indices reach zero.

This produces the LCS in reverse, which is then reversed to obtain the final subsequence.

## 6. Best, Average, and Worst Case Scenarios

When analyzing the assigned definition of LCS, we distinguish the cases by how the input sequences align.

### 6.1 Best Case

The best case occurs when the two sequences are identical or almost identical. In this scenario:

- every comparison that matters results in a match,
- the DP table is still filled completely, but the recovered LCS length is maximal.

A best-case sequence comparison can still require full matrix computation, but the structure of the data is optimally aligned.

### 6.2 Average Case

The average case corresponds to arbitrary sequences with no special structure. In this case:

- approximately half the comparisons may result in a match depending on character distribution,
- the DP table still requires filling all cells,
- the resulting LCS length is intermediate.

From an algorithmic perspective, average-case behavior still requires the same asymptotic resources as the worst case for the standard DP implementation.

### 6.3 Worst Case

The worst case occurs when the two sequences share few or no common characters, or when every decision leads to exploring both options until a maximum is determined. In this situation:

- the DP table is fully computed,
- the backtracking path may require many comparisons along the table edges,
- the LCS length is small or zero.

However, because the DP algorithm is deterministic and tabulates all subproblems, the worst case has the same time complexity as the general case.

## 7. Complexity Analysis

The LCS algorithm implemented in this project has the following complexity characteristics.

### 7.1 Time Complexity

The algorithm visits every cell in the DP matrix exactly once. Each cell computation involves a constant amount of work (comparison and a max operation).

- **Time complexity:** `O(m × n)`

This is the dominating cost. It is true for best, average, and worst cases in the standard DP implementation because the full table is always built.

### 7.2 Space Complexity

The standard implementation uses a 2D matrix with dimensions `(m + 1) x (n + 1)`.

- **Space complexity:** `O(m × n)`

This includes the full DP matrix plus additional storage for backtracking and animations.

### 7.3 Space Optimization

The project includes an explanatory toggle for space optimization. If only the LCS length is required, the DP matrix can be reduced to two rolling rows.

- **Optimized space complexity:** `O(n)`

This optimization works by discarding older rows after they are used. It is possible because each DP cell only depends on the current row and the previous row. However, this technique removes the ability to recover the full backtracking path without extra bookkeeping.

### 7.4 Practical Considerations

For large inputs, `O(m × n)` can become expensive in both time and memory. The animation and visualization in this project are intended for educational use, so the UI is best used with moderately sized inputs.

## 8. Approach Used Based on Topic

### 8.1 Dynamic Programming

Dynamic programming is the natural choice for this assigned problem. The LCS algorithm is a classic textbook DP example because it builds solutions to larger subproblems from smaller subproblems.

The reasoning for choosing dynamic programming is:

- the problem has overlapping subproblems,
- optimal substructure is present because the LCS of prefixes contributes to the LCS of longer strings,
- a memoized or tabulated formulation removes redundant computation.

### 8.2 Why Not Greedy?

A greedy approach would make locally optimal decisions without backtracking to revise them. For LCS, greedy strategies fail because choosing a match too early may prevent a longer overall subsequence from being found.

For example, if sequences diverge and later converge in a different way, greedy decisions can cut off the optimal path.

### 8.3 Why Not Pure Backtracking or Branch and Bound?

Pure backtracking without memoization would be too slow; it would explore exponentially many possible subsequences. Branch and bound could prune some cases, but it is still not efficient enough for the general LCS problem when compared to DP.

Dynamic programming is the correct algorithmic paradigm here, while backtracking is used only as a recovery step once the DP table is computed.

## 9. Implementation Details

### 9.1 React Component Structure

The project implements the LCS visualizer in `src/LCSVisualizer.jsx`. Key pieces include:

- Mode selection between plagiarism, DNA, and file comparison.
- Two input text areas for sequence A and sequence B.
- A step-by-step animation control to advance or reverse the DP table build.
- A live DP table rendered as a heatmap.
- A backtracking visualization with highlighted path cells.
- A complexity panel showing `O(m × n)` for both time and space.
- A space optimization explanation toggle.

### 9.2 Algorithm Engine

The DP engine builds the matrix and stores action metadata for each computed cell. Each action contains:

- coordinates `(i, j)`,
- computed value `dp[i][j]`,
- whether the cell was a match,
- the direction from which the value was derived.

This allows the interface to animate a diagonal arrow on match cells and show the current active cell.

### 9.3 User Experience

The UI is designed with a high-contrast dark theme and neon green accents to evoke a lab or forensic analysis environment. It includes:

- a forensic header and mode pills,
- text input panels with monospaced DNA styling,
- a live DP matrix with color gradient heatmap,
- summary chips for row/column counts and step position,
- code snippet previews for file comparison.

## 10. Project Evaluation

### 10.1 Educational Value

The project is intended to help students and learners understand the LCS algorithm through interactive visualization. It highlights both the DP process and the backtracking recovery step.

### 10.2 Real-World Relevance

The case study modes map directly to real-world applications:

- plagiarism detection for text similarity,
- DNA sequence comparison for genetics and bioinformatics,
- file comparison for code analysis and version control.

### 10.3 Algorithmic Clarity

The project clearly documents the recurrence relation and complexity characteristics. It also explains how the DP table supports efficient subsequence recovery.

## 11. Conclusion

This report captures the complete logic and implementation rationale for the assigned LCS project. The application solves three distinct case studies using the same underlying LCS algorithm, while providing an educational environment for exploring how dynamic programming works.

Key takeaways:

- LCS is a powerful algorithm for sequence similarity.
- Dynamic programming is the correct approach when overlapping subproblems and optimal substructure exist.
- The DP matrix and backtracking path can be visualized to improve understanding.
- The same algorithmic logic can be applied to plagiarism detection, DNA sequencing, and file comparison.

The final application is a polished, interactive React tool that combines algorithm analysis, live DP rendering, and real-time problem-solving for a meaningful DAA presentation.
