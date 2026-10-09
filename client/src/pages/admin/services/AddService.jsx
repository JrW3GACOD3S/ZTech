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

function AddService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
    order: 1,
    active: true,
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
    uploadData.append("folder", "ztech/services");

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

      await addDoc(collection(db, "services"), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        image: imageUrl,
        order: Number(formData.order) || 1,
        active: formData.active,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/admin/services");
    } catch (error) {
      console.error("Failed to add service:", error);

      setError(
        error.message ||
          "Failed to save service. Please try again."
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
              SERVICE MANAGEMENT
            </p>

            <h1>Add Service</h1>

            <span>
              Add a new service to the ZTECH website.
            </span>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => navigate("/admin/services")}
          >
            ← Back to Services
          </button>
        </div>

        <form
          className="admin-project-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form-section">
            <div className="admin-form-section-heading">
              <p>SERVICE DETAILS</p>

              <span>
                Information about the service you provide.
              </span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="name">
                  Service Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="icon">
                  Icon / Visual
                </label>

                <input
                  id="icon"
                  name="icon"
                  type="text"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. WEB"
                />

                <small>
                  Enter a short text or symbol for the service icon.
                </small>
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
                  placeholder="Describe what this service provides..."
                  rows="5"
                  required
                />
              </div>

              <div className="admin-field admin-field-full">
                <label htmlFor="serviceImage">
                  Service Image
                </label>

                <input
                  id="serviceImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <small>
                  Choose a JPG, PNG, or WebP image up to 5 MB.
                  It uploads when you save the service.
                </small>

                {previewUrl && (
                  <div style={{ marginTop: "12px" }}>
                    <p>Image preview</p>

                    <img
                      src={previewUrl}
                      alt="Selected service preview"
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
                    placeholder="https://example.com/service-image.jpg"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="order">
                  Display Order
                </label>

                <input
                  id="order"
                  name="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={handleChange}
                />

                <small>
                  Lower numbers appear first.
                </small>
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <div className="admin-form-section-heading">
              <p>DISPLAY SETTINGS</p>

              <span>
                Control whether this service appears publicly.
              </span>
            </div>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />

              <span>
                <strong>Active Service</strong>

                <small>
                  Show this service on the public website.
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
              onClick={() => navigate("/admin/services")}
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
                : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddService;
