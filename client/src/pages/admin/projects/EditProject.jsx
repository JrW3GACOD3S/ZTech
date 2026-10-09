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

const CLOUDINARY_CLOUD_NAME = "rwllkept";
const CLOUDINARY_UPLOAD_PRESET = "ztech_images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");
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

    setImagePreview(project.image || "");
  } catch (error) {
    console.error("Failed to load project:", error);
    setError("Failed to load project.");
  } finally {
    setLoading(false);
  }
};

loadProject();

}, [projectId]);

useEffect(() => {
if (!selectedImage) return;

const objectUrl = URL.createObjectURL(selectedImage);
setImagePreview(objectUrl);

return () => URL.revokeObjectURL(objectUrl);

}, [selectedImage]);

const handleChange = (event) => {
const { name, value, type, checked } = event.target;

setFormData((previous) => ({
  ...previous,
  [name]: type === "checkbox" ? checked : value,
}));

if (name === "image") {
  setSelectedImage(null);
  setImagePreview(value);
}

};

const handleImageChange = (event) => {
const file = event.target.files?.[0];

if (!file) return;

if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
  setError("Choose a JPG, PNG, or WebP image.");
  event.target.value = "";
  return;
}

if (file.size > MAX_IMAGE_SIZE) {
  setError("The image must be 5 MB or smaller.");
  event.target.value = "";
  return;
}

setError("");
setSelectedImage(file);
setFormData((previous) => ({ ...previous, image: "" }));

};

const uploadImage = async (file) => {
const uploadData = new FormData();
uploadData.append("file", file);
uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
uploadData.append("folder", "ztech/projects");

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  {
    method: "POST",
    body: uploadData,
  }
);

const result = await response.json();

if (!response.ok || !result.secure_url) {
  console.error("Cloudinary upload failed:", result);
  throw new Error(
    result.error?.message || "Image upload failed. Please try again."
  );
}

return result.secure_url;

};

const handleSubmit = async (event) => {
event.preventDefault();
setError("");
setSaving(true);

try {
  let imageUrl = formData.image.trim();

  if (selectedImage) {
    imageUrl = await uploadImage(selectedImage);
  }

  const technologies = formData.technologies
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  const projectRef = doc(db, "projects", projectId);

  await updateDoc(projectRef, {
    title: formData.title.trim(),
    category: formData.category,
    description: formData.description.trim(),
    image: imageUrl,
    website: formData.website.trim(),
    technologies,
    featured: formData.featured,
    updatedAt: serverTimestamp(),
  });

  navigate("/admin/projects");
} catch (error) {
  console.error("Failed to update project:", error);
  setError(
    error.message || "Failed to update project. Please try again."
  );
} finally {
  setSaving(false);
}

};

if (loading) {
return (
<AdminLayout>
<div className="admin-manager">
<div className="admin-manager-loading">Loading project...</div>
</div>
</AdminLayout>
);
}

if (!formData.title && error) {
return (
<AdminLayout>
<div className="admin-manager">
<div className="admin-empty-state">
<div className="admin-empty-icon">!</div>
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
<p className="admin-eyebrow">PROJECT MANAGEMENT</p>
<h1>Edit Project</h1>
<span>Update the information for this ZTECH project.</span>
</div>

      <button
        type="button"
        className="admin-secondary-button"
        onClick={() => navigate("/admin/projects")}
      >
        ← Back to Projects
      </button>
    </div>

    <form className="admin-project-form" onSubmit={handleSubmit}>
      <div className="admin-form-section">
        <div className="admin-form-section-heading">
          <p>PROJECT DETAILS</p>
          <span>Update the project's basic information.</span>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="title">Project Name</label>
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
            <label htmlFor="category">Project Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Custom Software">Custom Software</option>
              <option value="E-Commerce / Logistics">
                E-Commerce / Logistics
              </option>
              <option value="AI & Automation">AI & Automation</option>
              <option value="IT Solutions">IT Solutions</option>
              <option value="Digital Platforms">Digital Platforms</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="website">Project Website</label>
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
            <label htmlFor="description">Description</label>
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
            <label htmlFor="projectImage">Project Image</label>
            <input
              id="projectImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            <small>
              Choose a JPG, PNG, or WebP image up to 5 MB. Selecting a
              new image replaces the current image when you save.
            </small>

            {imagePreview && (
              <div style={{ marginTop: "14px" }}>
                <img
                  src={imagePreview}
                  alt="Project preview"
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "420px",
                    maxHeight: "260px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #333",
                  }}
                  onError={() => {
                    if (!selectedImage) setImagePreview("");
                  }}
                />

                <button
                  type="button"
                  className="admin-secondary-button"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    setSelectedImage(null);
                    setFormData((previous) => ({
                      ...previous,
                      image: "",
                    }));
                    setImagePreview("");
                    const input = document.getElementById("projectImage");
                    if (input) input.value = "";
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}

            <div style={{ marginTop: "16px" }}>
              <label htmlFor="image">Or use an existing image URL</label>
              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/project-image.jpg"
              />
            </div>
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="technologies">Technologies</label>
            <input
              id="technologies"
              name="technologies"
              type="text"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Firebase, Node.js, Tailwind"
            />
            <small>Separate technologies with commas.</small>
          </div>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-heading">
          <p>DISPLAY SETTINGS</p>
          <span>Control how the project appears on the website.</span>
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

      {error && <div className="admin-form-error">{error}</div>}

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