function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="section-heading about-heading">
          <p className="section-eyebrow">About ZTECH</p>

          <h2>
            Technology should
            <br />
            <span>solve something.</span>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-main">
            <p className="about-lead">
              ZTECH is a technology solutions company focused on building
              practical digital products for businesses, organizations, and
              individuals.
            </p>

            <p>
              We believe technology is most valuable when it solves a real
              problem. Whether that means building a website, developing
              custom software, automating a process, or providing reliable
              IT support, our approach starts with understanding the problem
              first.
            </p>

            <p>
              We combine modern technology with a practical understanding of
              the people and businesses using it to create solutions that are
              useful, scalable, and built for the real world.
            </p>
          </div>

          <div className="about-values">
            <div className="about-value">
              <span>01</span>
              <h3>Problem First</h3>
              <p>
                We start by understanding the challenge before deciding on
                the technology.
              </p>
            </div>

            <div className="about-value">
              <span>02</span>
              <h3>Built For People</h3>
              <p>
                Our solutions are designed around the people who actually
                use them.
              </p>
            </div>

            <div className="about-value">
              <span>03</span>
              <h3>Built To Grow</h3>
              <p>
                We build with the future in mind so solutions can evolve as
                your needs change.
              </p>
            </div>
          </div>
        </div>

        <div className="about-statement">
          <span>OUR APPROACH</span>
          <p>You bring the problem. We build the solution.</p>
        </div>
      </div>
    </section>
  );
}

export default About;