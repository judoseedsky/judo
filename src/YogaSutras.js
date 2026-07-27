import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import WebsterLookup from './components/WebsterLookup';

function YogaSutras() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const contentRef = useRef(null);

  // Highlight search terms in text
  const highlightSearch = (text) => {
    if (!activeSearchTerm || activeSearchTerm.length < 2) return text;
    const regex = new RegExp(`(${activeSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === activeSearchTerm.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  // Sutra component that applies highlighting
  const Sutra = ({ children }) => <Sutra>{highlightSearch(children)}</Sutra>;

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2 || !contentRef.current) {
      setSearchResults([]);
      return;
    }
    const textContent = contentRef.current.innerText;
    const regex = new RegExp(query, 'gi');
    const matches = [];
    let match;
    while ((match = regex.exec(textContent)) !== null) {
      const start = Math.max(0, match.index - 40);
      const end = Math.min(textContent.length, match.index + query.length + 40);
      matches.push({
        text: textContent.slice(start, end),
        index: match.index
      });
      if (matches.length >= 20) break;
    }
    setSearchResults(matches);
  };

  const navigateToResult = (result) => {
    setActiveSearchTerm(searchQuery);
    setSearchOpen(false);

    // Scroll to the highlighted match after render
    setTimeout(() => {
      const highlights = document.querySelectorAll('mark.search-highlight');
      if (highlights.length > 0) {
        highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <div className="App">
      <div className="page-content hymn-page">
        <button className="back-btn" onClick={() => navigate('/nomothetes')}>
          &larr; Back
        </button>

        <nav className="chapter-nav expanded">
          <a href="#ch1"><span className="ch-num">I</span><span className="ch-name">Samadhi</span></a>
          <a href="#ch2"><span className="ch-num">II</span><span className="ch-name">Sadhana</span></a>
          <a href="#ch3"><span className="ch-num">III</span><span className="ch-name">Vibhuti</span></a>
          <a href="#ch4"><span className="ch-num">IV</span><span className="ch-name">Kaivalya</span></a>
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

        <div className="scroll-container">
          <div className="scroll-top"></div>
          <WebsterLookup containerRef={contentRef}>
          <div className="hymn-text sutra-text" ref={contentRef}>
            <h1 className="scroll-title">The Yoga Sutras</h1>
          <p className="scroll-subtitle">Patanjali · Translation by Swami Vivekananda</p>

          <h2 id="ch1">Chapter I · Samadhi Pada</h2>
          <p className="chapter-subtitle">Concentration: Its Spiritual Uses</p>

          <ol className="sutras">
            <Sutra>Now concentration is explained.</Sutra>
            <Sutra>Yoga is restraining the mind-stuff (Chitta) from taking various forms (Vrttis).</Sutra>
            <Sutra>At that time the seer rests in his own unmodified state.</Sutra>
            <Sutra>At other times the seer is identified with the modifications.</Sutra>
            <Sutra>There are five classes of modification, painful and not painful.</Sutra>
            <Sutra>These are right knowledge, indiscrimination, verbal delusion, sleep, and memory.</Sutra>
            <Sutra>Direct perception, inference, and competent evidence are proofs.</Sutra>
            <Sutra>Indiscrimination is false knowledge not established in real nature.</Sutra>
            <Sutra>Verbal delusion follows from words having no corresponding reality.</Sutra>
            <Sutra>Sleep is a Vrtti which embraces the feeling of voidness.</Sutra>
            <Sutra>Memory is when perceived subjects do not slip away.</Sutra>
            <Sutra>Their control is by practice and non-attachment.</Sutra>
            <Sutra>Continuous struggle to keep them perfectly restrained is practice.</Sutra>
            <Sutra>It becomes firmly grounded by long constant efforts with great love for the end to be attained.</Sutra>
            <Sutra>That effect which comes to those who have given up their thirst after objects either seen or heard, and which wills to control the objects, is non-attachment.</Sutra>
            <Sutra>That is extreme non-attachment which gives up even the qualities, and comes from the knowledge of the real nature of the Purusha.</Sutra>
            <Sutra>The concentration called right knowledge is that which is followed by reasoning, discrimination, bliss, unqualified egoism.</Sutra>
            <Sutra>There is another Samadhi which is attained by the constant practice of cessation of all mental activity, in which the Chitta retains only the unmanifested impressions.</Sutra>
            <Sutra>This Samadhi, when not followed by extreme non-attachment, becomes the cause of the re-manifestation of the gods and of those that become merged in nature.</Sutra>
            <Sutra>To others this Samadhi comes through faith, energy, memory, concentration, and discrimination of the real.</Sutra>
            <Sutra>Success is speedy for the extremely energetic.</Sutra>
            <Sutra>They again differ according as the means are mild, medium, or supreme.</Sutra>
            <Sutra>Or by devotion to Ishvara.</Sutra>
            <Sutra>Ishvara is a special Purusha, untouched by misery, the results of actions, or desires.</Sutra>
            <Sutra>In Him becomes infinite that all-knowingness which in others is only a germ.</Sutra>
            <Sutra>He is the Teacher of even the ancient teachers, being not limited by time.</Sutra>
            <Sutra>His manifesting word is Om.</Sutra>
            <Sutra>The repetition of this Om and meditating on its meaning is the way.</Sutra>
            <Sutra>From that is gained introspection, and the destruction of obstacles.</Sutra>
            <Sutra>Disease, mental laziness, doubt, lack of enthusiasm, lethargy, clinging to sense-enjoyments, false perception, non-attaining concentration, and falling away from the state when obtained, are the obstructing distractions.</Sutra>
            <Sutra>Grief, mental distress, tremor of the body, irregular breathing, accompany non-retention of concentration.</Sutra>
            <Sutra>To remedy this practice of one subject should be made.</Sutra>
            <Sutra>Friendship, mercy, gladness, indifference, being thought of in regard to subjects, happy, unhappy, good, and evil respectively, pacify the Chitta.</Sutra>
            <Sutra>By throwing out and restraining the Breath.</Sutra>
            <Sutra>Those forms of concentration that bring extraordinary sense perceptions cause perseverance of the mind.</Sutra>
            <Sutra>Or by the meditation on the Effulgent Light, which is beyond all sorrow.</Sutra>
            <Sutra>Or the mind taking as an object of concentration those who are free from attachment.</Sutra>
            <Sutra>Or by meditating on the knowledge that comes in sleep.</Sutra>
            <Sutra>Or by the meditation on anything that appeals to one as good.</Sutra>
            <Sutra>The Yogi's mind thus meditating, becomes unobstructed from the atomic to the Infinite.</Sutra>
            <Sutra>The Yogi whose Vrttis have thus become powerless obtains in the receiver, receiving, and received, concentration and sameness, like the crystal before different colored objects.</Sutra>
            <Sutra>Sound, meaning, and resulting knowledge, being mixed up, is called Samadhi with question.</Sutra>
            <Sutra>Samadhi called without question comes when the memory is purified, or devoid of qualities, expressing only the meaning of the object.</Sutra>
            <Sutra>By this process, concentrations with discrimination and with bliss are also explained.</Sutra>
            <Sutra>The concentrations with discrimination are those which are accompanied with reasoning, bliss, egoism, and forms.</Sutra>
            <Sutra>After the Samadhi which gives discrimination is attained, there comes purity in the Sattva, and cheerfulness of the mind.</Sutra>
            <Sutra>The knowledge in that is called "filled with Truth."</Sutra>
            <Sutra>The knowledge that is gained from testimony and inference is about common objects. That from Samadhi just mentioned is of a much higher order, being able to penetrate where inference and testimony cannot go.</Sutra>
            <Sutra>The impressions which obstruct, being controlled by that other, eventually all become controlled.</Sutra>
            <Sutra>When these are also controlled, all being controlled, comes the seedless Samadhi.</Sutra>
          </ol>

          <h2 id="ch2">Chapter II · Sadhana Pada</h2>
          <p className="chapter-subtitle">Concentration: Its Practice</p>

          <ol className="sutras">
            <Sutra>Mortification, study, and surrendering fruits of work to God are called Kriya Yoga.</Sutra>
            <Sutra>It is for the practice of Samadhi and minimizing the pain-bearing obstructions.</Sutra>
            <Sutra>The pain-bearing obstructions are: ignorance, egoism, attachment, aversion, and clinging to life.</Sutra>
            <Sutra>Ignorance is the productive field of all those that follow, whether they are dormant, attenuated, overpowered, or expanded.</Sutra>
            <Sutra>Ignorance is taking the non-eternal, the impure, the painful, and the non-Self, for the eternal, the pure, the happy, and the Atman or Self.</Sutra>
            <Sutra>Egoism is the identification of the seer with the instrument of seeing.</Sutra>
            <Sutra>Attachment is that which dwells on pleasure.</Sutra>
            <Sutra>Aversion is that which dwells on pain.</Sutra>
            <Sutra>Flowing through its own nature, and established even in the learned, is the clinging to life.</Sutra>
            <Sutra>The fine Samskaras are to be conquered by resolving them into their causal state.</Sutra>
            <Sutra>By meditation, their gross modifications are to be rejected.</Sutra>
            <Sutra>The receptacle of works has its root in these pain-bearing obstructions, and their experience is in this visible life, or in the unseen life.</Sutra>
            <Sutra>The root being there, the fruition comes in the form of species, life, and experience of pleasure and pain.</Sutra>
            <Sutra>They bear fruit as pleasure or pain, caused by virtue or vice.</Sutra>
            <Sutra>To the discriminating, all is, as it were, painful on account of everything bringing pain, either in the consequences, or in apprehension, or in attitude caused by impressions, also on account of the contradictions of the qualities.</Sutra>
            <Sutra>The misery which is not yet come is to be avoided.</Sutra>
            <Sutra>The cause of that which is to be avoided is the junction of the seer and the seen.</Sutra>
            <Sutra>The experienced is composed of elements and organs, is of the nature of illumination, action, and inertia, and is for the purpose of experience and release.</Sutra>
            <Sutra>The states of the qualities are the defined, the undefined, the indicated only, and the signless.</Sutra>
            <Sutra>The seer is intelligence only, and though pure, sees through the coloring of the intellect.</Sutra>
            <Sutra>The nature of the experienced is for him.</Sutra>
            <Sutra>Though destroyed for him whose goal has been gained, yet is not destroyed, being common to others.</Sutra>
            <Sutra>Junction is the cause of the realization of the nature of both the powers, the experienced and its Lord.</Sutra>
            <Sutra>Ignorance is its cause.</Sutra>
            <Sutra>There being absence of that ignorance there is absence of junction, which is the thing to be avoided; that is the independence of the seer.</Sutra>
            <Sutra>The means of destruction of ignorance is unbroken practice of discrimination.</Sutra>
            <Sutra>His knowledge is of the sevenfold highest ground.</Sutra>
            <Sutra>By the practice of the different parts of Yoga the impurities being destroyed, knowledge becomes effulgent, up to discrimination.</Sutra>
            <Sutra>Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi, are the limbs of Yoga.</Sutra>
            <Sutra>Non-killing, truthfulness, non-stealing, continence, and non-receiving are called Yama.</Sutra>
            <Sutra>These, unbroken by time, place, purpose, and caste, are universal great vows.</Sutra>
            <Sutra>Internal and external purification, contentment, mortification, study, and worship of God, are the Niyamas.</Sutra>
            <Sutra>To obstruct thoughts which are inimical to Yoga, contrary thoughts should be brought.</Sutra>
            <Sutra>The obstructions to Yoga are killing, falsehood, etc., whether committed, caused, or approved; either through avarice, or anger, or ignorance; whether slight, middling, or great; and result in infinite ignorance and misery. This is the method of thinking contrary thoughts.</Sutra>
            <Sutra>Non-killing being established, in his presence all enmities cease in others.</Sutra>
            <Sutra>By the establishment of truthfulness the Yogi gets the power of attaining for himself and others the fruits of work without the works.</Sutra>
            <Sutra>By the establishment of non-stealing all wealth comes to the Yogi.</Sutra>
            <Sutra>By the establishment of continence energy is gained.</Sutra>
            <Sutra>When he is fixed in non-receiving he gets the memory of past life.</Sutra>
            <Sutra>Internal and external cleanliness being established, there arises disgust for one's own body, and non-intercourse with others.</Sutra>
            <Sutra>There also arises purification of Sattva, cheerfulness of the mind, concentration, conquest of the organs, and fitness for the realization of the Self.</Sutra>
            <Sutra>From contentment comes superlative happiness.</Sutra>
            <Sutra>The result of mortification is bringing powers to the organs and the body, by destroying the impurity.</Sutra>
            <Sutra>By repetition of the Mantra comes the realization of the intended deity.</Sutra>
            <Sutra>By sacrificing all to Ishvara comes Samadhi.</Sutra>
            <Sutra>Posture is that which is firm and pleasant.</Sutra>
            <Sutra>By slight effort and meditating on the unlimited, posture becomes firm and pleasant.</Sutra>
            <Sutra>Seat being conquered, the dualities do not obstruct.</Sutra>
            <Sutra>Controlling the motion of the exhalation and the inhalation follows after this.</Sutra>
            <Sutra>Its modifications are either external, internal, or motionless, regulated by place, time, and number, either long or short.</Sutra>
            <Sutra>There is a fourth kind of Pranayama which is acquired by dwelling upon external or internal objects.</Sutra>
            <Sutra>From that, the covering to the light of the Chitta is attenuated.</Sutra>
            <Sutra>The mind becomes fit for Dharana.</Sutra>
            <Sutra>The drawing in of the organs is by their giving up their own objects and taking the form of the mind-stuff, as it were.</Sutra>
            <Sutra>Thence arises supreme control of the organs.</Sutra>
          </ol>

          <h2 id="ch3">Chapter III · Vibhuti Pada</h2>
          <p className="chapter-subtitle">Powers</p>

          <ol className="sutras">
            <Sutra>Dharana is holding the mind on to some particular object.</Sutra>
            <Sutra>An unbroken flow of knowledge to that object is Dhyana.</Sutra>
            <Sutra>When that, giving up all forms, reflects only the meaning, it is Samadhi.</Sutra>
            <Sutra>The three, when practiced together, are called Samyama.</Sutra>
            <Sutra>By the conquest of that comes Light of knowledge.</Sutra>
            <Sutra>That should be applied in stages.</Sutra>
            <Sutra>These three are nearer than those that precede.</Sutra>
            <Sutra>But even they are external to the seedless Samadhi.</Sutra>
            <Sutra>By the suppression of the disturbed modifications of the mind, and by the rise of modifications of control, the mind is said to attain the controlling state, following the controlling powers of the mind.</Sutra>
            <Sutra>Its flow becomes steady by habit.</Sutra>
            <Sutra>Taking in all sorts of objects, and concentrating upon one object, these two powers being destroyed and manifested respectively, the Chitta gets the modification called Samadhi.</Sutra>
            <Sutra>One-pointedness of the Chitta is when it grasps in equal manner objects that have passed, and that are present.</Sutra>
            <Sutra>By this is explained the threefold transformation of form, time, and state, in fine or gross matter and in the organs.</Sutra>
            <Sutra>That which is acted upon by transformations, either past, present, or yet to be manifested, is the qualified.</Sutra>
            <Sutra>The succession of changes is the cause of manifold evolution.</Sutra>
            <Sutra>By making Samyama on the three sorts of changes comes the knowledge of past and future.</Sutra>
            <Sutra>By making Samyama on word, meaning, and knowledge, which are ordinarily confused, comes the knowledge of all animal sounds.</Sutra>
            <Sutra>By perceiving the impressions, knowledge of past life.</Sutra>
            <Sutra>By making Samyama on the signs in another's body, knowledge of his mind.</Sutra>
            <Sutra>But not its contents, that not being the object of the Samyama.</Sutra>
            <Sutra>By making Samyama on the form of the body, and the perceptive power being obstructed, there being no contact between the light and the eye, the body becomes invisible.</Sutra>
            <Sutra>By this the disappearance or concealment of words which are being spoken and such other things are explained.</Sutra>
            <Sutra>Karma is of two kinds, soon to be fructified, and late to be fructified. By making Samyama on these, or by the signs called Aristha, portents, the Yogis know the exact time of separation from their bodies.</Sutra>
            <Sutra>By making Samyama on friendship, etc., various kinds of strength.</Sutra>
            <Sutra>By making Samyama on the strength of the elephant, and others, their respective strength comes to the Yogi.</Sutra>
            <Sutra>By making Samyama on the Effulgent Light, comes the knowledge of the fine, the obstructed, and the remote.</Sutra>
            <Sutra>By making Samyama on the sun, comes the knowledge of the world.</Sutra>
            <Sutra>On the moon, comes the knowledge of the cluster of stars.</Sutra>
            <Sutra>On the pole-star, comes the knowledge of the motion of the stars.</Sutra>
            <Sutra>On the navel circle, comes the knowledge of the constitution of the body.</Sutra>
            <Sutra>On the hollow of the throat, cessation of hunger.</Sutra>
            <Sutra>On the nerve called Kurma, comes fixity of the body.</Sutra>
            <Sutra>On the light emanating from the top of the head, sight of the Siddhas.</Sutra>
            <Sutra>Or by the power of Pratibha, all knowledge.</Sutra>
            <Sutra>In the heart, knowledge of minds.</Sutra>
            <Sutra>Enjoyment comes by the non-discrimination of the very distant soul and Sattva. Its actions are for another; Samyama on this gives knowledge of the Purusha.</Sutra>
            <Sutra>From that arises the knowledge of hearing, touching, seeing, tasting, and smelling, belonging to Pratibha.</Sutra>
            <Sutra>These are obstacles to Samadhi; but they are powers in the worldly state.</Sutra>
            <Sutra>When the cause of bondage has become loosened, the Yogi, by his knowledge of its channels of activity of the Chitta, enters another's body.</Sutra>
            <Sutra>By conquering the current called Udana the Yogi does not sink in water, or in swamps, and he can walk on thorns, etc., and can die at will.</Sutra>
            <Sutra>By the conquest of the current Samana, he is surrounded by blaze.</Sutra>
            <Sutra>By making Samyama on the relation between the ear and the Akasha comes divine hearing.</Sutra>
            <Sutra>By making Samyama on the relation between the Akasha and the body, and becoming light as cotton-wool, etc., through meditation on them, the Yogi goes through the skies.</Sutra>
            <Sutra>By making Samyama on the real modifications of the mind, outside of the body, called great bodilessness, comes disappearance of the covering to light.</Sutra>
            <Sutra>By making Samyama on the elements, beginning with the gross, and ending with the superfine, comes mastery of the elements.</Sutra>
            <Sutra>From that comes minuteness, and the rest of the powers, glorification of the body, and indestructibleness of the bodily qualities.</Sutra>
            <Sutra>The glorifications of the body are beauty, complexion, strength, adamantine hardness.</Sutra>
            <Sutra>By making Samyama on the objectivity, knowledge, egoism, and gunas, and their powers to the Purusha, comes the conquest of the organs.</Sutra>
            <Sutra>From that comes to the body the power of rapid movement like the mind, power of the organs independently of the body, and conquest of nature.</Sutra>
            <Sutra>By making Samyama on the Sattva, to him who has discriminated between the intellect and the Purusha comes omnipotence and omniscience.</Sutra>
            <Sutra>By giving up even these comes the destruction of the very seed of bondage, which leads to Kaivalya.</Sutra>
            <Sutra>The Yogi should not feel allured or flattered by the overtures of celestial beings, for fear of evil again.</Sutra>
            <Sutra>By making Samyama on a particle of time and its multiples comes discrimination.</Sutra>
            <Sutra>Those which cannot be differentiated by species, sign, and place, even they will be discriminated by the above Samyama.</Sutra>
            <Sutra>The saving knowledge is that knowledge of discrimination which covers all objects, all means.</Sutra>
            <Sutra>By the similarity of purity between the Sattva and the Purusha comes Kaivalya.</Sutra>
          </ol>

          <h2 id="ch4">Chapter IV · Kaivalya Pada</h2>
          <p className="chapter-subtitle">Independence</p>

          <ol className="sutras">
            <Sutra>The Siddhis (powers) are attained by birth, chemical means, power of words, mortification, or concentration.</Sutra>
            <Sutra>The change into another species is by the filling in of nature.</Sutra>
            <Sutra>Good and bad deeds are not the direct causes in the transformations of nature, but they act as breakers of obstacles to the evolutions of nature: as a farmer breaks the obstacles to the course of water, which then runs down by its own nature.</Sutra>
            <Sutra>From egoism alone proceed the created minds.</Sutra>
            <Sutra>Though the activities of the different created minds are various, the one original mind is the controller of them all.</Sutra>
            <Sutra>Among the various Chittas, that which is attained by Samadhi is desireless.</Sutra>
            <Sutra>Works are neither black nor white for the Yogis; for others they are threefold: black, white, and mixed.</Sutra>
            <Sutra>From these threefold works are manifested in each state only those desires which are fitting to that state alone. The others are held in abeyance for the time being.</Sutra>
            <Sutra>There is consecutiveness in desires, even though separated by species, space, and time, there being identification of memory and impressions.</Sutra>
            <Sutra>Thirst for happiness being eternal, desires are without beginning.</Sutra>
            <Sutra>Being held together by cause, effect, support, and objects, in the absence of these is its absence.</Sutra>
            <Sutra>The past and future exist in their own nature, qualities having different ways.</Sutra>
            <Sutra>They are manifested or fine, being of the nature of the Gunas.</Sutra>
            <Sutra>The unity in things is from the unity in changes.</Sutra>
            <Sutra>Since perception and desire vary with regard to the same object, mind and object are of different nature.</Sutra>
            <Sutra>Things are known or not known to the mind, being dependent on the coloring which they give to the mind.</Sutra>
            <Sutra>The states of the mind are always known, because the lord of the mind, the Purusha, is unchangeable.</Sutra>
            <Sutra>The mind is not self-luminous, being an object.</Sutra>
            <Sutra>From its being unable to cognize both at the same time.</Sutra>
            <Sutra>Another cognizing mind being assumed, there will be no end to such assumptions, and confusion of memory will be the result.</Sutra>
            <Sutra>The essence of knowledge, the Purusha, being unchangeable, when the mind takes its form, it becomes conscious.</Sutra>
            <Sutra>Colored by the seer and the seen the mind is able to understand everything.</Sutra>
            <Sutra>The mind, though variegated by innumerable desires, acts for another, the Purusha, being combinations.</Sutra>
            <Sutra>For the discriminating, the perception of the mind as Atman ceases.</Sutra>
            <Sutra>Then the mind becomes deep in discrimination, and gravitates towards Kaivalya.</Sutra>
            <Sutra>The thoughts that arise as obstructions to that are from impressions.</Sutra>
            <Sutra>Their destruction is in the same manner as of ignorance, etc., as said before.</Sutra>
            <Sutra>Even when arriving at the right discriminating knowledge of the essences, he who gives up the fruits, unto him comes as the result of perfect discrimination, the Samadhi called the cloud of virtue.</Sutra>
            <Sutra>From that comes cessation of afflictions and works.</Sutra>
            <Sutra>Then knowledge, bereft of covering and impurities, becoming infinite, the knowable becomes small.</Sutra>
            <Sutra>Then are finished the successive transformations of the qualities, they having attained the end.</Sutra>
            <Sutra>The changes that exist in relation to moments, and which are perceived at the other end of a series, are succession.</Sutra>
            <Sutra>The resolution in the inverse order of the qualities, bereft of any motive of action for the Purusha, is Kaivalya, or it is the establishment of the power of knowledge in its own nature.</Sutra>
          </ol>

          <p className="hymn-ending"><em>Thus ends the Yoga Sutras of Patanjali.</em></p>

            <p className="hymn-attribution">Translation by Swami Vivekananda (1896)<br/>From Raja Yoga</p>
          </div>
          </WebsterLookup>
          <div className="scroll-bottom"></div>
        </div>

        {/* Search Overlay */}
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
                        <span className="search-result-text">
                          ...{result.text.replace(/\n/g, ' ')}...
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

export default YogaSutras;
