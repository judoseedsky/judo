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

      // Apply each highlight - find by context (before + text + after)
      highlights.forEach(highlight => {
        const { id, text, contextBefore, contextAfter } = highlight;

        const walker = document.createTreeWalker(
          containerRef.current,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let node;
        while ((node = walker.nextNode())) {
          if (node.parentNode.classList?.contains('webster-user-highlight')) continue;
          if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;

          const nodeText = node.textContent;
          const searchPattern = contextBefore + text + contextAfter;
          const patternIndex = nodeText.indexOf(searchPattern);

          if (patternIndex !== -1) {
            const textStartIndex = patternIndex + contextBefore.length;
            const textEndIndex = textStartIndex + text.length;

            // Split the text node and wrap the highlight
            const before = nodeText.slice(0, textStartIndex);
            const highlighted = nodeText.slice(textStartIndex, textEndIndex);
            const after = nodeText.slice(textEndIndex);

            const fragment = document.createDocumentFragment();
            if (before) fragment.appendChild(document.createTextNode(before));

            const span = document.createElement('span');
            span.className = 'webster-user-highlight';
            span.textContent = highlighted;
            span.dataset.highlightId = id;
            fragment.appendChild(span);

            if (after) fragment.appendChild(document.createTextNode(after));

            node.parentNode.replaceChild(fragment, node);
            break; // Only highlight first match for this specific highlight
          }
        }
      });
    };

    const timeoutId = setTimeout(applyHighlights, 100);
    return () => clearTimeout(timeoutId);
  }, [highlights, containerRef, children]);

  // Handle text selection
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();

    if (text && text.length > 0 && text.length < 100) {
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

    // Get context around the selection for precise matching later
    const range = selection.range;
    const textNode = range.startContainer;
    const fullText = textNode.textContent || '';
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    // Get some context before and after (up to 20 chars)
    const contextBefore = fullText.slice(Math.max(0, startOffset - 20), startOffset);
    const contextAfter = fullText.slice(endOffset, Math.min(fullText.length, endOffset + 20));

    const newHighlight = {
      id: generateHighlightId(),
      text: selection.raw,
      contextBefore,
      contextAfter
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
