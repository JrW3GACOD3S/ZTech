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

function EditService() {
const navigate = useNavigate();
const { serviceId } = useParams();

const [formData, setFormData] = useState({
name: "",
description: "",
icon: "",
image: "",
order: 1,
active: true,
});

const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
const loadService = async () => {
try {
const serviceRef = doc(db, "services", serviceId);
const serviceSnapshot = await getDoc(serviceRef);

    if (!serviceSnapshot.exists()) {
      setError("Service not found.");
      return;
    }

    const service = serviceSnapshot.data();

    setFormData({
      name: service.name || "",
      description: service.description || "",
      icon: service.icon || "",
      image: service.image || "",
      order: service.order ?? 1,
      active: service.active !== undefined ? service.active : true,
    });

    setImagePreview(service.image || "");
  } catch (error) {
    console.error("Failed to load service:", error);
    setError("Failed to load service.");
  } finally {
    setLoading(false);
  }
};

loadService();

}, [serviceId]);

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
  [name]:
    type === "checkbox"
      ? checked
      : name === "order"
        ? value
        : value,
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
uploadData.append("folder", "ztech/services");

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

  const serviceRef = doc(db, "services", serviceId);

  await updateDoc(serviceRef, {
    name: formData.name.trim(),
    description: formData.description.trim(),
    icon: formData.icon.trim(),
    image: imageUrl,
    order: Number(formData.order) || 1,
    active: formData.active,
    updatedAt: serverTimestamp(),
  });

  navigate("/admin/services");
} catch (error) {
  console.error("Failed to update service:", error);
  setError(
    error.message || "Failed to update service. Please try again."
  );
} finally {
  setSaving(false);
}

};

if (loading) {
return (
<AdminLayout>
<div className="admin-manager">
<div className="admin-manager-loading">Loading service...</div>
</div>
</AdminLayout>
);
}

if (error && !formData.name) {
return (
<AdminLayout>
<div className="admin-manager">
<div className="admin-empty-state">
<div className="admin-empty-icon">!</div>
<h2>Service unavailable</h2>
<p>{error}</p>
<button
type="button"
className="admin-primary-button"
onClick={() => navigate("/admin/services")}
>
← Back to Services
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
<p className="admin-eyebrow">SERVICE MANAGEMENT</p>
<h1>Edit Service</h1>
<span>Update this ZTECH service.</span>
</div>

      <button
        type="button"
        className="admin-secondary-button"
        onClick={() => navigate("/admin/services")}
      >
        ← Back to Services
      </button>
    </div>

    <form className="admin-project-form" onSubmit={handleSubmit}>
      <div className="admin-form-section">
        <div className="admin-form-section-heading">
          <p>SERVICE DETAILS</p>
          <span>Update the information about this service.</span>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="name">Service Name</label>
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
            <label htmlFor="icon">Icon / Visual</label>
            <input
              id="icon"
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g. WEB"
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="description">Description</label>
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

          <div className="admin-field">
            <label htmlFor="order">Display Order</label>
            <input
              id="order"
              name="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={handleChange}
            />
            <small>Lower numbers appear first.</small>
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="serviceImage">Service Image</label>
            <input
              id="serviceImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            <small>
              Choose a JPG, PNG, or WebP image up to 5 MB. A newly
              selected image replaces the current one when you save.
            </small>

            {imagePreview && (
              <div style={{ marginTop: "14px" }}>
                <img
                  src={imagePreview}
                  alt="Service preview"
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
                    const input = document.getElementById("serviceImage");
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
                placeholder="https://example.com/service-image.jpg"
              />
            </div>
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

      {error && <div className="admin-form-error">{error}</div>}

      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => navigate("/admin/services")}
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

export default EditService;