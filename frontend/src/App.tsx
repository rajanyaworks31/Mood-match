import { useEffect, useRef, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Cloud,
  Heart,
  Leaf,
  FileText,
  Menu,
  Moon,
  Play,
  Sparkles,
  Sun,
  ExternalLink,
  Waves,
} from "lucide-react";

type Mood = {
  label: string;
  icon: typeof Cloud;
  tone: string;
  description: string;
  image: string;
};

const moods: Mood[] = [
  {
    label: "Calm",
    icon: Cloud,
    tone: "calm",
    description: "quiet, steady, and present",
    image: "/images/moods/calm.svg",
  },
  {
    label: "Tired",
    icon: Moon,
    tone: "tired",
    description: "ready to slow everything down",
    image: "/images/moods/tired.svg",
  },
  {
    label: "Overwhelmed",
    icon: Waves,
    tone: "overwhelmed",
    description: "a lot is moving at once",
    image: "/images/moods/overwhelmed.svg",
  },
  {
    label: "Melancholy",
    icon: Moon,
    tone: "melancholy",
    description: "softly thoughtful and inward",
    image: "/images/moods/melancholy.svg",
  },
  {
    label: "Anxious",
    icon: Waves,
    tone: "anxious",
    description: "restless, uncertain, or on edge",
    image: "/images/moods/anxious.svg",
  },
  {
    label: "Happy",
    icon: Sun,
    tone: "happy",
    description: "light, warm, and open",
    image: "/images/moods/happy.svg",
  },
  {
    label: "Inspired",
    icon: Sparkles,
    tone: "inspired",
    description: "full of ideas and possibility",
    image: "/images/moods/inspired.svg",
  },
  {
    label: "Lonely",
    icon: Moon,
    tone: "lonely",
    description: "wanting closeness or understanding",
    image: "/images/moods/lonely.svg",
  },
  {
    label: "Grateful",
    icon: Leaf,
    tone: "grateful",
    description: "noticing the good around you",
    image: "/images/moods/grateful.svg",
  },
];

const dayOptions = [
  "Tiring and dull",
  "Energetic and bright",
  "Full of worries",
  "Peaceful and relaxing",
  "Emotionally overwhelming",
  "Chaotic and unpredictable",
  "Mentally drained",
  "Heartwarming and cheerful",
];

const desireOptions = [
  "Lying down and thinking",
  "Going for a walk or run",
  "Talking to a friend",
  "Journaling or reading",
  "Dancing or watching a movie",
  "Listening to music alone",
];

const contentTypes = ["Quote", "Poem", "Story", "Caption", "Song"];

const TICKER_WORDS = [
  "You're in the right place.",
  "Feel it. Name it.",
  "You're not alone.",
  "Begin gently.",
  "You deserve this.",
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  size: `${6 + Math.sin(i * 1.7) * 4}px`,
  x: `${8 + ((i * 6.5) % 84)}%`,
  y: `${10 + ((i * 11) % 78)}%`,
  dur: `${4 + (i % 5)}s`,
  delay: `${(i * 0.4) % 3}s`,
  opacity: 0.35 + (i % 3) * 0.2,
}));

/* ---- HeroTicker: cycles through words with a blur/fade morph ---- */
function HeroTicker({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 320);
    }, 3200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <em
      style={{
        display: "inline-block",
        color: "#557487",
        fontStyle: "italic",
        transition: "opacity .32s ease, transform .32s ease, filter .32s ease",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(10px) scale(.94)",
        filter: visible ? "blur(0)" : "blur(4px)",
      }}
    >
      {words[index]}
    </em>
  );
}

