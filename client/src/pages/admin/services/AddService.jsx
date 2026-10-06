import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

function AddService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    order: 1,
    active: true,
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
      await addDoc(collection(db, "services"), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        order: Number(formData.order) || 1,
        active: formData.active,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/admin/services");
    } catch (error) {
      console.error("Failed to add service:", error);
      setError(
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
                  For now, enter a short text or symbol.
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
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Service"}
            </button>

          </div>
        </form>

      </div>
    </AdminLayout>
  );
}

export default AddService;