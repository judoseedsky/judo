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

// Get storage key for current page
const getStorageKey = () => {
  return `webster-highlights-${window.location.pathname}`;
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
const saveHighlights = (highlights) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(highlights));
  } catch {
    // Storage full or unavailable
  }
};

function WebsterLookup({ children, containerRef }) {
  const [selection, setSelection] = useState(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [highlights, setHighlights] = useState(loadHighlights);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const audioRef = useRef(null);

  // Apply highlights to text content
  useEffect(() => {
    if (!containerRef?.current || highlights.length === 0) return;

    const applyHighlights = () => {
      // Remove existing highlights first
      const existingHighlights = containerRef.current.querySelectorAll('.webster-user-highlight');
      existingHighlights.forEach(el => {
        const text = document.createTextNode(el.textContent);
        el.parentNode.replaceChild(text, el);
      });

      // Normalize text nodes after removing highlights
      containerRef.current.normalize();

      // Apply new highlights
      const walker = document.createTreeWalker(
        containerRef.current,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      highlights.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        textNodes.forEach(textNode => {
          if (textNode.parentNode.classList?.contains('webster-user-highlight')) return;
          if (textNode.parentNode.tagName === 'SCRIPT' || textNode.parentNode.tagName === 'STYLE') return;

          const text = textNode.textContent;
          if (regex.test(text)) {
            regex.lastIndex = 0;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
              if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
              }
              const span = document.createElement('span');
              span.className = 'webster-user-highlight';
              span.textContent = match[1];
              fragment.appendChild(span);
              lastIndex = regex.lastIndex;
            }

            if (lastIndex < text.length) {
              fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            if (fragment.childNodes.length > 0) {
              textNode.parentNode.replaceChild(fragment, textNode);
            }
          }
        });
      });
    };

    // Delay to ensure content is rendered
    const timeoutId = setTimeout(applyHighlights, 100);
    return () => clearTimeout(timeoutId);
  }, [highlights, containerRef, children]);

  // Handle text selection
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();

    if (text && text.length > 0 && text.length < 100) {
      if (containerRef?.current) {
        const range = sel.getRangeAt(0);
        if (!containerRef.current.contains(range.commonAncestorContainer)) {
          return;
        }
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Store both raw text (for highlight) and cleaned single word (for lookup)
      const cleanedWord = text.toLowerCase().replace(/[^a-z]/g, '');
      const isSingleWord = !/\s/.test(text);

      setSelection({
        raw: text,
        word: cleanedWord,
        isSingleWord
      });
      setSelectionRange(range.cloneRange());
      setButtonPosition({
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX + (rect.width / 2)
      });
      setDefinition(null);
      setError(null);
    } else {
      setSelection(null);
      setSelectionRange(null);
      setButtonPosition(null);
      setDefinition(null);
      setPopupPosition(null);
    }
  }, [containerRef]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setDefinition(null);
        setPopupPosition(null);
        setSelection(null);
        setButtonPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLookupClick = () => {
    if (selection?.isSingleWord && buttonPosition) {
      setPopupPosition({
        top: buttonPosition.top - 10,
        left: buttonPosition.left
      });
      fetchDefinition(selection.word);
    }
  };

  const handleHighlightClick = () => {
    if (selection?.raw && !highlights.includes(selection.raw.toLowerCase())) {
      const newHighlights = [...highlights, selection.raw.toLowerCase()];
      setHighlights(newHighlights);
      saveHighlights(newHighlights);
    }
    // Clear selection UI
    setSelection(null);
    setButtonPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleClose = () => {
    setDefinition(null);
    setPopupPosition(null);
    setSelection(null);
    setButtonPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const isAlreadyHighlighted = selection?.raw && highlights.includes(selection.raw.toLowerCase());
  const canLookup = selection?.isSingleWord;

  return (
    <>
      {children}

      {/* Lookup & Highlight Buttons */}
      {buttonPosition && selection && !definition && !loading && (
        <div
          ref={buttonRef}
          className="webster-btn-group"
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left
          }}
        >
          {canLookup && (
            <button className="webster-lookup-btn" onClick={handleLookupClick}>
              Lookup
            </button>
          )}
          <button
            className={`webster-highlight-btn ${isAlreadyHighlighted ? 'already-highlighted' : ''} ${!canLookup ? 'highlight-only' : ''}`}
            onClick={handleHighlightClick}
            disabled={isAlreadyHighlighted}
          >
            {isAlreadyHighlighted ? 'Highlighted' : 'Highlight'}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && popupPosition && (
        <div
          className="webster-popup"
          style={{
            top: popupPosition.top,
            left: popupPosition.left
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
            top: popupPosition.top,
            left: popupPosition.left
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
            top: popupPosition.top,
            left: popupPosition.left
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