/* ---- RippleButton: adds a ripple effect on click ---- */
function RippleButton({
  children,
  className,
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<Mood | null>(null);
  const [day, setDay] = useState(dayOptions[0]);
  const [desire, setDesire] = useState(desireOptions[0]);
  const [contentType, setContentType] = useState("Quote");
  const [result, setResult] = useState("");
  const [recs, setRecs] = useState<{
    books: any[];
    articles: any[];
    videos: any[];
  } | null>(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const featureStripRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    const target = featureStripRef.current;
    if (!target) return;

    if (typeof IntersectionObserver === "undefined") {
      setFeaturesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 120px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const selectedMood = useMemo(() => mood ?? moods[0], [mood]);

  const goHome = () => {
    setMenuOpen(false);
    setStarted(false);
    setResult("");
    setRecs(null);
    setRecsError("");
    setSaved(false);
    setStep(1);
  };

  const startCheckIn = () => {
    setMenuOpen(false);
    setStarted(true);
    setResult("");
    setRecs(null);
    setRecsError("");
    setRecsLoading(false);
    setSaved(false);
    setError("");
    setStep(1);
  };

  const generate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ""}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            day,
            desire,
            vibe: selectedMood.label,
            content_type: contentType,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.detail || "We could not create your response right now.",
        );
      }

      setResult(data.content);
      setSaved(false);
      setRecs(null);
      setRecsError("");
      setRecsLoading(true);

      try {
        const recsResponse = await fetch(
          `${import.meta.env.VITE_API_URL ?? ""}/api/recommendations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, desire, vibe: selectedMood.label }),
          },
        );
        const recsData = await recsResponse.json();
        if (!recsResponse.ok)
          throw new Error(
            recsData.detail || "Could not fetch recommendations.",
          );
        setRecs(recsData);
      } catch (recsErr) {
        setRecsError(
          recsErr instanceof Error
            ? recsErr.message
            : "Recommendations unavailable.",
        );
      } finally {
        setRecsLoading(false);
      }
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Something went wrong while creating your response.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const next = () => {
    if (step === 1 && !mood) {
      setError(
        "Please choose the mood that feels closest to you before continuing.",
      );
      return;
    }

    setError("");
    if (step < 3) setStep(step + 1);
    else void generate();
  };

  return (
    <main
      className={`app mood-${selectedMood.tone} ${result ? "has-result" : ""}`}
    >
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <nav className="nav shell">
        <button className="brand" onClick={goHome} aria-label="Back to home">
          <span className="brand-mark">
            <Waves size={17} />
          </span>
          <span>MoodMatch</span>
        </button>
        <div className="nav-links">
          <div className="menu-wrap">
            <button
              className={`icon-button ${menuOpen ? "active" : ""}`}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Menu size={20} />
            </button>
            {menuOpen && (
              <div className="nav-menu" role="menu">
                <button role="menuitem" onClick={goHome}>
                  Home
                </button>
                <button role="menuitem" onClick={startCheckIn}>
                  Check in
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {!started ? (
        <section className="hero shell">
          <div className="hero-copy" style={{ position: "relative" }}>
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <p className="eyebrow">
              <Sparkles size={14} /> a little space for you
            </p>
            <h1>
              Take a breath.
              <br />
              <HeroTicker words={TICKER_WORDS} />
            </h1>
            <p className="hero-text">
              Tell MoodMatch how the day feels, and we'll create something small
              and meaningful for you.
            </p>
            <RippleButton
              className="primary-button"
              onClick={() => setStarted(true)}
            >
              Let's begin <ArrowRight size={17} />
            </RippleButton>
          </div>

          <div className="hero-side-art" aria-hidden="true">
            <img src="/images/hero-self-care.jpg" alt="" />
          </div>

          <div className="hero-scene">
            <img
              className="hero-image"
              src="/images/hero-moodmatch.jpg"
              alt="Peaceful seaside view with an encouraging handwritten message"
            />
            <div className="hero-message">
              <span className="hero-message-line">Where every mood</span>
              <span className="hero-message-accent">finds a perfect match</span>
              <span className="hero-message-spark">✦</span>
            </div>
            <div className="hero-particles">
              {PARTICLES.map((p, i) => (
                <span
                  key={i}
                  className="particle"
                  style={{
                    width: p.size,
                    height: p.size,
                    left: p.x,
                    top: p.y,
                    ["--dur" as string]: p.dur,
                    ["--delay" as string]: p.delay,
                    opacity: p.opacity,
                  }}
                />
              ))}
            </div>
            <div className="hero-scene-shimmer" />
          </div>

          <div
            ref={featureStripRef}
            className={`feature-strip ${featuresVisible ? "is-visible" : ""}`}
          >
            <Feature
              image="/images/image1.png"
              icon={<Leaf size={18} />}
              title="Understand yourself"
              text="A few gentle questions about your current mood."
            />
            <Feature
              image="/images/image2.jpg"
              icon={<Sparkles size={18} />}
              title="Receive something meaningful"
              text="A quote, poem, story, or note that matches your vibe."
            />
            <Feature
              image="/images/image3.png"
              icon={<Heart size={18} />}
              title="Save & reflect"
              text="Keep moments that feel worth returning to."
            />
          </div>

          <div className="quote-banner">
            <span className="quote-mark">&ldquo;</span>
            <p>
              Sometimes the kindest thing you can do is slow down and listen to
              yourself.
            </p>
            <span className="mini-cosmos">✦ ☾</span>
          </div>
        </section>
      ) : result ? (
        <Result
          mood={selectedMood}
          contentType={contentType}
          result={result}
          recs={recs}
          recsLoading={recsLoading}
          recsError={recsError}
          saved={saved}
          onSave={() => setSaved(!saved)}
          onBack={() => {
            setResult("");
            setRecs(null);
            setRecsError("");
            setStep(1);
          }}
        />
      ) : (
        <section className="checkin shell">
          <div className="checkin-heading">
            <p className="eyebrow">YOUR INNER WEATHER · 0{step} / 03</p>
            <h2>
              {step === 1
                ? "How are you feeling today?"
                : step === 2
                  ? "What's on your mind right now?"
                  : "Pick a word that matches your vibe."}
            </h2>
            <p>
              {step === 1
                ? "There's no right or wrong. Just choose what feels closest."
                : step === 2
                  ? "You can pick more than one in your head. We're keeping this simple."
                  : "The first word that feels right is enough."}
            </p>
          </div>

          {step === 1 && (
            <div className="mood-grid">
              {moods.map((item) => {
                const Icon = item.icon;
                const selected = mood?.label === item.label;
                return (
                  <button
                    key={item.label}
                    className={`mood-card ${selected ? "selected" : ""}`}
                    onClick={() => setMood(item)}
                  >
                    <span className="mood-visual">
                      <img src={item.image} alt="" />
                    </span>
                    <span className={`mood-icon ${item.tone}`}>
                      <Icon size={18} />
                    </span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                    <span className="mood-arrow">
                      <ArrowRight size={14} />
                    </span>
                    {selected && (
                      <span className="check">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="choice-stack">
              <label className="field-label">How was your day?</label>
              <select
                value={day}
                onChange={(event) => setDay(event.target.value)}
              >
                {dayOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <label className="field-label">
                What do you feel like doing right now?
              </label>
              <select
                value={desire}
                onChange={(event) => setDesire(event.target.value)}
              >
                {desireOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="content-picker">
              <div className="word-preview">{selectedMood.label}</div>
              <div className="content-types">
                {contentTypes.map((type) => (
                  <button
                    key={type}
                    className={contentType === type ? "active" : ""}
                    onClick={() => setContentType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="helper">
                We'll make a {contentType.toLowerCase()} that reflects the day
                you described.
              </p>

              <div className="recommendation-preview">
                <span className="image-mode-icon">
                  <Sparkles size={20} />
                </span>
                <div>
                  <strong>We'll find something for you</strong>
                  <small>
                    Books, articles, and YouTube videos chosen around your mood
                    will appear with your result.
                  </small>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="generation-error" role="alert">
              {error}
            </p>
          )}
          <div className="checkin-footer">
            <button
              className="back-button"
              onClick={() => (step > 1 ? setStep(step - 1) : setStarted(false))}
              disabled={isGenerating}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="progress">
              <span style={{ width: `${(step / 3) * 100}%` }} />
            </div>
            <RippleButton
              className="primary-button small"
              onClick={next}
              disabled={isGenerating}
            >
              {isGenerating ? "Creating…" : step === 3 ? "Create mine" : "Next"}{" "}
              <ArrowRight size={16} />
            </RippleButton>
          </div>
        </section>
      )}

      <footer className="footer shell">
        Made for the moments in between. <span>✦</span>
      </footer>
    </main>
  );
}

function Feature({
  image,
  icon,
  title,
  text,
}: {
  image: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="feature">
      <div className="feature-image-wrap">
        <img src={image} alt="" className="feature-image" />
      </div>
      <span className="feature-glow" />
      <span className="feature-icon">{icon}</span>
      <div className="feature-copy">
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Result({
  mood,
  contentType,
  result,
  recs,
  recsLoading,
  recsError,
  saved,
  onSave,
  onBack,
}: {
  mood: Mood;
  contentType: string;
  result: string;
  recs: { books: any[]; articles: any[]; videos: any[] } | null;
  recsLoading: boolean;
  recsError: string;
  saved: boolean;
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <section className="result shell">
      <div className="result-art">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <span className="result-star star-one">✦</span>
        <span className="result-star star-two">✧</span>
        <span className="result-star star-three">✦</span>
        <div className="result-copy">
          <p>YOUR {contentType.toUpperCase()}</p>
          <h2>{mood.label}</h2>
          <span>{mood.description}</span>
        </div>
        <div className={`result-card result-${contentType.toLowerCase()}`}>
          <span>{contentType === "Story" ? "✦" : '"'}</span>
          <p>{result}</p>
        </div>
      </div>

      <div className="recs-section">
        <div className="recs-heading">
          <p className="eyebrow">JUST FOR YOU · {mood.label.toUpperCase()}</p>
          <h3>Things to help you feel it fully.</h3>
        </div>
        {recsLoading && (
          <div className="recs-loading">
            <Sparkles size={20} />
            <span>Finding the right books, reads & videos for you…</span>
          </div>
        )}
        {recsError && <p className="recs-error">{recsError}</p>}
        {recs && <RecommendationCards recs={recs} />}
      </div>

      <div className="result-actions">
        <button
          className={`secondary-button ${saved ? "saved" : ""}`}
          onClick={onSave}
        >
          {saved ? <Check size={17} /> : <Bookmark size={17} />}{" "}
          {saved ? "Saved" : "Save"}
        </button>
        <button className="secondary-button" onClick={onBack}>
          <Sparkles size={17} /> Make another
        </button>
      </div>
    </section>
  );
}

function RecommendationCards({
  recs,
}: {
  recs: { books: any[]; articles: any[]; videos: any[] };
}) {
  return (
    <div className="recommendation-panels">
      {recs.books.length > 0 && (
        <section className="recommendation-panel panel-books">
          <div className="panel-heading">
            <div className="panel-heading-icon">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="panel-title-row">
                <h4>Books</h4>
                <span>{recs.books.length} recommendations</span>
              </div>
              <p>Stories and ideas to comfort, ground and inspire you.</p>
            </div>
          </div>
          <div className="book-grid">
            {recs.books.map((book, i) => (
              <a
                key={i}
                className="book-item"
                href={`https://openlibrary.org/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="book-cover-large">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} />
                  ) : (
                    <div className="rec-cover-placeholder">
                      <Bookmark size={30} />
                    </div>
                  )}
                </div>
                <strong>{book.title}</strong>
                <small>{book.author}</small>
              </a>
            ))}
          </div>
          <div className="panel-footer">
            View these books on Open Library <ExternalLink size={14} />
          </div>
        </section>
      )}

      {recs.articles.length > 0 && (
        <section className="recommendation-panel panel-articles">
          <div className="panel-heading">
            <div className="panel-heading-icon">
              <FileText size={20} />
            </div>
            <div>
              <div className="panel-title-row">
                <h4>Articles</h4>
                <span>{recs.articles.length} recommendations</span>
              </div>
              <p>Thoughtful reads to give you a fresh perspective.</p>
            </div>
          </div>
          <div className="article-list">
            {recs.articles.map((article, i) => (
              <a
                key={i}
                className="article-item"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="article-icon">
                  <Leaf size={23} />
                </div>
                <div className="article-copy">
                  <strong>{article.title}</strong>
                  <small>{article.source}</small>
                  <p>{article.reason}</p>
                </div>
                <ExternalLink className="article-link" size={17} />
              </a>
            ))}
          </div>
          <div className="panel-footer">
            Open a recommended read <ArrowRight size={14} />
          </div>
        </section>
      )}

      {recs.videos.length > 0 && (
        <section className="recommendation-panel panel-videos">
          <div className="panel-heading">
            <div className="panel-heading-icon">
              <Play size={19} />
            </div>
            <div>
              <div className="panel-title-row">
                <h4>YouTube</h4>
                <span>{recs.videos.length} recommendations</span>
              </div>
              <p>Videos to help you relax, reflect or feel a little lighter.</p>
            </div>
          </div>
          <div className="video-list">
            {recs.videos.map((video, i) => (
              <a
                key={i}
                className="video-item"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt="" />
                  <span>
                    <Play size={15} fill="currentColor" />
                  </span>
                </div>
                <div className="video-copy">
                  <strong>{video.title}</strong>
                  <small>{video.channel}</small>
                  <p>{video.reason}</p>
                </div>
                <ExternalLink className="video-link" size={17} />
              </a>
            ))}
          </div>
          <div className="panel-footer">
            Watch on YouTube <ArrowRight size={14} />
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
