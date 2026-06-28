import './App.css';
import { useNavigate } from 'react-router-dom';

function YogaSutras() {
  const navigate = useNavigate();

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
        </nav>

        <div className="scroll-container">
          <div className="scroll-top"></div>
          <div className="hymn-text sutra-text">
            <h1 className="scroll-title">The Yoga Sutras</h1>
          <p className="scroll-subtitle">Patanjali · Translation by Swami Vivekananda</p>

          <h2 id="ch1">Chapter I · Samadhi Pada</h2>
          <p className="chapter-subtitle">Concentration: Its Spiritual Uses</p>

          <ol className="sutras">
            <li>Now concentration is explained.</li>
            <li>Yoga is restraining the mind-stuff (Chitta) from taking various forms (Vrttis).</li>
            <li>At that time the seer rests in his own unmodified state.</li>
            <li>At other times the seer is identified with the modifications.</li>
            <li>There are five classes of modification, painful and not painful.</li>
            <li>These are right knowledge, indiscrimination, verbal delusion, sleep, and memory.</li>
            <li>Direct perception, inference, and competent evidence are proofs.</li>
            <li>Indiscrimination is false knowledge not established in real nature.</li>
            <li>Verbal delusion follows from words having no corresponding reality.</li>
            <li>Sleep is a Vrtti which embraces the feeling of voidness.</li>
            <li>Memory is when perceived subjects do not slip away.</li>
            <li>Their control is by practice and non-attachment.</li>
            <li>Continuous struggle to keep them perfectly restrained is practice.</li>
            <li>It becomes firmly grounded by long constant efforts with great love for the end to be attained.</li>
            <li>That effect which comes to those who have given up their thirst after objects either seen or heard, and which wills to control the objects, is non-attachment.</li>
            <li>That is extreme non-attachment which gives up even the qualities, and comes from the knowledge of the real nature of the Purusha.</li>
            <li>The concentration called right knowledge is that which is followed by reasoning, discrimination, bliss, unqualified egoism.</li>
            <li>There is another Samadhi which is attained by the constant practice of cessation of all mental activity, in which the Chitta retains only the unmanifested impressions.</li>
            <li>This Samadhi, when not followed by extreme non-attachment, becomes the cause of the re-manifestation of the gods and of those that become merged in nature.</li>
            <li>To others this Samadhi comes through faith, energy, memory, concentration, and discrimination of the real.</li>
            <li>Success is speedy for the extremely energetic.</li>
            <li>They again differ according as the means are mild, medium, or supreme.</li>
            <li>Or by devotion to Ishvara.</li>
            <li>Ishvara is a special Purusha, untouched by misery, the results of actions, or desires.</li>
            <li>In Him becomes infinite that all-knowingness which in others is only a germ.</li>
            <li>He is the Teacher of even the ancient teachers, being not limited by time.</li>
            <li>His manifesting word is Om.</li>
            <li>The repetition of this Om and meditating on its meaning is the way.</li>
            <li>From that is gained introspection, and the destruction of obstacles.</li>
            <li>Disease, mental laziness, doubt, lack of enthusiasm, lethargy, clinging to sense-enjoyments, false perception, non-attaining concentration, and falling away from the state when obtained, are the obstructing distractions.</li>
            <li>Grief, mental distress, tremor of the body, irregular breathing, accompany non-retention of concentration.</li>
            <li>To remedy this practice of one subject should be made.</li>
            <li>Friendship, mercy, gladness, indifference, being thought of in regard to subjects, happy, unhappy, good, and evil respectively, pacify the Chitta.</li>
            <li>By throwing out and restraining the Breath.</li>
            <li>Those forms of concentration that bring extraordinary sense perceptions cause perseverance of the mind.</li>
            <li>Or by the meditation on the Effulgent Light, which is beyond all sorrow.</li>
            <li>Or the mind taking as an object of concentration those who are free from attachment.</li>
            <li>Or by meditating on the knowledge that comes in sleep.</li>
            <li>Or by the meditation on anything that appeals to one as good.</li>
            <li>The Yogi's mind thus meditating, becomes unobstructed from the atomic to the Infinite.</li>
            <li>The Yogi whose Vrttis have thus become powerless obtains in the receiver, receiving, and received, concentration and sameness, like the crystal before different colored objects.</li>
            <li>Sound, meaning, and resulting knowledge, being mixed up, is called Samadhi with question.</li>
            <li>Samadhi called without question comes when the memory is purified, or devoid of qualities, expressing only the meaning of the object.</li>
            <li>By this process, concentrations with discrimination and with bliss are also explained.</li>
            <li>The concentrations with discrimination are those which are accompanied with reasoning, bliss, egoism, and forms.</li>
            <li>After the Samadhi which gives discrimination is attained, there comes purity in the Sattva, and cheerfulness of the mind.</li>
            <li>The knowledge in that is called "filled with Truth."</li>
            <li>The knowledge that is gained from testimony and inference is about common objects. That from Samadhi just mentioned is of a much higher order, being able to penetrate where inference and testimony cannot go.</li>
            <li>The impressions which obstruct, being controlled by that other, eventually all become controlled.</li>
            <li>When these are also controlled, all being controlled, comes the seedless Samadhi.</li>
          </ol>

          <h2 id="ch2">Chapter II · Sadhana Pada</h2>
          <p className="chapter-subtitle">Concentration: Its Practice</p>

          <ol className="sutras">
            <li>Mortification, study, and surrendering fruits of work to God are called Kriya Yoga.</li>
            <li>It is for the practice of Samadhi and minimizing the pain-bearing obstructions.</li>
            <li>The pain-bearing obstructions are: ignorance, egoism, attachment, aversion, and clinging to life.</li>
            <li>Ignorance is the productive field of all those that follow, whether they are dormant, attenuated, overpowered, or expanded.</li>
            <li>Ignorance is taking the non-eternal, the impure, the painful, and the non-Self, for the eternal, the pure, the happy, and the Atman or Self.</li>
            <li>Egoism is the identification of the seer with the instrument of seeing.</li>
            <li>Attachment is that which dwells on pleasure.</li>
            <li>Aversion is that which dwells on pain.</li>
            <li>Flowing through its own nature, and established even in the learned, is the clinging to life.</li>
            <li>The fine Samskaras are to be conquered by resolving them into their causal state.</li>
            <li>By meditation, their gross modifications are to be rejected.</li>
            <li>The receptacle of works has its root in these pain-bearing obstructions, and their experience is in this visible life, or in the unseen life.</li>
            <li>The root being there, the fruition comes in the form of species, life, and experience of pleasure and pain.</li>
            <li>They bear fruit as pleasure or pain, caused by virtue or vice.</li>
            <li>To the discriminating, all is, as it were, painful on account of everything bringing pain, either in the consequences, or in apprehension, or in attitude caused by impressions, also on account of the contradictions of the qualities.</li>
            <li>The misery which is not yet come is to be avoided.</li>
            <li>The cause of that which is to be avoided is the junction of the seer and the seen.</li>
            <li>The experienced is composed of elements and organs, is of the nature of illumination, action, and inertia, and is for the purpose of experience and release.</li>
            <li>The states of the qualities are the defined, the undefined, the indicated only, and the signless.</li>
            <li>The seer is intelligence only, and though pure, sees through the coloring of the intellect.</li>
            <li>The nature of the experienced is for him.</li>
            <li>Though destroyed for him whose goal has been gained, yet is not destroyed, being common to others.</li>
            <li>Junction is the cause of the realization of the nature of both the powers, the experienced and its Lord.</li>
            <li>Ignorance is its cause.</li>
            <li>There being absence of that ignorance there is absence of junction, which is the thing to be avoided; that is the independence of the seer.</li>
            <li>The means of destruction of ignorance is unbroken practice of discrimination.</li>
            <li>His knowledge is of the sevenfold highest ground.</li>
            <li>By the practice of the different parts of Yoga the impurities being destroyed, knowledge becomes effulgent, up to discrimination.</li>
            <li>Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi, are the limbs of Yoga.</li>
            <li>Non-killing, truthfulness, non-stealing, continence, and non-receiving are called Yama.</li>
            <li>These, unbroken by time, place, purpose, and caste, are universal great vows.</li>
            <li>Internal and external purification, contentment, mortification, study, and worship of God, are the Niyamas.</li>
            <li>To obstruct thoughts which are inimical to Yoga, contrary thoughts should be brought.</li>
            <li>The obstructions to Yoga are killing, falsehood, etc., whether committed, caused, or approved; either through avarice, or anger, or ignorance; whether slight, middling, or great; and result in infinite ignorance and misery. This is the method of thinking contrary thoughts.</li>
            <li>Non-killing being established, in his presence all enmities cease in others.</li>
            <li>By the establishment of truthfulness the Yogi gets the power of attaining for himself and others the fruits of work without the works.</li>
            <li>By the establishment of non-stealing all wealth comes to the Yogi.</li>
            <li>By the establishment of continence energy is gained.</li>
            <li>When he is fixed in non-receiving he gets the memory of past life.</li>
            <li>Internal and external cleanliness being established, there arises disgust for one's own body, and non-intercourse with others.</li>
            <li>There also arises purification of Sattva, cheerfulness of the mind, concentration, conquest of the organs, and fitness for the realization of the Self.</li>
            <li>From contentment comes superlative happiness.</li>
            <li>The result of mortification is bringing powers to the organs and the body, by destroying the impurity.</li>
            <li>By repetition of the Mantra comes the realization of the intended deity.</li>
            <li>By sacrificing all to Ishvara comes Samadhi.</li>
            <li>Posture is that which is firm and pleasant.</li>
            <li>By slight effort and meditating on the unlimited, posture becomes firm and pleasant.</li>
            <li>Seat being conquered, the dualities do not obstruct.</li>
            <li>Controlling the motion of the exhalation and the inhalation follows after this.</li>
            <li>Its modifications are either external, internal, or motionless, regulated by place, time, and number, either long or short.</li>
            <li>There is a fourth kind of Pranayama which is acquired by dwelling upon external or internal objects.</li>
            <li>From that, the covering to the light of the Chitta is attenuated.</li>
            <li>The mind becomes fit for Dharana.</li>
            <li>The drawing in of the organs is by their giving up their own objects and taking the form of the mind-stuff, as it were.</li>
            <li>Thence arises supreme control of the organs.</li>
          </ol>

          <h2 id="ch3">Chapter III · Vibhuti Pada</h2>
          <p className="chapter-subtitle">Powers</p>

          <ol className="sutras">
            <li>Dharana is holding the mind on to some particular object.</li>
            <li>An unbroken flow of knowledge to that object is Dhyana.</li>
            <li>When that, giving up all forms, reflects only the meaning, it is Samadhi.</li>
            <li>The three, when practiced together, are called Samyama.</li>
            <li>By the conquest of that comes Light of knowledge.</li>
            <li>That should be applied in stages.</li>
            <li>These three are nearer than those that precede.</li>
            <li>But even they are external to the seedless Samadhi.</li>
            <li>By the suppression of the disturbed modifications of the mind, and by the rise of modifications of control, the mind is said to attain the controlling state, following the controlling powers of the mind.</li>
            <li>Its flow becomes steady by habit.</li>
            <li>Taking in all sorts of objects, and concentrating upon one object, these two powers being destroyed and manifested respectively, the Chitta gets the modification called Samadhi.</li>
            <li>One-pointedness of the Chitta is when it grasps in equal manner objects that have passed, and that are present.</li>
            <li>By this is explained the threefold transformation of form, time, and state, in fine or gross matter and in the organs.</li>
            <li>That which is acted upon by transformations, either past, present, or yet to be manifested, is the qualified.</li>
            <li>The succession of changes is the cause of manifold evolution.</li>
            <li>By making Samyama on the three sorts of changes comes the knowledge of past and future.</li>
            <li>By making Samyama on word, meaning, and knowledge, which are ordinarily confused, comes the knowledge of all animal sounds.</li>
            <li>By perceiving the impressions, knowledge of past life.</li>
            <li>By making Samyama on the signs in another's body, knowledge of his mind.</li>
            <li>But not its contents, that not being the object of the Samyama.</li>
            <li>By making Samyama on the form of the body, and the perceptive power being obstructed, there being no contact between the light and the eye, the body becomes invisible.</li>
            <li>By this the disappearance or concealment of words which are being spoken and such other things are explained.</li>
            <li>Karma is of two kinds, soon to be fructified, and late to be fructified. By making Samyama on these, or by the signs called Aristha, portents, the Yogis know the exact time of separation from their bodies.</li>
            <li>By making Samyama on friendship, etc., various kinds of strength.</li>
            <li>By making Samyama on the strength of the elephant, and others, their respective strength comes to the Yogi.</li>
            <li>By making Samyama on the Effulgent Light, comes the knowledge of the fine, the obstructed, and the remote.</li>
            <li>By making Samyama on the sun, comes the knowledge of the world.</li>
            <li>On the moon, comes the knowledge of the cluster of stars.</li>
            <li>On the pole-star, comes the knowledge of the motion of the stars.</li>
            <li>On the navel circle, comes the knowledge of the constitution of the body.</li>
            <li>On the hollow of the throat, cessation of hunger.</li>
            <li>On the nerve called Kurma, comes fixity of the body.</li>
            <li>On the light emanating from the top of the head, sight of the Siddhas.</li>
            <li>Or by the power of Pratibha, all knowledge.</li>
            <li>In the heart, knowledge of minds.</li>
            <li>Enjoyment comes by the non-discrimination of the very distant soul and Sattva. Its actions are for another; Samyama on this gives knowledge of the Purusha.</li>
            <li>From that arises the knowledge of hearing, touching, seeing, tasting, and smelling, belonging to Pratibha.</li>
            <li>These are obstacles to Samadhi; but they are powers in the worldly state.</li>
            <li>When the cause of bondage has become loosened, the Yogi, by his knowledge of its channels of activity of the Chitta, enters another's body.</li>
            <li>By conquering the current called Udana the Yogi does not sink in water, or in swamps, and he can walk on thorns, etc., and can die at will.</li>
            <li>By the conquest of the current Samana, he is surrounded by blaze.</li>
            <li>By making Samyama on the relation between the ear and the Akasha comes divine hearing.</li>
            <li>By making Samyama on the relation between the Akasha and the body, and becoming light as cotton-wool, etc., through meditation on them, the Yogi goes through the skies.</li>
            <li>By making Samyama on the real modifications of the mind, outside of the body, called great bodilessness, comes disappearance of the covering to light.</li>
            <li>By making Samyama on the elements, beginning with the gross, and ending with the superfine, comes mastery of the elements.</li>
            <li>From that comes minuteness, and the rest of the powers, glorification of the body, and indestructibleness of the bodily qualities.</li>
            <li>The glorifications of the body are beauty, complexion, strength, adamantine hardness.</li>
            <li>By making Samyama on the objectivity, knowledge, egoism, and gunas, and their powers to the Purusha, comes the conquest of the organs.</li>
            <li>From that comes to the body the power of rapid movement like the mind, power of the organs independently of the body, and conquest of nature.</li>
            <li>By making Samyama on the Sattva, to him who has discriminated between the intellect and the Purusha comes omnipotence and omniscience.</li>
            <li>By giving up even these comes the destruction of the very seed of bondage, which leads to Kaivalya.</li>
            <li>The Yogi should not feel allured or flattered by the overtures of celestial beings, for fear of evil again.</li>
            <li>By making Samyama on a particle of time and its multiples comes discrimination.</li>
            <li>Those which cannot be differentiated by species, sign, and place, even they will be discriminated by the above Samyama.</li>
            <li>The saving knowledge is that knowledge of discrimination which covers all objects, all means.</li>
            <li>By the similarity of purity between the Sattva and the Purusha comes Kaivalya.</li>
          </ol>

          <h2 id="ch4">Chapter IV · Kaivalya Pada</h2>
          <p className="chapter-subtitle">Independence</p>

          <ol className="sutras">
            <li>The Siddhis (powers) are attained by birth, chemical means, power of words, mortification, or concentration.</li>
            <li>The change into another species is by the filling in of nature.</li>
            <li>Good and bad deeds are not the direct causes in the transformations of nature, but they act as breakers of obstacles to the evolutions of nature: as a farmer breaks the obstacles to the course of water, which then runs down by its own nature.</li>
            <li>From egoism alone proceed the created minds.</li>
            <li>Though the activities of the different created minds are various, the one original mind is the controller of them all.</li>
            <li>Among the various Chittas, that which is attained by Samadhi is desireless.</li>
            <li>Works are neither black nor white for the Yogis; for others they are threefold: black, white, and mixed.</li>
            <li>From these threefold works are manifested in each state only those desires which are fitting to that state alone. The others are held in abeyance for the time being.</li>
            <li>There is consecutiveness in desires, even though separated by species, space, and time, there being identification of memory and impressions.</li>
            <li>Thirst for happiness being eternal, desires are without beginning.</li>
            <li>Being held together by cause, effect, support, and objects, in the absence of these is its absence.</li>
            <li>The past and future exist in their own nature, qualities having different ways.</li>
            <li>They are manifested or fine, being of the nature of the Gunas.</li>
            <li>The unity in things is from the unity in changes.</li>
            <li>Since perception and desire vary with regard to the same object, mind and object are of different nature.</li>
            <li>Things are known or not known to the mind, being dependent on the coloring which they give to the mind.</li>
            <li>The states of the mind are always known, because the lord of the mind, the Purusha, is unchangeable.</li>
            <li>The mind is not self-luminous, being an object.</li>
            <li>From its being unable to cognize both at the same time.</li>
            <li>Another cognizing mind being assumed, there will be no end to such assumptions, and confusion of memory will be the result.</li>
            <li>The essence of knowledge, the Purusha, being unchangeable, when the mind takes its form, it becomes conscious.</li>
            <li>Colored by the seer and the seen the mind is able to understand everything.</li>
            <li>The mind, though variegated by innumerable desires, acts for another, the Purusha, being combinations.</li>
            <li>For the discriminating, the perception of the mind as Atman ceases.</li>
            <li>Then the mind becomes deep in discrimination, and gravitates towards Kaivalya.</li>
            <li>The thoughts that arise as obstructions to that are from impressions.</li>
            <li>Their destruction is in the same manner as of ignorance, etc., as said before.</li>
            <li>Even when arriving at the right discriminating knowledge of the essences, he who gives up the fruits, unto him comes as the result of perfect discrimination, the Samadhi called the cloud of virtue.</li>
            <li>From that comes cessation of afflictions and works.</li>
            <li>Then knowledge, bereft of covering and impurities, becoming infinite, the knowable becomes small.</li>
            <li>Then are finished the successive transformations of the qualities, they having attained the end.</li>
            <li>The changes that exist in relation to moments, and which are perceived at the other end of a series, are succession.</li>
            <li>The resolution in the inverse order of the qualities, bereft of any motive of action for the Purusha, is Kaivalya, or it is the establishment of the power of knowledge in its own nature.</li>
          </ol>

          <p className="hymn-ending"><em>Thus ends the Yoga Sutras of Patanjali.</em></p>

            <p className="hymn-attribution">Translation by Swami Vivekananda (1896)<br/>From Raja Yoga</p>
          </div>
          <div className="scroll-bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default YogaSutras;
