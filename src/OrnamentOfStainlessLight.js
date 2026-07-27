import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import WebsterLookup from './components/WebsterLookup';

// Tooltip component for hover display (with touch support)
function Tooltip({ children, content, type }) {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [show]);

  return (
    <span
      ref={wrapperRef}
      className={`tooltip-wrapper tooltip-${type}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShow(!show);
      }}
    >
      {children}
      {show && content && (
        <span className="tooltip-content">
          {content}
        </span>
      )}
    </span>
  );
}

function OrnamentOfStainlessLight() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [currentSection, setCurrentSection] = useState('introduction');
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedGlossary, setExpandedGlossary] = useState({});
  const [expandedNoteSections, setExpandedNoteSections] = useState({});
  const [notesLookup, setNotesLookup] = useState({});
  const [glossaryLookup, setGlossaryLookup] = useState({});
  const [noteSourceMap, setNoteSourceMap] = useState({}); // Map note number -> section where it appears
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSearchResult, setActiveSearchResult] = useState(null);
  const [highlightNoteNum, setHighlightNoteNum] = useState(null); // Note number to highlight
  const [allContent, setAllContent] = useState({}); // All sections content for search
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);

  const toggleNoteSection = (idx) => {
    setExpandedNoteSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const sections = useMemo(() => [
    { id: 'introduction', name: 'Introduction', file: 'ornament_introduction.txt' },
    { id: 'part1', name: 'Part 1', file: 'ornament_part1_external.txt' },
    { id: 'part2', name: 'Part 2', file: 'ornament_part2_inner.txt' },
    { id: 'part3', name: 'Part 3', file: 'ornament_part3_initiations.txt' },
    { id: 'part4', name: 'Part 4', file: 'ornament_part4_sadhana.txt' },
    { id: 'part5', name: 'Part 5', file: 'ornament_part5_gnosis.txt' },
    { id: 'appendixes', name: 'Appendixes', file: 'ornament_appendixes.txt' },
    { id: 'notes', name: 'Notes', file: 'ornament_notes.txt' },
    { id: 'glossary', name: 'Glossary', file: 'ornament_glossary.txt' },
  ], []);

  // Load all sections content for search and build note source map
  const loadAllContent = async () => {
    if (Object.keys(allContent).length > 0) {
      return { content: allContent, noteMap: noteSourceMap };
    }
    const contentMap = {};
    const noteMap = {};
    await Promise.all(sections.map(async (section) => {
      try {
        const response = await fetch(`/texts/${section.file}`);
        const text = await response.text();
        contentMap[section.id] = text;

        // Find all note references (^num^) in this section
        const noteRefs = text.matchAll(/\^(\d+)\^/g);
        for (const match of noteRefs) {
          const noteNum = match[1];
          if (!noteMap[noteNum]) {
            noteMap[noteNum] = section.id;
          }
        }
      } catch (err) {
        contentMap[section.id] = '';
      }
    }));
    setAllContent(contentMap);
    setNoteSourceMap(noteMap);
    return { content: contentMap, noteMap };
  };

  // Navigate to a note reference in the text
  const navigateToNoteInText = async (noteNum) => {
    // Load all content if needed to get note source map
    // Use returned noteMap directly since state updates are async
    let sourceMap = noteSourceMap;
    if (Object.keys(noteSourceMap).length === 0) {
      const { noteMap } = await loadAllContent();
      sourceMap = noteMap;
    }

    const sourceSection = sourceMap[noteNum];
    if (sourceSection) {
      // Switch to the section containing the note
      setCurrentSection(sourceSection);
      setHighlightNoteNum(noteNum);

      // Expand all chapters first so the note reference is rendered
      // We need to do this before we can find the element
      setTimeout(() => {
        // Expand all chapters by setting all possible indices to true
        // We use a range of indices since parseChapters() may have non-chapter content mixed in
        const expandAll = {};
        for (let i = 0; i < 100; i++) {
          expandAll[i] = true;
        }
        setExpandedChapters(expandAll);

        // After chapters expand, find and scroll to the note
        setTimeout(() => {
          const noteRef = document.querySelector(`sup.note-ref[data-note="${noteNum}"]`);
          if (noteRef) {
            noteRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Clear highlight after animation
            setTimeout(() => setHighlightNoteNum(null), 3000);
          }
        }, 300);
      }, 300);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    // Load all content if not already loaded
    const { content: loadedContent } = Object.keys(allContent).length > 0
      ? { content: allContent }
      : await loadAllContent();
    const contentToSearch = loadedContent;

    const matches = [];

    // Search across all sections
    sections.forEach((section) => {
      const sectionContent = contentToSearch[section.id] || '';
      const parts = sectionContent.split('\n---\n');

      parts.forEach((part, chapterIdx) => {
        const chapterMatch = part.match(/^## (.+)\n/);
        const chapterTitle = chapterMatch ? chapterMatch[1].trim() : null;

        const partRegex = new RegExp(query, 'gi');
        let partMatch;
        while ((partMatch = partRegex.exec(part)) !== null) {
          const start = Math.max(0, partMatch.index - 40);
          const end = Math.min(part.length, partMatch.index + query.length + 40);
          matches.push({
            text: part.slice(start, end),
            sectionId: section.id,
            sectionName: section.name,
            chapterIdx,
            chapterTitle,
            matchText: partMatch[0]
          });
          if (matches.length >= 50) break;
        }
        if (matches.length >= 50) return;
      });
      if (matches.length >= 50) return;
    });

    setSearchResults(matches);
  };

  const navigateToResult = (result) => {
    // Switch to the correct section if needed
    if (result.sectionId && result.sectionId !== currentSection) {
      setCurrentSection(result.sectionId);
    }

    // Store the search query for highlighting after section loads
    setActiveSearchResult(result.matchText);

    // Close search panel
    setSearchOpen(false);

    // Wait for section to load, then expand all sections
    setTimeout(() => {
      // Expand ALL chapters by setting all possible indices to true
      const expandAll = {};
      for (let i = 0; i < 100; i++) {
        expandAll[i] = true;
      }
      setExpandedChapters(expandAll);

      // Also expand note sections if navigating to Notes
      if (result.sectionId === 'notes') {
        setExpandedNoteSections(expandAll);
      }

      // Also expand glossary entries if navigating to Glossary
      if (result.sectionId === 'glossary') {
        setExpandedGlossary(expandAll);
      }

      // After sections expand, scroll to the highlight
      setTimeout(() => {
        const highlights = document.querySelectorAll('mark.search-highlight');
        if (highlights.length > 0) {
          highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }, 300);
  };

  const toggleGlossary = (idx) => {
    setExpandedGlossary(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Load notes and glossary for tooltips
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        // Load notes
        const notesResponse = await fetch('/texts/ornament_notes.txt');
        const notesText = await notesResponse.text();
        const notesMap = {};
        const noteMatches = notesText.matchAll(/@@ (\d+)\s+([^\n]+(?:\n(?!@@)[^\n]+)*)/g);
        for (const match of noteMatches) {
          notesMap[match[1]] = match[2].trim();
        }
        setNotesLookup(notesMap);

        // Load glossary
        const glossaryResponse = await fetch('/texts/ornament_glossary.txt');
        const glossaryText = await glossaryResponse.text();
        const glossaryMap = {};
        const glossaryMatches = glossaryText.matchAll(/%% \*\*([^*]+)\*\*\s*([^\n]+(?:\n(?!%%)[^\n]+)*)/g);
        for (const match of glossaryMatches) {
          // Store with lowercase key for case-insensitive matching
          const term = match[1].trim().toLowerCase();
          glossaryMap[term] = {
            term: match[1].trim(),
            definition: match[2].trim()
          };
        }
        setGlossaryLookup(glossaryMap);
      } catch (err) {
        console.error('Error loading reference data:', err);
      }
    };
    loadReferenceData();
  }, []);

  useEffect(() => {
    const loadSection = async () => {
      setLoading(true);
      setExpandedChapters({});
      setExpandedGlossary({});
      setExpandedNoteSections({});
      const section = sections.find(s => s.id === currentSection);
      if (section) {
        try {
          const response = await fetch(`/texts/${section.file}`);
          const text = await response.text();
          setContent(text);
        } catch (err) {
          setContent('Error loading content');
        }
      }
      setLoading(false);
    };
    loadSection();
  }, [currentSection, sections]);

  const toggleChapter = (idx) => {
    setExpandedChapters(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const parseChapters = () => {
    if (!content) return [];

    const parts = content.split('\n---\n');
    const chapters = [];

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      const chapterMatch = trimmed.match(/^## (.+)\n([\s\S]*)/);
      if (chapterMatch) {
        chapters.push({
          title: chapterMatch[1].trim(),
          body: chapterMatch[2].trim(),
          isChapter: true
        });
      } else {
        chapters.push({
          title: null,
          body: trimmed,
          isChapter: false
        });
      }
    }

    return chapters;
  };

  const highlightSearch = (text) => {
    if (!searchQuery || searchQuery.length < 2) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  // Wrap glossary terms in tooltips wherever they appear in plain text
  const wrapGlossaryTerms = (text, keyPrefix = '') => {
    if (!text || Object.keys(glossaryLookup).length === 0) {
      return highlightSearch(text);
    }

    // Sort terms by length (longest first) to match multi-word terms before single words
    const terms = Object.keys(glossaryLookup).sort((a, b) => b.length - a.length);

    // Create regex pattern for all terms (word boundaries, case insensitive)
    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

    const parts = text.split(pattern);

    return parts.map((part, i) => {
      const termLower = part.toLowerCase();
      const glossaryEntry = glossaryLookup[termLower];
      if (glossaryEntry) {
        return (
          <Tooltip key={`${keyPrefix}${i}`} content={glossaryEntry.definition} type="glossary">
            <span className="glossary-term-auto">{highlightSearch(part)}</span>
          </Tooltip>
        );
      }
      return highlightSearch(part);
    });
  };

  const renderText = (text) => {
    // Handle bold **text**, italics _text_, superscripts ^num^, and section markers [num]
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\^[^^]+\^|\[\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{wrapGlossaryTerms(part.slice(2, -2), `b${i}-`)}</strong>;
      }
      if (part.startsWith('_') && part.endsWith('_')) {
        const term = part.slice(1, -1);
        const termLower = term.toLowerCase().replace(/[.,;:!?]$/, ''); // Remove trailing punctuation for lookup
        const glossaryEntry = glossaryLookup[termLower];
        if (glossaryEntry) {
          return (
            <Tooltip key={i} content={glossaryEntry.definition} type="glossary">
              <em className="glossary-term">{highlightSearch(term)}</em>
            </Tooltip>
          );
        }
        return <em key={i}>{highlightSearch(term)}</em>;
      }
      if (part.startsWith('^') && part.endsWith('^')) {
        const noteNum = part.slice(1, -1);
        const noteContent = notesLookup[noteNum];
        const isHighlighted = highlightNoteNum === noteNum;
        if (noteContent) {
          return (
            <Tooltip key={i} content={noteContent} type="note">
              <sup
                className={`note-ref ${isHighlighted ? 'note-highlighted' : ''}`}
                data-note={noteNum}
              >
                {noteNum}
              </sup>
            </Tooltip>
          );
        }
        return <sup key={i} data-note={noteNum}>{noteNum}</sup>;
      }
      if (part.match(/^\[\d+\]$/)) {
        return <span key={i} className="section-marker">{part}</span>;
      }
      return wrapGlossaryTerms(part, `t${i}-`);
    });
  };

  const renderChapterContent = (body) => {
    if (!body) return null;
    return body.split('\n\n').map((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Part header (PART 1, PART 2, etc.)
      if (trimmed.startsWith('&&PART&& ')) {
        return <div key={idx} className="part-number">{trimmed.slice(9)}</div>;
      }

      // Part title
      if (trimmed.startsWith('&&PARTTITLE&& ')) {
        return <div key={idx} className="part-title">{trimmed.slice(14)}</div>;
      }

      // Chapter subtitle
      if (trimmed.startsWith('&&SUBTITLE&& ')) {
        return <p key={idx} className="chapter-subtitle">{renderText(trimmed.slice(13))}</p>;
      }

      // Sub-heading
      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} className="section-heading">{renderText(trimmed.slice(4))}</h4>;
      }

      // Block quote (>>>)
      if (trimmed.startsWith('>>> ')) {
        return (
          <blockquote key={idx}>
            <p>{renderText(trimmed.slice(4).trim())}</p>
          </blockquote>
        );
      }

      // Verse lines (>)
      if (trimmed.startsWith('> ')) {
        const lines = trimmed.split('\n').map(l => l.replace(/^> /, ''));
        return (
          <div key={idx} className="verse">
            {lines.map((line, i) => <div key={i}>{renderText(line)}</div>)}
          </div>
        );
      }

      // Bullet list item
      if (trimmed.startsWith('* ')) {
        return <p key={idx} className="list-item">{renderText(trimmed.slice(2))}</p>;
      }

      // Numbered/outline list item (already has numbers in text)
      if (trimmed.startsWith('@ ')) {
        return <p key={idx} className="outline-item">{renderText(trimmed.slice(2))}</p>;
      }

      // Glossary entry
      if (trimmed.startsWith('%% ')) {
        const entry = trimmed.slice(3);
        // Parse: **term** _(translation)._ Definition
        const termMatch = entry.match(/^\*\*([^*]+)\*\*\s*(.*)/);
        if (termMatch) {
          const isExpanded = expandedGlossary[idx];
          return (
            <div key={idx} className={`glossary-entry ${isExpanded ? 'expanded' : ''}`}>
              <dt onClick={() => toggleGlossary(idx)}>
                {highlightSearch(termMatch[1])}
                <span className="glossary-toggle">{isExpanded ? '−' : '+'}</span>
              </dt>
              {isExpanded && <dd>{renderText(termMatch[2])}</dd>}
            </div>
          );
        }
        return <p key={idx}>{renderText(entry)}</p>;
      }

      // Note entry
      if (trimmed.startsWith('@@ ')) {
        const entry = trimmed.slice(3);
        // Parse: number text
        const noteMatch = entry.match(/^(\d+)\s+(.*)/);
        if (noteMatch) {
          return (
            <div key={idx} className="note-entry">
              <span
                className="note-number note-link"
                onClick={() => navigateToNoteInText(noteMatch[1])}
                title="Click to find in text"
              >
                {noteMatch[1]}
              </span>
              <span className="note-text">{renderText(noteMatch[2])}</span>
            </div>
          );
        }
        return <p key={idx}>{renderText(entry)}</p>;
      }

      // Image
      const imageMatch = trimmed.match(/^!\[image\]\(([^)]+)\)$/);
      if (imageMatch) {
        return (
          <figure key={idx} className="diagram">
            <img src={`/texts/${imageMatch[1]}`} alt="Diagram" />
          </figure>
        );
      }

      // Regular paragraph
      return <p key={idx}>{renderText(trimmed)}</p>;
    });
  };

  const renderContent = () => {
    const chapters = parseChapters();

    // For notes, group by section headers and make collapsible
    if (currentSection === 'notes') {
      const noteSections = [];
      let currentSectionTitle = null;
      let currentSectionContent = [];

      // Parse all chapter bodies to find ### sections
      chapters.forEach(chapter => {
        if (chapter.body) {
          const parts = chapter.body.split(/\n\n/);
          parts.forEach(part => {
            const trimmed = part.trim();
            if (trimmed.startsWith('### ')) {
              // Save previous section
              if (currentSectionTitle || currentSectionContent.length) {
                noteSections.push({ title: currentSectionTitle, content: currentSectionContent });
              }
              currentSectionTitle = trimmed.slice(4).replace(/^_|_$/g, '');
              currentSectionContent = [];
            } else if (trimmed) {
              currentSectionContent.push(trimmed);
            }
          });
        }
      });
      // Don't forget last section
      if (currentSectionTitle || currentSectionContent.length) {
        noteSections.push({ title: currentSectionTitle, content: currentSectionContent });
      }

      return noteSections.map((section, idx) => {
        const isExpanded = expandedNoteSections[idx];
        return (
          <div key={idx} className="note-section">
            <h3 onClick={() => toggleNoteSection(idx)} style={{ cursor: 'pointer' }}>
              <span>{highlightSearch(section.title || 'Notes')}</span>
              <span style={{ float: 'right', fontSize: '0.8em' }}>{isExpanded ? '▲' : '▼'}</span>
            </h3>
            {isExpanded && (
              <div className="note-section-content">
                {section.content.map((item, i) => {
                  // Render each note item
                  if (item.startsWith('@@ ')) {
                    const entry = item.slice(3);
                    const noteMatch = entry.match(/^(\d+)\s+(.*)/s);
                    if (noteMatch) {
                      return (
                        <div key={i} className="note-entry">
                          <span
                            className="note-number note-link"
                            onClick={() => navigateToNoteInText(noteMatch[1])}
                            title="Click to find in text"
                          >
                            {noteMatch[1]}
                          </span>
                          <span className="note-text">{renderText(noteMatch[2])}</span>
                        </div>
                      );
                    }
                  }
                  return <p key={i}>{renderText(item)}</p>;
                })}
              </div>
            )}
          </div>
        );
      });
    }

    return chapters.map((chapter, idx) => {
      const isExpanded = expandedChapters[idx];

      if (!chapter.isChapter) {
        return (
          <div key={idx}>
            {renderChapterContent(chapter.body)}
          </div>
        );
      }

      return (
        <div key={idx} className={`accordion-chapter ${isExpanded ? 'expanded' : ''}`}>
          <h2
            onClick={() => toggleChapter(idx)}
            style={{ cursor: 'pointer' }}
          >
            <span>{chapter.title}</span>
            <span style={{ float: 'right', fontSize: '0.7em' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </h2>

          {isExpanded && (
            <div className="chapter-content">
              {renderChapterContent(chapter.body)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="App">
      <div className="page-content hymn-page">
        <button className="back-btn" onClick={() => navigate('/nomothetes')}>
          &larr; Back
        </button>

        <nav className="chapter-nav expanded ornament-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className="nav-section-btn"
              onClick={() => setCurrentSection(section.id)}
              style={currentSection === section.id ? { background: 'rgba(255,255,255,0.3)' } : {}}
            >
              <span className="ch-name">{section.name}</span>
            </button>
          ))}
          <button
            className="nav-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </nav>

        <div className="scroll-container" ref={scrollContainerRef}>
          <div className="scroll-top"></div>
          <WebsterLookup containerRef={contentRef}>
          <div className="hymn-text" ref={contentRef}>
            <h1 className="scroll-title">Ornament of Stainless Light</h1>
            <p className="scroll-subtitle">An Exposition of the Kālacakra Tantra</p>
            <p className="hymn-attribution">
              Khedrup Norsang Gyatso (1423-1513)<br/>
              Translated by Gavin Kilty
            </p>

            {loading ? (
              <p style={{textAlign: 'center'}}>Loading...</p>
            ) : (
              renderContent()
            )}

            <p className="hymn-ending"><em>From The Library of Tibetan Classics, Volume 14</em></p>
            <p className="hymn-attribution">Wisdom Publications</p>
          </div>
          </WebsterLookup>
          <div className="scroll-bottom"></div>
        </div>

        {/* Search Overlay Panel */}
        {searchOpen && (
          <div className="search-overlay">
            <div className="search-panel">
              <div className="search-header">
                <input
                  type="text"
                  placeholder="Search within text..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
                <button
                  className="search-close"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="search-results-panel">
                {searchQuery.length < 2 ? (
                  <p className="search-hint">Type at least 2 characters to search</p>
                ) : searchResults.length === 0 ? (
                  <p className="search-hint">No results found</p>
                ) : (
                  <>
                    <p className="search-count">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
                    {searchResults.map((result, i) => (
                      <div
                        key={i}
                        className="search-result-item"
                        onClick={() => navigateToResult(result)}
                      >
                        <span className="search-result-section">
                          {result.sectionName}{result.chapterTitle ? ` › ${result.chapterTitle}` : ''}
                        </span>
                        <span className="search-result-text">
                          ...{result.text.replace(/\n/g, ' ').replace(/[#*_>@%]/g, '')}...
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrnamentOfStainlessLight;
