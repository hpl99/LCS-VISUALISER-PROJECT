import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modes = [
  {
    key: 'plagiarism',
    label: 'Plagiarism Detection',
    leftPlaceholder: 'Paste student assignment A here...',
    rightPlaceholder: 'Paste student assignment B here...',
    description: 'Compare large text blocks to compute similarity and highlight shared subsequences.',
  },
  {
    key: 'dna',
    label: 'DNA Sequencing',
    leftPlaceholder: 'Enter DNA sequence A (A,C,G,T)...',
    rightPlaceholder: 'Enter DNA sequence B (A,C,G,T)...',
    description: 'Compare biological sequences with restricted ACGT input and monospaced genetic font.',
  },
  {
    key: 'file',
    label: 'File Comparison',
    leftPlaceholder: 'Paste code snippet A...',
    rightPlaceholder: 'Paste code snippet B...',
    description: 'Highlight the common subsequence in green for source code comparison.',
  },
];

function clampText(text, maxLength = 1200) {
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function sanitizeDNA(text) {
  return text.toUpperCase().replace(/[^ACGT]/g, '');
}

function buildActions(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const actions = [];

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const match = str1[i - 1] === str2[j - 1];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i - 1][j] >= dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
      }
      actions.push({
        i,
        j,
        value: dp[i][j],
        match,
        char1: str1[i - 1],
        char2: str2[j - 1],
        from: match ? 'diag' : dp[i - 1][j] >= dp[i][j - 1] ? 'up' : 'left',
      });
    }
  }

  const backtrack = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      backtrack.push([i, j]);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  const pathSet = new Set(backtrack.map(([a, b]) => `${a},${b}`));
  const matchIndices1 = new Set();
  const matchIndices2 = new Set();
  backtrack.forEach(([a, b]) => {
    matchIndices1.add(a - 1);
    matchIndices2.add(b - 1);
  });

  const lcs = backtrack.slice().reverse().map(([a, b]) => str1[a - 1]).join('');
  return { dp, actions, backtrack: backtrack.reverse(), pathSet, matchIndices1, matchIndices2, lcs };
}

function formatSimilarity(str1, str2, lcsLen) {
  if (!str1.length || !str2.length) return '0%';
  const similarity = ((2 * lcsLen) / (str1.length + str2.length)) * 100;
  return `${similarity.toFixed(1)}%`;
}

function highlightCommonSequence(text, indices) {
  return text.split('').map((char, index) => (
    <span key={`${char}-${index}`} className={indices.has(index) ? 'text-highlight' : ''}>
      {char}
    </span>
  ));
}

