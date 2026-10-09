import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

const CLOUDINARY_CLOUD_NAME = "rwllkept";
const CLOUDINARY_UPLOAD_PRESET = "ztech_images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

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

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      setSelectedImage(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("The image must be 5 MB or smaller.");
      event.target.value = "";
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);

    // Clear the URL when choosing a new file.
    setFormData((previous) => ({
      ...previous,
      image: "",
    }));
  };

  const uploadImage = async (file) => {
    const uploadUrl =
      `https://api.cloudinary.com/v1_1/` +
      `${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    uploadData.append("folder", "ztech/projects");

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    });

    const result = await response.json();

    if (!response.ok || !result.secure_url) {
      console.error("Cloudinary upload failed:", result);
      throw new Error(
        result.error?.message || "Image upload failed."
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

      await addDoc(collection(db, "projects"), {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image: imageUrl,
        website: formData.website.trim(),
        technologies,
        featured: formData.featured,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/admin/projects");
    } catch (error) {
      console.error("Failed to add project:", error);
      setError(
        error.message ||
          "Failed to save project. Please try again."
      );
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
                <label htmlFor="projectImage">
                  Project Image
                </label>

                <input
                  id="projectImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <small>
                  Choose a JPG, PNG, or WebP image up to 5 MB.
                  It will upload to Cloudinary when you save.
                </small>

                {previewUrl && (
                  <div style={{ marginTop: "12px" }}>
                    <p>Image preview</p>
                    <img
                      src={previewUrl}
                      alt="Selected project preview"
                      style={{
                        width: "100%",
                        maxWidth: "420px",
                        maxHeight: "260px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                    <button
                      type="button"
                      className="admin-secondary-button"
                      style={{ marginTop: "10px" }}
                      onClick={() => setSelectedImage(null)}
                    >
                      Remove selected image
                    </button>
                  </div>
                )}

                <div style={{ marginTop: "16px" }}>
                  <label htmlFor="image">
                    Or use an existing image URL
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={(event) => {
                      handleChange(event);
                      setSelectedImage(null);
                    }}
                    placeholder="https://example.com/project-image.jpg"
                  />
                </div>
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
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? selectedImage
                  ? "Uploading image and saving..."
                  : "Saving..."
                : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddProject;