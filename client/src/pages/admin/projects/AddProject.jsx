import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

function AddProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    website: "",
    technologies: "",
    featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const technologies = formData.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);

      await addDoc(collection(db, "projects"), {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim(),
        website: formData.website.trim(),
        technologies,
        featured: formData.featured,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/admin/projects");
    } catch (error) {
      console.error("Failed to add project:", error);
      setError("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-manager">

        <div className="admin-manager-header">
          <div>
            <p className="admin-eyebrow">
              PROJECT MANAGEMENT
            </p>

            <h1>Add Project</h1>

            <span>
              Add a new project to the ZTECH portfolio.
            </span>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => navigate("/admin/projects")}
          >
            ← Back to Projects
          </button>
        </div>

        <form
          className="admin-project-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <p>PROJECT DETAILS</p>

              <span>
                Basic information about the project.
              </span>
            </div>

            <div className="admin-form-grid">

              <div className="admin-field">
                <label htmlFor="title">
                  Project Name
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. WOFU"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="category">
                  Project Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a category
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Custom Software">
                    Custom Software
                  </option>

                  <option value="E-Commerce / Logistics">
                    E-Commerce / Logistics
                  </option>

                  <option value="AI & Automation">
                    AI & Automation
                  </option>

                  <option value="IT Solutions">
                    IT Solutions
                  </option>

                  <option value="Digital Platforms">
                    Digital Platforms
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="admin-field">
                <label htmlFor="website">
                  Project Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="admin-field admin-field-full">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe the project and the problem it solves..."
                  rows="5"
                  required
                />
              </div>

              <div className="admin-field admin-field-full">
                <label htmlFor="image">
                  Project Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/project-image.jpg"
                />

                <small>
                  For now, use an image URL. We'll add direct
                  image uploads later with Firebase Storage.
                </small>
              </div>

              <div className="admin-field admin-field-full">
                <label htmlFor="technologies">
                  Technologies
                </label>

                <input
                  id="technologies"
                  name="technologies"
                  type="text"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Firebase, Node.js, Tailwind"
                />

                <small>
                  Separate technologies with commas.
                </small>
              </div>

            </div>
          </div>

          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <p>DISPLAY SETTINGS</p>

              <span>
                Control how the project appears on the website.
              </span>
            </div>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              <span>
                <strong>Featured Project</strong>

                <small>
                  Highlight this project on the public website.
                </small>
              </span>
            </label>

          </div>

          {error && (
            <div className="admin-form-error">
              {error}
            </div>
          )}

          <div className="admin-form-actions">

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => navigate("/admin/projects")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Project"}
            </button>

          </div>
        </form>

      </div>
    </AdminLayout>
  );
}

export default AddProject;