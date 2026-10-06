import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

function ServicesManager() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = collection(db, "services");

    const unsubscribe = onSnapshot(
      servicesRef,
      (snapshot) => {
        const serviceData = snapshot.docs
          .map((service) => ({
            id: service.id,
            ...service.data(),
          }))
          .sort(
            (a, b) =>
              Number(a.order || 0) - Number(b.order || 0)
          );

        setServices(serviceData);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load services:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "services", serviceId));
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-manager">

        <div className="admin-manager-header">
          <div>
            <p className="admin-eyebrow">
              CONTENT MANAGEMENT
            </p>

            <h1>Services</h1>

            <span>
              Manage the services displayed on the ZTECH website.
            </span>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => navigate("/admin/services/new")}
          >
            + Add Service
          </button>
        </div>

        {loading ? (
          <div className="admin-manager-loading">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              +
            </div>

            <h2>No services yet</h2>

            <p>
              Add your first service to start building the
              ZTECH services section.
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() => navigate("/admin/services/new")}
            >
              Add Your First Service
            </button>

          </div>
        ) : (
          <div className="admin-project-grid">

            {services.map((service) => (
              <article
                key={service.id}
                className="admin-project-card"
              >

                <div className="admin-project-image">
                  <span>
                    {service.icon || "Z"}
                  </span>
                </div>

                <div className="admin-project-content">

                  <div className="admin-project-top">

                    <h2>{service.name}</h2>

                    <span
                      className={
                        service.active
                          ? "admin-featured-badge"
                          : "admin-status-inactive"
                      }
                    >
                      {service.active ? "Active" : "Inactive"}
                    </span>

                  </div>

                  <p>
                    {service.description ||
                      "No service description provided."}
                  </p>

                  <small className="admin-service-order">
                    Display order: {service.order || 0}
                  </small>

                  <div className="admin-project-actions">

                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        navigate(
                          `/admin/services/edit/${service.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() =>
                        handleDelete(service.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ServicesManager;