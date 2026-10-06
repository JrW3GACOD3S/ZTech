const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We understand your business, your goals, and the problem you need technology to solve.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We define the right solution, scope the project, and create a clear implementation plan.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Our team turns the plan into a working digital solution using modern technologies.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "We test, deploy, and help you get your new technology into the hands of its users.",
  },
  {
    number: "05",
    title: "Support",
    description:
      "We continue to maintain, improve, and support your solution as your needs evolve.",
  },
];

function HowWeWork() {
  return (
    <section className="process" id="process">
      <div className="process-container">
        <div className="section-heading process-heading">
          <p className="section-eyebrow">How We Work</p>

          <h2>
            From problem
            <br />
            <span>to solution.</span>
          </h2>

          <p className="section-description">
            A straightforward process designed to turn ideas and problems
            into practical technology.
          </p>
        </div>

        <div className="process-list">
          {steps.map((step) => (
            <article className="process-step" key={step.number}>
              <div className="process-number">{step.number}</div>

              <div className="process-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>

              <div className="process-line"></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWeWork;