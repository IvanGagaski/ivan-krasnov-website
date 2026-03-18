import { useState, useEffect, useRef } from "react";
const photo = "https://i.ibb.co/C5hcYjw3/background-removed.png";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=DM+Sans:wght@300;400&display=swap";
document.head.appendChild(fontLink);

const TEXT  = "#f5f2ee";
const MUTED = "rgba(245,242,238,0.6)";
const TRAIL_CHARS = ["\u00d7","\u00b7","\u2014","*","\u25e6","\u2021","\u2020","\u2219","\u2010","\u2295","\u2591","\u25aa"];

const css = `
  * { margin:0; padding:0; box-sizing:border-box; }

  @keyframes blob1 {
    0%,100% { transform:translate(0,0) scale(1); }
    33%     { transform:translate(8%,12%) scale(1.08); }
    66%     { transform:translate(-6%,6%) scale(0.95); }
  }
  @keyframes trailFade {
    0%   { opacity:0.75; transform:scale(1) rotate(var(--r)); }
    100% { opacity:0;    transform:scale(0.3) rotate(calc(var(--r) + 40deg)) translateY(6px); }
  }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:none; }
  }

  .site {
    font-family: 'DM Sans', sans-serif;
    color: ${TEXT};
    height: 100vh;
    overflow: hidden;
    font-size: 145%;
    position: relative;
    isolation: isolate;
  }

  .site::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -2;
    background: #1a0800;
  }

  .site::after {
    content: '';
    position: fixed;
    inset: -30%;
    z-index: -1;
    background:
      radial-gradient(ellipse 50% 40% at 50% 50%, #7c2600 0%, transparent 65%),
      radial-gradient(ellipse 40% 50% at 5%  10%, #801f1f 0%, transparent 55%),
      radial-gradient(ellipse 45% 40% at 95% 25%, #005d53 0%, transparent 55%),
      radial-gradient(ellipse 50% 45% at 80% 90%, #00ddbd 0%, transparent 50%),
      radial-gradient(ellipse 40% 50% at 15% 85%, #5a7c44 0%, transparent 55%),
      radial-gradient(ellipse 35% 40% at 60% 15%, #bf3407 0%, transparent 50%),
      radial-gradient(ellipse 40% 35% at 30% 55%, #8b3c0d 0%, transparent 55%),
      radial-gradient(ellipse 35% 45% at 75% 55%, #823e00 0%, transparent 50%),
      radial-gradient(ellipse 30% 35% at 45% 75%, #bf3407 0%, transparent 50%),
      radial-gradient(ellipse 28% 30% at 70% 35%, #801f1f 0%, transparent 45%);
    filter: brightness(0.7);
    animation: blob1 18s ease-in-out infinite;
  }

  .trail-dot {
    position: fixed; pointer-events: none; z-index: 9999;
    font-family: 'DM Sans', sans-serif;
    color: rgba(245,242,238,0.55);
    animation: trailFade 0.8s ease-out forwards;
    user-select: none;
  }

  /* ===================== DESKTOP — SPLIT LAYOUT ===================== */
  .split {
    display: flex;
    height: 100vh;
  }

  .left {
    width: 45%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 52px 48px 60px 64px;
    border-right: 1px solid rgba(245,242,238,0.1);
    flex-shrink: 0;
  }

  .site-name {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 1.7rem; font-weight: 400; letter-spacing: 0.02em;
    margin-bottom: 48px;
  }

  .about-bio {
    font-size: 1rem; line-height: 1.9;
    color: rgba(245,242,238,0.78); font-weight: 300; max-width: 380px;
  }
  .about-bio p+p { margin-top: 1.2em; }
  .about-bio a { color: ${TEXT}; text-decoration: underline; text-underline-offset: 3px; }

  .contact-block {
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid rgba(245,242,238,0.12);
  }
  .contact-label {
    font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: ${MUTED}; margin-bottom: 12px; display: block;
  }
  .contact-email {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.88rem; font-weight: 400; display: block; margin-bottom: 8px;
  }
  .contact-link {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.88rem; font-weight: 400;
    color: ${TEXT}; text-decoration: underline; text-underline-offset: 3px;
    display: block;
  }

  .right {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    padding: 64px 48px 64px 52px;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0px, black 60px, black calc(100% - 40px), transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0px, black 60px, black calc(100% - 40px), transparent 100%);
  }

  /* ===================== MOBILE — STACKED LAYOUT ===================== */
  @media (max-width: 700px) {
    .site { height: auto; overflow: auto; font-size: 130%; }
    .split { display: none; }
    .mobile-layout { display: block; }

    .mobile-works .work-title { font-size: 1.05rem; }
    .mobile-works .work-role { font-size: 0.85rem; }
    .mobile-works .work-meta { font-size: 0.85rem; }
    .mobile-works .works-category { font-size: 0.72rem; }

    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 24px;
      background: transparent;
      border-bottom: 1px solid rgba(245,242,238,0.1);
    }
    .nav-name {
      font-family: 'Instrument Sans', sans-serif;
      font-size: 1rem; font-weight: 400; letter-spacing: 0.03em; cursor: pointer;
    }
    .nav-links { display: flex; gap: 18px; }
    .nav-link {
      font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase;
      cursor: pointer; color: ${MUTED}; font-weight: 400;
      transition: color 0.2s; border: none; background: none;
      font-family: 'DM Sans', sans-serif;
    }
    .nav-link:hover, .nav-link.active { color: ${TEXT}; }

    .mobile-scroll {
      height: 100vh;
      overflow-y: auto;
      -webkit-mask-image: linear-gradient(to bottom, transparent 0px, black 80px);
      mask-image: linear-gradient(to bottom, transparent 0px, black 80px);
    }
    .mobile-page {
      padding: 100px 24px 60px;
      max-width: 640px; margin: 0 auto;
      display: flex; flex-direction: column; align-items: flex-start; text-align: left;
      animation: fadeIn 0.45s ease;
    }
    .page-label {
      font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase;
      color: ${MUTED}; margin-bottom: 32px;
    }
    .mobile-about-bio {
      font-size: 1.05rem; line-height: 1.95;
      color: rgba(245,242,238,0.8); font-weight: 300; max-width: 540px;
    }
    .mobile-about-bio p+p { margin-top: 1.4em; }
    .mobile-about-bio a { color: ${TEXT}; text-decoration: underline; text-underline-offset: 3px; }
    .mobile-contact {
      margin-top: 48px; padding-top: 40px; width: 100%;
      border-top: 1px solid rgba(245,242,238,0.15);
    }
    .mobile-works { padding: 80px 24px 60px; max-width: 820px; margin: 0 auto; }
    .mobile-footer {
      padding: 20px 24px; text-align: center;
      font-size: 0.66rem; letter-spacing: 0.1em; color: ${MUTED}; text-transform: uppercase;
      border-top: 1px solid rgba(245,242,238,0.1);
    }
  }

  @media (min-width: 701px) {
    .mobile-layout { display: none; }
  }

  /* ===================== SHARED WORKS STYLES ===================== */
  .works-section { margin-bottom: 44px; }
  .works-category {
    font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
    margin-bottom: 16px; padding-bottom: 10px;
    border-bottom: 1px solid rgba(245,242,238,0.12);
    color: ${MUTED};
  }
  .work-item {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 11px 0 11px 12px;
    border-bottom: 1px solid rgba(245,242,238,0.07);
    gap: 20px; transition: opacity 0.2s;
  }
  .work-item:last-child { border-bottom: none; }
  .works-section:hover .work-item { opacity: 0.4; }
  .works-section:hover .work-item:hover { opacity: 1; }
  .works-section:hover .work-item:hover .work-title { font-weight: 400; }
  .works-section:hover .work-item:hover .work-title a { font-weight: 400; }
  @media (hover: none) { .works-section:hover .work-item { opacity: 1; } }

  .work-title {
    font-family: 'DM Sans', sans-serif; font-size: 1rem;
    color: ${TEXT}; flex: 1; font-weight: 300;
  }
  .work-role {
    color: ${MUTED}; font-size: 0.82rem;
    display: block; margin-bottom: 2px; font-weight: 300;
  }
  .work-title a { color: ${TEXT}; text-decoration: none; text-underline-offset: 3px; }
  .work-title a:hover { text-decoration: underline; }
  .work-sub { color: rgba(245,242,238,0.55); }
  .work-meta { font-size: 0.68rem; color: ${MUTED}; white-space: nowrap; letter-spacing: 0.05em; }

  .desktop-footer {
    margin-top: 24px; padding-top: 20px;
    border-top: 1px solid rgba(245,242,238,0.08);
    font-size: 0.58rem; letter-spacing: 0.1em; color: ${MUTED}; text-transform: uppercase;
  }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

const editorialWorks = [
  { role: "Research, transcription, editing", title: "A Sense of Rebellion", sub: "a podcast by Evgeny Morozov", meta: "2024", url: "https://www.sense-of-rebellion.com/" },
  { role: "Transcription, editing, website management", title: "The Santiago Boys", sub: "a podcast by Evgeny Morozov", meta: "2023", url: "https://www.the-santiago-boys.com/" },
  { role: "Transcription, fact-checking", title: "\u201cIn Berlin, These Queer Ukrainian Refugees Are Finding Community and Hope Amid Loss\u201d", sub: "Them", meta: "2022", url: "https://www.them.us/story/lgbtq-ukraine-refugees-in-berlin-resettling-war-with-russia" },
  { role: "Transcription, fact-checking", title: "\u201cIn France, Elder Care Comes with the Mail\u201d", sub: "The New Yorker", meta: "2019", url: "https://www.newyorker.com/culture/annals-of-inquiry/in-france-elder-care-comes-with-the-mail" },
  { role: "Interview, writing", title: "\u201cJennifer Herrema of Royal Trux | Lend Me Your Ears and You\u2019ll Get a 12-inch Alt-Noise Rock Joint, and Maybe an Autograph\u201d", sub: "Flaunt Magazine", meta: "2019", url: "https://www.flaunt.com/blog/jennifer-herrema-of-royal-trux" },
  { role: "Writing, editing", title: "\u201cThe Fuzz on Alex\u201d", sub: "The Berliner", meta: "2018", url: "https://www.the-berliner.com/politics/the-fuzz-on-alex/" },
  { role: "Writing, editing", title: "\u201cNon-Dude Artists\u2019 Den\u201d", sub: "The Berliner", meta: "2018", url: "https://www.the-berliner.com/berlin/non-dude-artists-den/" },
  { role: "Interview, writing", title: "\u201cHunter Hunt-Hendrix\u2019s New Video Opera May Be His Most Mind-Altering Work Yet\u201d", sub: "AdHoc", meta: "2018", url: "https://adhoc.fm/liturgy-hunter-hunt-hendrix-origin-of-the-alimonies-interview/" },
  { role: "Writing", title: "\u201cBichkraft \u2013 \u2018800\u2019 | Album Review\u201d", sub: "Post-Trash", meta: "2018", url: "https://post-trash.com/news/2018/3/19/bichkraft-800-album-review" },
  { role: "Writing", title: "\u201cDove Lady \u2013 \u2018F\u2019 | Album Review\u201d", sub: "Post-Trash", meta: "2018", url: "https://post-trash.com/news/2018/2/11/dove-lady-f-album-review" },
  { role: "Writing", title: "\u201cLumpy & The Dumpers \u2013 \u2018Those Pickled Fuckers\u2019 | Album Review\u201d", sub: "Post-Trash", meta: "2017", url: "https://post-trash.com/news/2017/12/14/lumpy-the-dumpers-those-pickled-fuckers-album-review" },
  { role: "Writing", title: "\u201cBanned Books \u2013 \u2018Banned Books\u2019 | Album Review\u201d", sub: "Post-Trash", meta: "2016", url: "https://post-trash.com/news/2016/3/20/banned-books" },
  { role: "Writing", title: "\u201cOur Favorite Albums of 2016\u201d", sub: "AdHoc", meta: "2016", url: "https://adhoc.fm/our-favorite-albums-2016/" },
];
const musicWorks = [
  { role: "Guitar, arrangements, production", title: "Dead Finks \u2013 \u201cNew Plastik Abyss\u201d", sub: "Bretford Records", meta: "2026", url: "https://deadfinkera.bandcamp.com/album/new-plastik-abyss" },
  { role: "Bass, songwriting, arrangements, production", title: "Children \u2013 \u201cAus Spitzen Knochen\u201d", sub: "Opus Lazuli Records", meta: "2024", url: "https://ccchildren.bandcamp.com/album/aus-spitzen-knochen" },
  { role: "Bass, guitar, songwriting, arrangements, production", title: "Children \u2013 \u201cCounterfeit Fire\u201d", sub: "Rapid Eye Records", meta: "2022", url: "https://ccchildren.bandcamp.com/album/counterfeit-fire" },
  { role: "Guitar, songwriting, arrangements", title: "Diocese \u2013 \u201cDiocese\u201d", sub: "Como Tapes", meta: "2015", url: "https://diocese.bandcamp.com/album/diocese" },
];
const radioWorks = [
  { title: "\u201cHumid Window\u201d", sub: "fsr.live Frozen Section Radio", meta: "2022\u20132024", url: "https://www.mixcloud.com/fsrlive/humid-window-14dec2022/" },
  { title: "\u201cDeep Puddle #58 boom boom pow w/ivan krasnov\u201d", sub: "Cashmere Radio", meta: "2023", url: "https://cashmereradio.com/episode/deep-puddle-58-boom-boom-pow-w-ivan-krasnov-dj-puddle/" },
  { title: "\u201cAutobahn Takeover with Joseph Thomas\u201d", sub: "Refuge Worldwide", meta: "2022", url: "https://refugeworldwide.com/radio/autobahn-joseph-thomas-and-ivan-krasnov-17-dec-2022" },
  { title: "\u201cMarlon et al. w/ Morpheena and DJ Ivy from the Eastside\u201d", sub: "Internet Public Radio", meta: "2019", url: "https://www.mixcloud.com/internetpublicradio/marlon-et-al-w-morpheena-and-dj-ivy-from-the-eastside-3rd-december-2019/" },
];

let trailIdx = 0;
function spawnDot(x, y) {
  const dot = document.createElement("div");
  const char = TRAIL_CHARS[trailIdx % TRAIL_CHARS.length];
  const size = 10 + Math.random() * 14;
  const rotation = Math.round((Math.random() - 0.5) * 60);
  trailIdx++;
  dot.className = "trail-dot";
  dot.textContent = char;
  dot.style.cssText = [
    "left:" + (x - size/2) + "px",
    "top:" + (y - size/2) + "px",
    "font-size:" + size + "px",
    "--r:" + rotation + "deg",
    "transform:rotate(" + rotation + "deg)",
    "animation-duration:" + (0.6 + Math.random() * 0.5) + "s",
  ].join(";");
  document.body.appendChild(dot);
  setTimeout(function() { dot.remove(); }, 1100);
}

function WorkSection({ label, works }) {
  const [active, setActive] = useState(false);
  return (
    <div className="works-section" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      <p className="works-category">{label}</p>
      {works.map(function(w, i) {
        return (
          <div key={i} className="work-item">
            <span className="work-title">
              {w.role && <span className="work-role">{w.role}</span>}
              {w.url ? <a href={w.url} target="_blank" rel="noopener noreferrer">{w.title}</a> : w.title}
              {" "}<span className="work-sub">{"\u2013"} {w.sub}</span>
            </span>
            <span className="work-meta">{w.meta}</span>
          </div>
        );
      })}
    </div>
  );
}

function AboutContent({ mobile }) {
  return (
    <>
      <div className="about-bio" style={mobile ? { fontSize: "1.05rem", maxWidth: "540px", color: "rgba(245,242,238,0.8)" } : {}}>
        <p>Ivan Krasnov is a writer, editor, translator, and musician based in Berlin, Germany. He is the operations manager at the non-profit knowledge curation platform{" "}
          <a href="https://www.the-syllabus.com/" target="_blank" rel="noopener noreferrer">The Syllabus</a>,{" "}
          where he previously worked as an editor and curator. His writing, editing, translation, and transcription work can be found in The New Yorker, Them, Flaunt Magazine, The Berliner, and more.</p>
        <p>He is also part of the North American and European underground and experimental music scenes and is a former member of the bands Dead Finks, Children, Maneka, Ben Special, Swings, BBC America, Diocese, Headmaster, and more.</p>
      </div>
      <div className="contact-block">
        <span className="contact-label">Contact</span>
        <span className="contact-email">krasnovmivan [at] gmail.com</span>
        <a href="https://www.linkedin.com/in/ivan-krasnov-283b1710a/" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
      </div>
    </>
  );
}

export default function App() {
  const [mobilePage, setMobilePage] = useState("about");
  const lastTrail = useRef(0);

  useEffect(function() {
    function onMove(e) {
      const now = Date.now();
      if (now - lastTrail.current < 40) return;
      lastTrail.current = now;
      spawnDot(e.clientX, e.clientY);
    }
    window.addEventListener("mousemove", onMove);
    return function() { window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <div className="site">

      {/* DESKTOP SPLIT LAYOUT */}
      <div className="split">
        <div className="left">
          <div className="site-name">Ivan Krasnov</div>
          <AboutContent mobile={false} />
        </div>
        <div className="right">
          <WorkSection label="Editorial" works={editorialWorks} />
          <WorkSection label="Music" works={musicWorks} />
          <WorkSection label="Radio" works={radioWorks} />
          <div className="desktop-footer">© {new Date().getFullYear()} Ivan Krasnov — All rights reserved</div>
        </div>
      </div>

      {/* MOBILE STACKED LAYOUT */}
      <div className="mobile-layout">
        <nav>
          <div className="nav-name">Ivan Krasnov</div>
          <div className="nav-links">
            {["about","works"].map(function(p) {
              return (
                <button key={p} className={"nav-link"+(mobilePage===p?" active":"")} onClick={function() { setMobilePage(p); window.scrollTo(0,0); }}>{p}</button>
              );
            })}
          </div>
        </nav>
        <div className="mobile-scroll">
          {mobilePage === "about" && (
            <div className="mobile-page">
              <p className="page-label">About</p>
              <AboutContent mobile={true} />
            </div>
          )}
          {mobilePage === "works" && (
            <div className="mobile-works">
              <WorkSection label="Editorial" works={editorialWorks} />
              <WorkSection label="Music" works={musicWorks} />
              <WorkSection label="Radio" works={radioWorks} />
            </div>
          )}
          <div className="mobile-footer">© {new Date().getFullYear()} Ivan Krasnov — All rights reserved</div>
        </div>
      </div>

    </div>
  );
}