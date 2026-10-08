function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              Z<span>TECH</span>
            </a>

            <p>Technology that solves real problems.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <span className="footer-label">Navigate</span>
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
              <a href="#process">How We Work</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="footer-column">
              <span className="footer-label">Services</span>
              <a href="#services">Web Development</a>
              <a href="#services">Software Solutions</a>
              <a href="#services">IT Services</a>
              <a href="#services">AI & Automation</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ZTECH. All rights reserved.</p>

          <div>
            <p>Built with technology. Built for people.</p>

            <a
              href="/admin/login"
              style={{
                color: "white",
                display: "inline-block",
                marginTop: "12px",
                fontSize: "12px",
                textDecoration: "none"
              }}
            >
              Admin ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
