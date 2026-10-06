import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    website: "",
    technologies: "",
    featured: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectRef = doc(db, "projects", projectId);
        const projectSnapshot = await getDoc(projectRef);

        if (!projectSnapshot.exists()) {
          setError("Project not found.");
          setLoading(false);
          return;
        }

        const project = projectSnapshot.data();

        setFormData({
          title: project.title || "",
          category: project.category || "",
          description: project.description || "",
          image: project.image || "",
          website: project.website || "",
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : "",
          featured: project.featured || false,
        });
      } catch (error) {
        console.error("Failed to load project:", error);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

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

      const projectRef = doc(db, "projects", projectId);

      await updateDoc(projectRef, {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim(),
        website: formData.website.trim(),
        technologies,
        featured: formData.featured,
        updatedAt: serverTimestamp(),
      });

      navigate("/admin/projects");
    } catch (error) {
      console.error("Failed to update project:", error);
      setError("Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-manager">
          <div className="admin-manager-loading">
            Loading project...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !formData.title) {
    return (
      <AdminLayout>
        <div className="admin-manager">
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              !
            </div>

            <h2>Project unavailable</h2>

            <p>{error}</p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() => navigate("/admin/projects")}
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-manager">

        <div className="admin-manager-header">
          <div>
            <p className="admin-eyebrow">
              PROJECT MANAGEMENT
            </p>

            <h1>Edit Project</h1>

            <span>
              Update the information for this ZTECH project.
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
                Update the project's basic information.
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
                  We'll add direct image uploads later with
                  Firebase Storage.
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
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>
        </form>

      </div>
    </AdminLayout>
  );
}

export default EditProject;