function DPTable({ dp, currentAction, pathSet, step, actionsLength }) {
  const n = dp[0].length - 1;
  const maxValue = dp.flat().reduce((max, value) => Math.max(max, value), 0) || 1;

  return (
    <div className="dp-table-wrapper">
      <div className="dp-table" style={{ gridTemplateColumns: `repeat(${dp[0].length}, minmax(42px, 1fr))` }}>
        {dp.map((row, i) =>
          row.map((cell, j) => {
            let value = '';
            if (i === 0 && j === 0) {
              value = '';
            } else if (i === 0) {
              value = j;
            } else if (j === 0) {
              value = i;
            } else {
              const actionIndex = (i - 1) * n + (j - 1);
              value = step > actionIndex ? cell : '';
            }
            const isActive = currentAction?.i === i && currentAction?.j === j;
            const isBacktrack = step === actionsLength && pathSet.has(`${i},${j}`);
            const brightness = value ? 20 + Math.round((cell / maxValue) * 60) : 20;
            return (
              <motion.div
                key={`${i}-${j}`}
                className={`dp-cell ${isActive ? 'dp-active' : ''} ${isBacktrack ? 'dp-backtrack' : ''}`}
                layout
                initial={{ opacity: 0.25, scale: 0.95 }}
                animate={{ opacity: 1, scale: isActive || isBacktrack ? 1.03 : 1 }}
                transition={{ duration: 0.18 }}
                style={{ backgroundColor: `hsl(140, 80%, ${brightness}%)` }}
              >
                <span>{value}</span>
                <AnimatePresence>
                  {isActive && currentAction?.match ? (
                    <motion.span
                      className="match-arrow"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      ↖
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function LCSVisualizer() {
  const [activeMode, setActiveMode] = useState('plagiarism');
  const [textA, setTextA] = useState('The quick brown fox jumps over the lazy dog.');
  const [textB, setTextB] = useState('The quick brown fox leaped over a lazy dog.');
  const [step, setStep] = useState(0);
  const [spaceOptimize, setSpaceOptimize] = useState(false);

  const modeConfig = modes.find((mode) => mode.key === activeMode);
  const processedA = activeMode === 'dna' ? sanitizeDNA(textA) : clampText(textA);
  const processedB = activeMode === 'dna' ? sanitizeDNA(textB) : clampText(textB);

  const { dp, actions, backtrack, pathSet, matchIndices1, matchIndices2, lcs } = useMemo(
    () => buildActions(processedA, processedB),
    [processedA, processedB]
  );

  const currentAction = actions[step - 1] || null;
  const similarity = formatSimilarity(processedA, processedB, lcs.length);

  const sciTextA = activeMode === 'dna' ? highlightCommonSequence(processedA, matchIndices1) : null;
  const sciTextB = activeMode === 'dna' ? highlightCommonSequence(processedB, matchIndices2) : null;

  return (
    <div className="visualizer-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">DAA Forensics Lab</p>
          <h1>Longest Common Subsequence Visualizer</h1>
          <p className="subtitle">Live DP exploration for plagiarism, DNA, and file diff analysis.</p>
        </div>
        <div className="mode-pill-container">
          {modes.map((mode) => (
            <button
              key={mode.key}
              className={`mode-pill ${mode.key === activeMode ? 'active' : ''}`}
              onClick={() => {
                setActiveMode(mode.key);
                setStep(0);
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </header>

      <section className="content-grid">
        <div className="panel panel-left">
          <div className="panel-header">
            <h2>{modeConfig.label}</h2>
            <p>{modeConfig.description}</p>
          </div>

          <div className="input-row">
            <div className="field-block">
              <label>Sequence A</label>
              <textarea
                className={activeMode === 'dna' ? 'monospace-input' : ''}
                value={textA}
                onChange={(e) => {
                  setTextA(e.target.value);
                  setStep(0);
                }}
                placeholder={modeConfig.leftPlaceholder}
                rows={activeMode === 'plagiarism' ? 8 : 5}
              />
            </div>
            <div className="field-block">
              <label>Sequence B</label>
              <textarea
                className={activeMode === 'dna' ? 'monospace-input' : ''}
                value={textB}
                onChange={(e) => {
                  setTextB(e.target.value);
                  setStep(0);
                }}
                placeholder={modeConfig.rightPlaceholder}
                rows={activeMode === 'plagiarism' ? 8 : 5}
              />
            </div>
          </div>

          {activeMode === 'file' ? (
            <div className="diff-panel">
              <h3>Common subsequence preview</h3>
              <pre className="code-preview">{step === actions.length ? highlightCommonSequence(textA, matchIndices1) : textA}</pre>
              <pre className="code-preview">{step === actions.length ? highlightCommonSequence(textB, matchIndices2) : textB}</pre>
            </div>
          ) : null}

          {activeMode === 'dna' ? (
            <div className="dna-preview">
              <p className="dna-label">Monospaced DNA preview</p>
              <div className="dna-strings">
                <code>{step === actions.length ? sciTextA : processedA}</code>
                <code>{step === actions.length ? sciTextB : processedB}</code>
              </div>
            </div>
          ) : null}

          <div className="control-card">
            <div className="status-metric">
              <span>Similarity</span>
              <strong>{similarity}</strong>
            </div>
            <div className="status-metric">
              <span>LCS length</span>
              <strong>{step === actions.length ? lcs.length : '?'}</strong>
            </div>
            <button
              className="action-button"
              onClick={() => setStep((prev) => Math.min(prev + 1, actions.length))}
            >
              Advance Step
            </button>
            <button
              className="secondary-button"
              onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            >
              Backstep
            </button>
            <button
              className="secondary-button"
              onClick={() => setStep(actions.length)}
            >
              Fill Table
            </button>
          </div>
        </div>

        <div className="panel panel-right">
          <div className="panel-header">
            <h2>DP Engine</h2>
            <p>Step through matrix computation and inspect the backtracking path in neon forensic style.</p>
          </div>

          <div className="table-summary">
            <div className="summary-chip">Rows: {processedA.length + 1}</div>
            <div className="summary-chip">Cols: {processedB.length + 1}</div>
            <div className="summary-chip">Step: {step}/{actions.length}</div>
          </div>

          <DPTable dp={dp} currentAction={currentAction} pathSet={pathSet} step={step} actionsLength={actions.length} />
          <div className="backtrack-card">
            <h3>Recovered LCS</h3>
            <p className="lcs-value">{step === actions.length ? lcs : <em>Computing...</em>}</p>
          </div>

          <div className="analysis-panel">
            <div className="complexity-block">
              <h3>Complexity</h3>
              <p className="latex">Time: O(m × n)</p>
              <p className="latex">Space: O(m × n)</p>
            </div>
            <div className="toggle-block">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={spaceOptimize}
                  onChange={() => setSpaceOptimize((prev) => !prev)}
                />
                <span>Space Optimization</span>
              </label>
              {spaceOptimize ? (
                <p className="toggle-info">
                  Using a rolling row technique reduces memory to O(n) by discarding previous DP rows and only keeping the current and prior row for value computation.
                </p>
              ) : (
                <p className="toggle-info">
                  Standard DP keeps the full table to preserve the backtracking path and reveal exact subsequence coordinates.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
