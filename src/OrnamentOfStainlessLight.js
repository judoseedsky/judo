import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';

// Tooltip component for hover display
function Tooltip({ children, content, type }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className={`tooltip-wrapper tooltip-${type}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
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
  const [expandedNotes, setExpandedNotes] = useState({});
  const [expandedNoteSections, setExpandedNoteSections] = useState({});
  const [notesLookup, setNotesLookup] = useState({});
  const [glossaryLookup, setGlossaryLookup] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  const toggleNoteSection = (idx) => {
    setExpandedNoteSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    // Find matches in current content with chapter context
    const matches = [];

    // Split content into chapters to track which chapter each match is in
    const parts = content.split('\n---\n');
    let cumulativeIndex = 0;

    parts.forEach((part, chapterIdx) => {
      const chapterMatch = part.match(/^## (.+)\n/);
      const chapterTitle = chapterMatch ? chapterMatch[1].trim() : null;

      let partMatch;
      const partRegex = new RegExp(query, 'gi');
      while ((partMatch = partRegex.exec(part)) !== null) {
        const globalIndex = cumulativeIndex + partMatch.index;
        const start = Math.max(0, partMatch.index - 40);
        const end = Math.min(part.length, partMatch.index + query.length + 40);
        matches.push({
          text: part.slice(start, end),
          index: globalIndex,
          chapterIdx,
          chapterTitle,
          matchText: partMatch[0]
        });
        if (matches.length >= 30) break;
      }
      cumulativeIndex += part.length + 5; // +5 for '\n---\n'
      if (matches.length >= 30) return;
    });

    setSearchResults(matches);
  };

  const navigateToResult = (result) => {
    // Expand the chapter containing the match
    setExpandedChapters(prev => ({
      ...prev,
      [result.chapterIdx]: true
    }));

    // Close search panel
    setSearchOpen(false);

    // Scroll to the match after a short delay (to allow chapter to expand)
    setTimeout(() => {
      const highlights = document.querySelectorAll('mark.search-highlight');
      if (highlights.length > 0) {
        highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const toggleGlossary = (idx) => {
    setExpandedGlossary(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleNote = (idx) => {
    setExpandedNotes(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

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
      setExpandedNotes({});
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
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  const renderText = (text) => {
    // Handle bold **text**, italics _text_, superscripts ^num^, and section markers [num]
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\^[^^]+\^|\[\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{highlightSearch(part.slice(2, -2))}</strong>;
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
        if (noteContent) {
          return (
            <Tooltip key={i} content={noteContent} type="note">
              <sup className="note-ref">{noteNum}</sup>
            </Tooltip>
          );
        }
        return <sup key={i}>{noteNum}</sup>;
      }
      if (part.match(/^\[\d+\]$/)) {
        return <span key={i} className="section-marker">{part}</span>;
      }
      return highlightSearch(part);
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
                {termMatch[1]}
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
          const isExpanded = expandedNotes[idx];
          return (
            <div key={idx} className={`note-entry ${isExpanded ? 'expanded' : ''}`}>
              <div className="note-header" onClick={() => toggleNote(idx)}>
                <span className="note-number">{noteMatch[1]}</span>
                <span className="note-toggle">{isExpanded ? '−' : '+'}</span>
              </div>
              {isExpanded && <div className="note-text">{renderText(noteMatch[2])}</div>}
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
              <span>{section.title || 'Notes'}</span>
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
                      const noteExpanded = expandedNotes[`${idx}-${i}`];
                      return (
                        <div key={i} className={`note-entry ${noteExpanded ? 'expanded' : ''}`}>
                          <div className="note-header" onClick={() => setExpandedNotes(prev => ({...prev, [`${idx}-${i}`]: !prev[`${idx}-${i}`]}))}>
                            <span className="note-number">{noteMatch[1]}</span>
                            <span className="note-toggle">{noteExpanded ? '−' : '+'}</span>
                          </div>
                          {noteExpanded && <div className="note-text">{renderText(noteMatch[2])}</div>}
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
        <div key={idx} className="accordion-chapter">
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
          <div className="hymn-text">
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
                        {result.chapterTitle && (
                          <span className="search-result-chapter">{result.chapterTitle}</span>
                        )}
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
