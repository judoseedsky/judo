import { useState, useEffect, useCallback, useRef } from 'react';
import './WebsterLookup.css';

const WEBSTER_API_KEY = process.env.REACT_APP_WEBSTER_API_KEY;
const WEBSTER_API_URL = 'https://dictionaryapi.com/api/v3/references/collegiate/json';

// Cache for definitions to avoid repeat API calls
const definitionCache = new Map();

// Build Merriam-Webster audio URL
const getAudioUrl = (audioFile) => {
  if (!audioFile) return null;

  let subdir;
  if (audioFile.startsWith('bix')) {
    subdir = 'bix';
  } else if (audioFile.startsWith('gg')) {
    subdir = 'gg';
  } else if (/^[0-9_]/.test(audioFile)) {
    subdir = 'number';
  } else {
    subdir = audioFile[0];
  }

  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${audioFile}.mp3`;
};

// Generate unique ID for highlights
const generateHighlightId = () => {
  return 'hl-' + Math.random().toString(36).substr(2, 9);
};

// Get storage key for current page
const getStorageKey = () => {
  return `webster-highlights-v2-${window.location.pathname}`;
};

// Load highlights from localStorage
const loadHighlights = () => {
  try {
    const stored = localStorage.getItem(getStorageKey());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save highlights to localStorage
const saveHighlightsToStorage = (highlights) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(highlights));
  } catch {
    // Storage full or unavailable
  }
};

function WebsterLookup({ children, containerRef }) {
  const [selection, setSelection] = useState(null);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [highlights, setHighlights] = useState(loadHighlights);
  const [selectedHighlightId, setSelectedHighlightId] = useState(null);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const audioRef = useRef(null);

  // Apply highlights to text content on mount/update
  useEffect(() => {
    if (!containerRef?.current) return;

    const applyHighlights = () => {
      // Remove existing highlight spans first
      const existingHighlights = containerRef.current.querySelectorAll('.webster-user-highlight');
      existingHighlights.forEach(el => {
        const text = document.createTextNode(el.textContent);
        el.parentNode.replaceChild(text, el);
      });

      // Normalize text nodes
      containerRef.current.normalize();

      if (highlights.length === 0) return;

      // Get full text content and build a map to text nodes
      const textNodes = [];
      const walker = document.createTreeWalker(
        containerRef.current,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;
        textNodes.push(node);
      }

      // Build full text and position map
      let fullText = '';
      const nodePositions = []; // {node, start, end}
      textNodes.forEach(node => {
        const start = fullText.length;
        fullText += node.textContent;
        nodePositions.push({ node, start, end: fullText.length });
      });

      // Apply each highlight
      highlights.forEach(highlight => {
        const { id, text, contextBefore, contextAfter, textStart, textEnd } = highlight;

        let matchStart = -1;

        // Try new format first (textStart/textEnd)
        if (textStart && textEnd) {
          // Find where textStart begins and textEnd ends
          const startIdx = fullText.indexOf(textStart);
          if (startIdx !== -1) {
            const expectedEnd = startIdx + text.length;
            const actualEnd = fullText.indexOf(textEnd, startIdx);
            if (actualEnd !== -1 && actualEnd + textEnd.length === expectedEnd + textEnd.length - textEnd.length + text.slice(-30).length) {
              matchStart = startIdx;
            } else {
              matchStart = startIdx; // Fallback to just using textStart
            }
          }
        }
        // Fallback to old format (contextBefore/contextAfter)
        else if (contextBefore !== undefined) {
          const searchPattern = contextBefore + text + contextAfter;
          const patternIndex = fullText.indexOf(searchPattern);
          if (patternIndex !== -1) {
            matchStart = patternIndex + contextBefore.length;
          }
        }

        if (matchStart === -1) return; // Not found

        const matchEnd = matchStart + text.length;

        // Find which nodes are affected and wrap them
        const affectedNodes = nodePositions.filter(
          np => np.end > matchStart && np.start < matchEnd
        );

        // Process in reverse order to avoid position shifts
        affectedNodes.reverse().forEach(np => {
          const nodeStart = Math.max(0, matchStart - np.start);
          const nodeEnd = Math.min(np.node.textContent.length, matchEnd - np.start);

          if (nodeStart >= nodeEnd) return;

          const beforeText = np.node.textContent.slice(0, nodeStart);
          const highlightText = np.node.textContent.slice(nodeStart, nodeEnd);
          const afterText = np.node.textContent.slice(nodeEnd);

          const fragment = document.createDocumentFragment();
          if (beforeText) fragment.appendChild(document.createTextNode(beforeText));

          const span = document.createElement('span');
          span.className = 'webster-user-highlight';
          span.textContent = highlightText;
          span.dataset.highlightId = id;
          fragment.appendChild(span);

          if (afterText) fragment.appendChild(document.createTextNode(afterText));

          np.node.parentNode.replaceChild(fragment, np.node);
        });
      });
    };

    const timeoutId = setTimeout(applyHighlights, 100);
    return () => clearTimeout(timeoutId);
  }, [highlights, containerRef, children]);

  // Handle text selection
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();

    if (text && text.length > 0 && text.length < 2000) {
      if (containerRef?.current) {
        try {
          const range = sel.getRangeAt(0);
          if (!containerRef.current.contains(range.commonAncestorContainer)) {
            return;
          }
        } catch {
          return;
        }
      }

      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Check if selection is within a highlight span
        const startContainer = range.startContainer;
        // Handle both cases: startContainer is text node (check parent) or element (check itself)
        const highlightSpan = startContainer.nodeType === Node.TEXT_NODE
          ? startContainer.parentElement?.closest('.webster-user-highlight')
          : startContainer.closest?.('.webster-user-highlight') || startContainer.parentElement?.closest('.webster-user-highlight');

        // Store selection info
        const cleanedWord = text.toLowerCase().replace(/[^a-z]/g, '');
        const isSingleWord = !/\s/.test(text);

        setSelection({
          raw: text,
          word: cleanedWord,
          isSingleWord,
          range: range.cloneRange()
        });

        // Check if this exact text is already highlighted at this position
        if (highlightSpan) {
          setSelectedHighlightId(highlightSpan.dataset.highlightId);
        } else {
          setSelectedHighlightId(null);
        }

        setButtonPosition({
          top: rect.top - 45,
          left: rect.left + (rect.width / 2)
        });
        setDefinition(null);
        setError(null);
      } catch {
        // Selection might be invalid
      }
    } else {
      setSelection(null);
      setButtonPosition(null);
      setDefinition(null);
      setPopupPosition(null);
      setSelectedHighlightId(null);
    }
  }, [containerRef]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside the popup (if popup exists)
      const isOutsidePopup = !popupRef.current || !popupRef.current.contains(e.target);
      // Check if click is outside the buttons (if buttons exist)
      const isOutsideButtons = !buttonRef.current || !buttonRef.current.contains(e.target);

      // Close if clicking outside both popup and buttons
      if (isOutsidePopup && isOutsideButtons) {
        setDefinition(null);
        setPopupPosition(null);
        setSelection(null);
        setButtonPosition(null);
        setSelectedHighlightId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const fetchDefinition = async (word) => {
    if (!word) return;

    if (definitionCache.has(word)) {
      setDefinition(definitionCache.get(word));
      return;
    }

    if (!WEBSTER_API_KEY) {
      setError('API key not configured. Add REACT_APP_WEBSTER_API_KEY to .env');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${WEBSTER_API_URL}/${word}?key=${WEBSTER_API_KEY}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch definition');
      }

      if (Array.isArray(data) && data.length > 0) {
        if (typeof data[0] === 'string') {
          const result = {
            word,
            notFound: true,
            suggestions: data.slice(0, 5)
          };
          definitionCache.set(word, result);
          setDefinition(result);
        } else {
          const entry = data[0];
          const audioFile = entry.hwi?.prs?.[0]?.sound?.audio;
          const result = {
            word: entry.meta?.id?.replace(/:\d+$/, '') || word,
            partOfSpeech: entry.fl || '',
            pronunciation: entry.hwi?.prs?.[0]?.mw || '',
            audioUrl: getAudioUrl(audioFile),
            definitions: entry.shortdef || [],
            etymology: entry.et?.[0]?.[1] || ''
          };
          definitionCache.set(word, result);
          setDefinition(result);
        }
      } else {
        setError('No definition found');
      }
    } catch (err) {
      setError('Failed to fetch definition');
    } finally {
      setLoading(false);
    }
  };

  const handleLookupClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selection?.isSingleWord && buttonPosition) {
      setPopupPosition({
        top: buttonPosition.top - 10,
        left: buttonPosition.left
      });
      fetchDefinition(selection.word);
    }
  };

  const handleHighlightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selection?.range) return;

    const range = selection.range;
    const highlightId = generateHighlightId();

    // Collect all text nodes and their offsets within the range
    const collectTextNodesInRange = (range) => {
      const result = [];
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;

      // If start and end are the same text node
      if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
        result.push({
          node: startContainer,
          start: startOffset,
          end: endOffset
        });
        return result;
      }

      // Get common ancestor and walk through all text nodes
      const ancestor = range.commonAncestorContainer;
      const root = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentNode : ancestor;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);

      let node;
      let foundStart = false;
      let foundEnd = false;

      while ((node = walker.nextNode()) && !foundEnd) {
        const isStartNode = node === startContainer;
        const isEndNode = node === endContainer;

        if (isStartNode) foundStart = true;

        if (foundStart && !foundEnd) {
          result.push({
            node: node,
            start: isStartNode ? startOffset : 0,
            end: isEndNode ? endOffset : node.textContent.length
          });
        }

        if (isEndNode) foundEnd = true;
      }

      return result;
    };

    const nodeInfos = collectTextNodesInRange(range);

    // Process in reverse order to avoid DOM position shifts
    for (let i = nodeInfos.length - 1; i >= 0; i--) {
      const { node, start, end } = nodeInfos[i];

      if (start >= end || !node.parentNode) continue;

      const beforeText = node.textContent.slice(0, start);
      const highlightText = node.textContent.slice(start, end);
      const afterText = node.textContent.slice(end);

      const fragment = document.createDocumentFragment();
      if (beforeText) fragment.appendChild(document.createTextNode(beforeText));

      const span = document.createElement('span');
      span.className = 'webster-user-highlight';
      span.textContent = highlightText;
      span.dataset.highlightId = highlightId;
      fragment.appendChild(span);

      if (afterText) fragment.appendChild(document.createTextNode(afterText));

      node.parentNode.replaceChild(fragment, node);
    }

    // Store highlight info for persistence
    const newHighlight = {
      id: highlightId,
      text: selection.raw,
      textStart: selection.raw.slice(0, 30),
      textEnd: selection.raw.slice(-30)
    };

    const newHighlights = [...highlights, newHighlight];
    setHighlights(newHighlights);
    saveHighlightsToStorage(newHighlights);

    // Clear selection UI
    setSelection(null);
    setButtonPosition(null);
    setSelectedHighlightId(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleRemoveHighlightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedHighlightId) {
      const newHighlights = highlights.filter(h => h.id !== selectedHighlightId);
      setHighlights(newHighlights);
      saveHighlightsToStorage(newHighlights);
    }

    // Clear selection UI
    setSelection(null);
    setButtonPosition(null);
    setSelectedHighlightId(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleClose = () => {
    setDefinition(null);
    setPopupPosition(null);
    setSelection(null);
    setButtonPosition(null);
    setSelectedHighlightId(null);
    window.getSelection()?.removeAllRanges();
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const canLookup = selection?.isSingleWord;
  const isHighlighted = selectedHighlightId !== null;

  return (
    <>
      {children}

      {/* Lookup & Highlight Buttons - Fixed positioning */}
      {buttonPosition && selection && !definition && !loading && (
        <div
          ref={buttonRef}
          className="webster-btn-group"
          style={{
            position: 'fixed',
            top: Math.max(10, buttonPosition.top),
            left: Math.min(Math.max(80, buttonPosition.left), window.innerWidth - 80)
          }}
        >
          {canLookup && !isHighlighted && (
            <button
              className="webster-lookup-btn"
              onClick={handleLookupClick}
              onTouchEnd={handleLookupClick}
            >
              Lookup
            </button>
          )}
          {isHighlighted ? (
            <button
              className="webster-highlight-btn remove-highlight"
              onClick={handleRemoveHighlightClick}
              onTouchEnd={handleRemoveHighlightClick}
            >
              Remove Highlight
            </button>
          ) : (
            <button
              className={`webster-highlight-btn ${!canLookup ? 'highlight-only' : ''}`}
              onClick={handleHighlightClick}
              onTouchEnd={handleHighlightClick}
            >
              Highlight
            </button>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {loading && popupPosition && (
        <div
          className="webster-popup"
          style={{
            position: 'fixed',
            top: Math.max(10, popupPosition.top),
            left: Math.min(Math.max(100, popupPosition.left), window.innerWidth - 100)
          }}
        >
          <div className="webster-loading">Looking up...</div>
        </div>
      )}

      {/* Definition Popup */}
      {definition && popupPosition && (
        <div
          ref={popupRef}
          className="webster-popup"
          style={{
            position: 'fixed',
            top: Math.max(10, popupPosition.top),
            left: Math.min(Math.max(100, popupPosition.left), window.innerWidth - 100)
          }}
        >
          <button className="webster-close" onClick={handleClose}>&times;</button>

          {definition.notFound ? (
            <div className="webster-not-found">
              <div className="webster-word">{definition.word}</div>
              <p>Word not found. Did you mean:</p>
              <ul>
                {definition.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="webster-header">
                <span className="webster-word">{definition.word}</span>
                {definition.partOfSpeech && (
                  <span className="webster-pos">{definition.partOfSpeech}</span>
                )}
                {definition.audioUrl && (
                  <button className="webster-audio-btn" onClick={playAudio} aria-label="Play pronunciation">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </button>
                )}
              </div>
              {definition.pronunciation && (
                <div className="webster-pronunciation">/{definition.pronunciation}/</div>
              )}
              <ol className="webster-definitions">
                {definition.definitions.map((def, i) => (
                  <li key={i}>{def}</li>
                ))}
              </ol>
              {definition.audioUrl && (
                <audio ref={audioRef} src={definition.audioUrl} />
              )}
            </>
          )}

          <div className="webster-attribution">
            Merriam-Webster
          </div>
        </div>
      )}

      {/* Error display */}
      {error && popupPosition && (
        <div
          className="webster-popup webster-error"
          style={{
            position: 'fixed',
            top: Math.max(10, popupPosition.top),
            left: Math.min(Math.max(100, popupPosition.left), window.innerWidth - 100)
          }}
        >
          <button className="webster-close" onClick={handleClose}>&times;</button>
          <div className="webster-word">{selection?.word}</div>
          <p>{error}</p>
        </div>
      )}
    </>
  );
}

export default WebsterLookup;
