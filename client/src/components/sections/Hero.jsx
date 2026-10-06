import { useEffect, useState } from "react";

function Hero() {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-status">
            <span className="hero-status-dot"></span>
            Building digital solutions
          </div>

          <p className="hero-eyebrow">
            Technology That Solves Real Problems
          </p>

          <h1 className="hero-title">
            We Build
            <br />
            <span>Digital Solutions.</span>
          </h1>

          <p className="hero-description">
            ZTECH creates modern websites, software, and technology
            solutions that help businesses turn ideas into reality.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="hero-button hero-button-primary">
              Start a Project
              <span>↗</span>
            </a>

            <a href="#projects" className="hero-button hero-button-secondary">
              View Our Work
            </a>
          </div>

          <div className="hero-meta">
            <span>Based in Zambia</span>
            <span>Available for projects</span>
          </div>
        </div>

        <div
          className={`hero-visual ${
            animationStarted ? "hero-animation-started" : ""
          }`}
        >
          <div className="hero-glow"></div>

          <div className="hero-grid">
            <div className="hero-grid-line"></div>
            <div className="hero-grid-line"></div>
            <div className="hero-grid-line"></div>
            <div className="hero-grid-line"></div>
          </div>

          <div className="hero-drawing">
            <svg
              className="hero-svg"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer orbit */}
              <circle
                className="draw-line hero-ring hero-ring-outer"
                cx="250"
                cy="250"
                r="205"
              />

              {/* Middle orbit */}
              <circle
                className="draw-line hero-ring hero-ring-middle"
                cx="250"
                cy="250"
                r="155"
              />

              {/* Inner orbit */}
              <circle
                className="draw-line hero-ring hero-ring-inner"
                cx="250"
                cy="250"
                r="105"
              />

              {/* Main Z symbol */}
              <path
                className="draw-line hero-z"
                d="M170 170 H330 L170 330 H330"
              />

              {/* Z diagonal reinforcement */}
              <path
                className="draw-line hero-z-detail"
                d="M190 190 H290 L190 290 H290"
              />

              {/* Connecting lines */}
              <path
                className="draw-line hero-connection hero-connection-one"
                d="M250 45 V95"
              />

              <path
                className="draw-line hero-connection hero-connection-two"
                d="M250 405 V455"
              />

              <path
                className="draw-line hero-connection hero-connection-three"
                d="M45 250 H95"
              />

              <path
                className="draw-line hero-connection hero-connection-four"
                d="M405 250 H455"
              />

              {/* Nodes */}
              <circle
                className="hero-node hero-node-one"
                cx="250"
                cy="45"
                r="5"
              />

              <circle
                className="hero-node hero-node-two"
                cx="250"
                cy="455"
                r="5"
              />

              <circle
                className="hero-node hero-node-three"
                cx="45"
                cy="250"
                r="5"
              />

              <circle
                className="hero-node hero-node-four"
                cx="455"
                cy="250"
                r="5"
              />

              {/* Center */}
              <circle
                className="hero-center-circle"
                cx="250"
                cy="250"
                r="43"
              />

              <text
                className="hero-center-text"
                x="250"
                y="262"
                textAnchor="middle"
              >
                Z
              </text>
            </svg>
          </div>

          <div className="hero-floating-card hero-card-top">
            <span>01</span>
            <strong>Ideas</strong>
          </div>

          <div className="hero-floating-card hero-card-bottom">
            <span>02</span>
            <strong>Solutions</strong>
          </div>

          <div className="hero-code">
            <span>&lt;solution</span>
            <span>&nbsp;&nbsp;builtFor="real-world"</span>
            <span>&nbsp;&nbsp;poweredBy="technology"</span>
            <span>/&gt;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;