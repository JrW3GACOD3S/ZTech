import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

function RequestsManager() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestsRef = collection(db, "requests");

    const unsubscribe = onSnapshot(
      requestsRef,
      (snapshot) => {
        const requestData = snapshot.docs
          .map((request) => ({
            id: request.id,
            ...request.data(),
          }))
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;

            return bTime - aTime;
          });

        setRequests(requestData);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load requests:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateStatus = async (requestId, status) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to update request status:", error);
      alert("Failed to update request status.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) {
      return "Just now";
    }

    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const totalRequests = requests.length;

  const newRequests = requests.filter(
    (request) => request.status === "New"
  ).length;

  const activeRequests = requests.filter(
    (request) =>
      request.status === "Contacted" ||
      request.status === "In Progress"
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  return (
    <AdminLayout>
      <div className="admin-manager">
        <div className="admin-manager-header">
          <div>
            <p className="admin-eyebrow">CLIENT MANAGEMENT</p>

            <h1>Project Requests</h1>

            <span>
              View and manage project requests submitted through the ZTECH
              website.
            </span>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>
        </div>

        {!loading && requests.length > 0 && (
          <div className="admin-request-stats">
            <div className="admin-request-stat">
              <span>Total Requests</span>
              <strong>{totalRequests}</strong>
            </div>

            <div className="admin-request-stat">
              <span>New</span>
              <strong>{newRequests}</strong>
            </div>

            <div className="admin-request-stat">
              <span>Active</span>
              <strong>{activeRequests}</strong>
            </div>

            <div className="admin-request-stat">
              <span>Completed</span>
              <strong>{completedRequests}</strong>
            </div>
          </div>
        )}

        {loading ? (
          <div className="admin-manager-loading">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">+</div>

            <h2>No requests yet</h2>

            <p>
              Project requests submitted through the website will appear
              here.
            </p>
          </div>
        ) : (
          <div className="admin-requests-list">
            {requests.map((request, index) => (
              <article
                key={request.id}
                className="admin-request-card"
              >
                <div className="admin-request-card-top">
                  <div className="admin-request-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="admin-request-date">
                    {formatDate(request.createdAt)}
                  </div>
                </div>

                <div className="admin-request-header">
                  <div className="admin-request-client">
                    <span className="admin-request-service">
                      {request.service || "General Request"}
                    </span>

                    <h2>
                      {request.name || "Unknown Client"}
                    </h2>

                    {request.company ? (
                      <p className="admin-request-company">
                        {request.company}
                      </p>
                    ) : (
                      <p className="admin-request-company">
                        Individual Client
                      </p>
                    )}
                  </div>

                  <div className="admin-request-status-wrapper">
                    <span>STATUS</span>

                    <select
                      value={request.status || "New"}
                      onChange={(event) =>
                        updateStatus(
                          request.id,
                          event.target.value
                        )
                      }
                      className={`admin-request-status status-${(
                        request.status || "New"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">
                        Contacted
                      </option>
                      <option value="In Progress">
                        In Progress
                      </option>
                      <option value="Completed">
                        Completed
                      </option>
                      <option value="Archived">
                        Archived
                      </option>
                    </select>
                  </div>
                </div>

                <div className="admin-request-details">
                  <div className="admin-request-detail">
                    <span>Email</span>

                    <a href={`mailto:${request.email}`}>
                      {request.email}
                    </a>
                  </div>

                  <div className="admin-request-detail">
                    <span>Service Requested</span>

                    <p>
                      {request.service ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="admin-request-message">
                  <div className="admin-request-message-heading">
                    <span>PROJECT DESCRIPTION</span>
                  </div>

                  <p>
                    {request.message ||
                      "The client did not provide a project description."}
                  </p>
                </div>

                <div className="admin-request-actions">
                  <a
                    href={`mailto:${request.email}?subject=ZTECH Project Request`}
                    className="admin-secondary-button"
                  >
                    Email Client ↗
                  </a>

                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={() =>
                      updateStatus(
                        request.id,
                        "Contacted"
                      )
                    }
                    disabled={
                      request.status === "Contacted"
                    }
                  >
                    Mark as Contacted
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default RequestsManager;
