import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../config/firebase";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSending(true);
    setSuccess(false);
    setError("");

    try {
      await addDoc(collection(db, "requests"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        service: formData.service,
        message: formData.message.trim(),
        status: "New",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        service: "",
        message: "",
      });

      setSuccess(true);
    } catch (error) {
      console.error("Failed to submit project request:", error);
      setError(
        "Something went wrong while sending your request. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="section-heading contact-heading">
          <p className="section-eyebrow">Start a Project</p>

          <h2>
            Have a problem?
            <br />
            <span>Let's build the solution.</span>
          </h2>

          <p className="section-description">
            Tell us what you are trying to build, improve, or solve.
            We will get back to you and discuss the best way forward.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <span>01</span>
              <div>
                <h3>Tell Us About It</h3>
                <p>
                  Share your idea, business problem, or technology needs.
                </p>
              </div>
            </div>

            <div className="contact-item">
              <span>02</span>
              <div>
                <h3>We Review</h3>
                <p>
                  We look at your requirements and determine how we can help.
                </p>
              </div>
            </div>

            <div className="contact-item">
              <span>03</span>
              <div>
                <h3>Let's Talk</h3>
                <p>
                  We discuss the project, scope, timeline, and next steps.
                </p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="company">Company / Organization</label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="service">What do you need?</label>

              <select
                id="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option value="Web Development">Web Development</option>
                <option value="Software Solutions">
                  Software Solutions
                </option>
                <option value="IT Services">IT Services</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Digital Solutions">Digital Solutions</option>
                <option value="Maintenance & Support">
                  Maintenance & Support
                </option>
                <option value="Other">Something Else</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="message">Tell us about your project</label>

              <textarea
                id="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe the problem you want us to solve..."
                required
              ></textarea>
            </div>

            {success && (
              <div className="contact-success">
                Your project request has been sent successfully. We'll be in
                touch soon.
              </div>
            )}

            {error && (
              <div className="contact-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
              disabled={sending}
            >
              {sending ? "Sending Request..." : "Send Project Request"}
              {!sending && <span>↗</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;